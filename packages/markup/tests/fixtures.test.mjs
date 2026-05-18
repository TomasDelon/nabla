import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ts from "typescript";

const fixturesModuleUrl = new URL("../src/fixtures.ts", import.meta.url);

let fixturesModulePromise;

async function loadFixturesModule() {
  fixturesModulePromise ??= (async () => {
    const source = await readFile(fixturesModuleUrl, "utf8");
    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022
      }
    });

    return import(
      `data:text/javascript;base64,${Buffer.from(transpiled.outputText, "utf8").toString("base64")}`
    );
  })();

  return fixturesModulePromise;
}

test("fixture loader resolves parser fixtures from the spec pack", async () => {
  const { loadParserFixture, resolveSpecFixturesRoot } = await loadFixturesModule();
  const fixturesRoot = await resolveSpecFixturesRoot();
  const fixture = await loadParserFixture("tags/basic");

  assert.match(fixturesRoot, /nabla_markdown_plus_spec_pack_v4_2_final\/fixtures$/);
  assert.equal(fixture.kind, "parser");
  assert.equal(fixture.fixtureId, "tags/basic");
  assert.equal(fixture.feature, "tags");
  assert.equal(fixture.name, "basic");
  assert.equal(fixture.ast.type, "document");
  assert.ok(Array.isArray(fixture.ast.children));
  assert.ok(Array.isArray(fixture.diagnostics));
  assert.equal(typeof fixture.input, "string");
  assert.equal(typeof fixture.output, "string");
  assert.match(fixture.paths.input, /\/fixtures\/tags\/basic\/input\.md$/);
});

test("fixture runner can iterate parser fixtures without including workspace fixtures", async () => {
  const { listParserFixtureIds, loadAllParserFixtures } = await loadFixturesModule();
  const fixtureIds = await listParserFixtureIds();
  const fixtures = await loadAllParserFixtures();

  assert.ok(fixtureIds.length > 0);
  assert.ok(fixtureIds.includes("tags/basic"));
  assert.ok(!fixtureIds.some((fixtureId) => fixtureId.startsWith("workspace/")));
  assert.equal(fixtures.length, fixtureIds.length);
  assert.ok(fixtures.every((fixture) => fixture.kind === "parser"));
});

test("fixture loader detects workspace fixtures as metadata only", async () => {
  const { loadMarkupFixture } = await loadFixturesModule();
  const fixture = await loadMarkupFixture("workspace/missing-target");

  assert.equal(fixture.kind, "workspace");
  assert.equal(fixture.fixtureId, "workspace/missing-target");
  assert.match(fixture.filesDirectory, /\/fixtures\/workspace\/missing-target\/files$/);
  assert.match(fixture.expectedIndexPath, /expected-index\.json$/);
  assert.match(fixture.diagnosticsPath, /diagnostics\.json$/);
});

test("fixture loader reports invalid JSON with the source file path", async () => {
  const { loadParserFixture } = await loadFixturesModule();
  const tempRoot = await mkdtemp(path.join(tmpdir(), "nabla-fixtures-"));
  const fixturesRoot = path.join(tempRoot, "fixtures");
  const fixtureDirectory = path.join(fixturesRoot, "demo", "broken");

  try {
    await mkdir(fixtureDirectory, { recursive: true });
    await writeFile(path.join(fixtureDirectory, "input.md"), "# broken\n", "utf8");
    await writeFile(path.join(fixtureDirectory, "ast.json"), "{\n", "utf8");
    await writeFile(path.join(fixtureDirectory, "output.md"), "# broken\n", "utf8");
    await writeFile(path.join(fixtureDirectory, "diagnostics.json"), "[]\n", "utf8");

    await assert.rejects(
      () => loadParserFixture("demo/broken", { fixturesRoot }),
      /Failed to parse JSON fixture .*ast\.json/
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("fixture runner comparison helpers accept loaded parser fixture expectations", async () => {
  const {
    compareFixtureAst,
    compareFixtureDiagnostics,
    compareFixtureInput,
    compareFixtureOutput,
    compareParserFixtureExpectation,
    loadParserFixture
  } = await loadFixturesModule();
  const fixture = await loadParserFixture("tags/basic");

  compareFixtureInput(fixture.input, fixture.input);
  compareFixtureAst(fixture.ast, fixture.ast);
  compareFixtureOutput(fixture.output, fixture.output);
  compareFixtureDiagnostics(fixture.diagnostics, fixture.diagnostics);
  compareParserFixtureExpectation(
    {
      input: fixture.input,
      ast: fixture.ast,
      output: fixture.output,
      diagnostics: fixture.diagnostics
    },
    fixture
  );
});

test("fixture runner diagnostics comparison ignores position when the fixture omits it", async () => {
  const { compareFixtureDiagnostics } = await loadFixturesModule();

  compareFixtureDiagnostics(
    [
      {
        severity: "warning",
        code: "NABLA_LINK_MISSING_TARGET",
        message: "missing wiki target",
        position: {
          start: { line: 1, column: 1, offset: 0 },
          end: { line: 1, column: 2, offset: 1 }
        }
      }
    ],
    [
      {
        severity: "warning",
        code: "NABLA_LINK_MISSING_TARGET",
        message: "missing wiki target"
      }
    ]
  );
});

test("fixture runner diagnostics comparison requires exact position when the fixture includes it", async () => {
  const { compareFixtureDiagnostics } = await loadFixturesModule();

  assert.throws(
    () =>
      compareFixtureDiagnostics(
        [
          {
            severity: "warning",
            code: "NABLA_LINK_MISSING_TARGET",
            message: "missing wiki target",
            position: {
              start: { line: 1, column: 1, offset: 0 },
              end: { line: 1, column: 2, offset: 1 }
            }
          }
        ],
        [
          {
            severity: "warning",
            code: "NABLA_LINK_MISSING_TARGET",
            message: "missing wiki target",
            position: {
              start: { line: 2, column: 1, offset: 2 },
              end: { line: 2, column: 2, offset: 3 }
            }
          }
        ]
      ),
    /diagnostics\[0\]\.position comparison failed/
  );
});
