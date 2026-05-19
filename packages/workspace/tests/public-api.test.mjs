import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const indexUrl = new URL("../src/index.ts", import.meta.url);

async function load() {
  return loadTsModule(indexUrl);
}

const EXPECTED_FUNCTIONS = [
  "buildBlockIndex",
  "buildFileIndex",
  "resolveWikiLinks",
  "resolveTransclusions",
  "createWorkspace",
  "buildBacklinkIndex",
  "normalizeWorkspacePath",
  "createSlug",
  "deduplicateSlugs",
  "buildHeadingIndex",
];

test("all expected function exports are present and callable", async () => {
  const mod = await load();

  for (const name of EXPECTED_FUNCTIONS) {
    assert.ok(name in mod, `expected export "${name}" to exist`);
    assert.equal(typeof mod[name], "function", `expected "${name}" to be a function`);
  }
});

test("createWorkspace returns correct shape", async () => {
  const { createWorkspace } = await load();

  const files = [
    { path: "a.md", source: "# Heading\n\nSee [[b]]." },
    { path: "b.md", source: "Content." },
  ];

  const result = createWorkspace(files);

  assert.ok(result.workspace, "should have workspace");
  assert.ok(result.fileIndex, "should have fileIndex");
  assert.ok(result.wikiLinks, "should have wikiLinks");
  assert.ok(result.transclusions, "should have transclusions");
  assert.ok(Array.isArray(result.diagnostics), "should have diagnostics array");

  assert.ok(result.workspace.index, "workspace should have index");
  assert.ok(Array.isArray(result.workspace.index.files), "index should have files");
  assert.ok(Array.isArray(result.workspace.index.headings), "index should have headings");
  assert.ok(Array.isArray(result.workspace.index.blocks), "index should have blocks");
  assert.ok(Array.isArray(result.workspace.index.backlinks), "index should have backlinks");

  assert.equal(result.workspace.index.files.length, 2);
  assert.equal(result.workspace.index.headings.length, 1);
  assert.equal(result.workspace.index.backlinks.length, 1);

  assert.ok(Array.isArray(result.fileIndex.entries), "fileIndex should have entries");
  assert.ok(Array.isArray(result.wikiLinks.resolutions), "wikiLinks should have resolutions");
  assert.ok(Array.isArray(result.transclusions.resolutions), "transclusions should have resolutions");
});

test("NABLA_WORKSPACE_PACKAGE constant is exported", async () => {
  const mod = await load();
  assert.equal(mod.NABLA_WORKSPACE_PACKAGE, "@nabla/workspace");
});
