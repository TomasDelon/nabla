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
