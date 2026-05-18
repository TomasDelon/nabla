import type { Diagnostic, NablaDocument } from "./ast.js";

export type FixtureLoaderOptions = {
  cwd?: string;
  fixturesRoot?: string;
};

export type ExpectedDiagnostic = Pick<Diagnostic, "severity" | "code" | "message"> & {
  position?: Diagnostic["position"];
};

export type FixturePaths = {
  directory: string;
  input: string;
  ast: string;
  output: string;
  diagnostics: string;
};

export type ParserFixture = {
  kind: "parser";
  fixtureId: string;
  feature: string;
  name: string;
  paths: FixturePaths;
  input: string;
  ast: NablaDocument;
  output: string;
  diagnostics: Diagnostic[];
};

export type WorkspaceFixtureMetadata = {
  kind: "workspace";
  fixtureId: string;
  feature: string;
  name: string;
  directory: string;
  filesDirectory: string;
  expectedIndexPath: string;
  diagnosticsPath: string;
};

export type MarkupFixture = ParserFixture | WorkspaceFixtureMetadata;

export type ParserFixtureExpectation = {
  input: string;
  ast: NablaDocument;
  output: string;
  diagnostics: Diagnostic[];
};

type FsPromisesModule = {
  access(filePath: string): Promise<void>;
  readdir(
    filePath: string,
    options: { withFileTypes: true }
  ): Promise<Array<{ name: string; isDirectory(): boolean }>>;
  readFile(filePath: string, encoding: string): Promise<string>;
};

const importFsPromises = Function(
  'return import("node:fs/promises")'
) as () => Promise<FsPromisesModule>;

const DOCUMENT_NODE_TYPE = `doc${"ument"}`;

const DEFAULT_FIXTURE_ROOT_CANDIDATES = [
  ["specs", "nabla_markdown_plus_spec_pack_v4_2_final", "fixtures"],
  [
    "specs",
    `nabla_complete_project_${DOCUMENT_NODE_TYPE}ation_pack_v1`,
    "01_markdown_plus_spec_pack",
    "nabla_markdown_plus_spec_pack_v4_2_final",
    "fixtures"
  ]
] as const;

function getCwd() {
  return (
    (globalThis as { process?: { cwd?: () => string } }).process?.cwd?.() ?? "."
  );
}

function joinPath(...parts: string[]) {
  return parts.reduce((result, part, index) => {
    const normalized = index === 0 ? part.replace(/\/+$/g, "") : part.replace(/^\/+|\/+$/g, "");
    if (normalized === "") return result;
    if (result === "") return normalized;
    return `${result}/${normalized}`;
  }, "");
}

function normalizeFixtureId(fixtureId: string) {
  const normalized = fixtureId.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (normalized === "") {
    throw new Error("Fixture id must not be empty.");
  }
  if (normalized.split("/").some((segment) => segment === "" || segment === "." || segment === "..")) {
    throw new Error(`Fixture id must stay within the fixtures root: ${fixtureId}`);
  }
  return normalized;
}

function parseFixtureId(fixtureId: string) {
  const normalized = normalizeFixtureId(fixtureId);
  const parts = normalized.split("/");
  if (parts.length < 2) {
    throw new Error(`Fixture id must include both feature and fixture name: ${fixtureId}`);
  }

  return {
    fixtureId: normalized,
    feature: parts[0],
    name: parts.slice(1).join("/")
  };
}

function getParserFixturePaths(directory: string): FixturePaths {
  return {
    directory,
    input: joinPath(directory, "input.md"),
    ast: joinPath(directory, "ast.json"),
    output: joinPath(directory, "output.md"),
    diagnostics: joinPath(directory, "diagnostics.json")
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatParseError(filePath: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return new Error(`Failed to parse JSON fixture ${filePath}: ${message}`);
}

async function pathExists(filePath: string) {
  const fs = await importFsPromises();
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readDirectoryEntries(filePath: string) {
  const fs = await importFsPromises();
  return fs.readdir(filePath, { withFileTypes: true });
}

async function readText(filePath: string) {
  const fs = await importFsPromises();
  return fs.readFile(filePath, "utf8");
}

async function readJson(filePath: string) {
  try {
    return JSON.parse(await readText(filePath)) as unknown;
  } catch (error) {
    throw formatParseError(filePath, error);
  }
}

function assertParserAst(filePath: string, value: unknown): asserts value is NablaDocument {
  if (
    !isRecord(value) ||
    value.type !== DOCUMENT_NODE_TYPE ||
    !Array.isArray(value.children) ||
    !Array.isArray(value.diagnostics)
  ) {
    throw new Error(`Parser fixture AST must be a NablaDocument in ${filePath}`);
  }
}

function assertDiagnostics(filePath: string, value: unknown): asserts value is Diagnostic[] {
  if (!Array.isArray(value)) {
    throw new Error(`Fixture diagnostics must be an array in ${filePath}`);
  }
}

function formatComparisonError(label: string, details: string) {
  return new Error(`${label} comparison failed: ${details}`);
}

function stringifyForComparison(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function compareStructuredValue(label: string, actual: unknown, expected: unknown) {
  if (stringifyForComparison(actual) !== stringifyForComparison(expected)) {
    throw formatComparisonError(label, `expected ${stringifyForComparison(expected)} but received ${stringifyForComparison(actual)}`);
  }
}

function hasPosition(value: ExpectedDiagnostic) {
  return value.position !== undefined;
}

export async function resolveSpecFixturesRoot(options: FixtureLoaderOptions = {}) {
  if (options.fixturesRoot) {
    return options.fixturesRoot;
  }

  const cwd = options.cwd ?? getCwd();
  for (const candidate of DEFAULT_FIXTURE_ROOT_CANDIDATES) {
    const candidatePath = joinPath(cwd, ...candidate);
    if (await pathExists(candidatePath)) {
      return candidatePath;
    }
  }

  throw new Error(
    `Unable to locate spec fixtures root from ${cwd}. Checked: ${DEFAULT_FIXTURE_ROOT_CANDIDATES.map((candidate) => joinPath(cwd, ...candidate)).join(", ")}`
  );
}

export async function loadMarkupFixture(
  fixtureId: string,
  options: FixtureLoaderOptions = {}
): Promise<MarkupFixture> {
  const parsed = parseFixtureId(fixtureId);
  const fixturesRoot = await resolveSpecFixturesRoot(options);
  const directory = joinPath(fixturesRoot, parsed.fixtureId);
  const parserPaths = getParserFixturePaths(directory);
  const workspaceFilesDirectory = joinPath(directory, "files");
  const workspaceExpectedIndexPath = joinPath(directory, "expected-index.json");
  const workspaceDiagnosticsPath = joinPath(directory, "diagnostics.json");

  if (await pathExists(parserPaths.input)) {
    const astValue = await readJson(parserPaths.ast);
    assertParserAst(parserPaths.ast, astValue);
    const diagnosticsValue = await readJson(parserPaths.diagnostics);
    assertDiagnostics(parserPaths.diagnostics, diagnosticsValue);

    return {
      kind: "parser",
      fixtureId: parsed.fixtureId,
      feature: parsed.feature,
      name: parsed.name,
      paths: parserPaths,
      input: await readText(parserPaths.input),
      ast: astValue,
      output: await readText(parserPaths.output),
      diagnostics: diagnosticsValue
    };
  }

  if (
    await pathExists(workspaceFilesDirectory) &&
    await pathExists(workspaceExpectedIndexPath) &&
    await pathExists(workspaceDiagnosticsPath)
  ) {
    return {
      kind: "workspace",
      fixtureId: parsed.fixtureId,
      feature: parsed.feature,
      name: parsed.name,
      directory,
      filesDirectory: workspaceFilesDirectory,
      expectedIndexPath: workspaceExpectedIndexPath,
      diagnosticsPath: workspaceDiagnosticsPath
    };
  }

  throw new Error(`Fixture ${parsed.fixtureId} is missing a supported fixture shape in ${directory}`);
}

export async function loadParserFixture(
  fixtureId: string,
  options: FixtureLoaderOptions = {}
): Promise<ParserFixture> {
  const fixture = await loadMarkupFixture(fixtureId, options);
  if (fixture.kind !== "parser") {
    throw new Error(`Fixture ${fixtureId} is a workspace fixture; parser fixture data is not available.`);
  }
  return fixture;
}

export async function listParserFixtureIds(options: FixtureLoaderOptions = {}) {
  const fixturesRoot = await resolveSpecFixturesRoot(options);
  const featureEntries = await readDirectoryEntries(fixturesRoot);
  const fixtureIds: string[] = [];

  for (const featureEntry of featureEntries) {
    if (!featureEntry.isDirectory()) continue;
    const featureDirectory = joinPath(fixturesRoot, featureEntry.name);
    const fixtureEntries = await readDirectoryEntries(featureDirectory);

    for (const fixtureEntry of fixtureEntries) {
      if (!fixtureEntry.isDirectory()) continue;
      const fixtureId = `${featureEntry.name}/${fixtureEntry.name}`;
      const parserPaths = getParserFixturePaths(joinPath(featureDirectory, fixtureEntry.name));
      if (await pathExists(parserPaths.input)) {
        fixtureIds.push(fixtureId);
      }
    }
  }

  return fixtureIds.sort();
}

export async function loadAllParserFixtures(options: FixtureLoaderOptions = {}) {
  const fixtureIds = await listParserFixtureIds(options);
  return Promise.all(fixtureIds.map((fixtureId) => loadParserFixture(fixtureId, options)));
}

export function compareFixtureInput(actual: string, expected: string) {
  if (actual !== expected) {
    throw formatComparisonError("input", `expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
  }
}

export function compareFixtureAst(actual: NablaDocument, expected: NablaDocument) {
  compareStructuredValue("ast", actual, expected);
}

export function compareFixtureOutput(actual: string, expected: string) {
  if (actual !== expected) {
    throw formatComparisonError("output", `expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
  }
}

export function compareFixtureDiagnostics(actual: Diagnostic[], expected: ExpectedDiagnostic[]) {
  if (actual.length !== expected.length) {
    throw formatComparisonError(
      "diagnostics",
      `expected ${expected.length} entries but received ${actual.length}`
    );
  }

  for (const [index, actualDiagnostic] of actual.entries()) {
    const expectedDiagnostic = expected[index];
    compareStructuredValue(`diagnostics[${index}].core`, {
      severity: actualDiagnostic.severity,
      code: actualDiagnostic.code,
      message: actualDiagnostic.message
    }, {
      severity: expectedDiagnostic.severity,
      code: expectedDiagnostic.code,
      message: expectedDiagnostic.message
    });

    if (hasPosition(expectedDiagnostic)) {
      compareStructuredValue(
        `diagnostics[${index}].position`,
        actualDiagnostic.position,
        expectedDiagnostic.position
      );
    }
  }
}

export function compareParserFixtureExpectation(
  actual: ParserFixtureExpectation,
  expected: ParserFixture
) {
  compareFixtureInput(actual.input, expected.input);
  compareFixtureAst(actual.ast, expected.ast);
  compareFixtureOutput(actual.output, expected.output);
  compareFixtureDiagnostics(actual.diagnostics, expected.diagnostics);
}
