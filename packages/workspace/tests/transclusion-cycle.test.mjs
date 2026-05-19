import test from "node:test";
import assert from "node:assert/strict";
import { DIAGNOSTIC_CODES } from "@nabla/markup";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const fileIndexUrl = new URL("../src/file-index.ts", import.meta.url);
const resolverUrl = new URL("../src/transclusion-resolver.ts", import.meta.url);

const TRANSCLUSION_CYCLE = DIAGNOSTIC_CODES.TRANSCLUSION_CYCLE;

async function loadFileIndex() {
  return loadTsModule(fileIndexUrl);
}

async function loadResolver() {
  return loadTsModule(resolverUrl);
}

test("detects self-cycle: A transcludes A", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[a]]\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, TRANSCLUSION_CYCLE);
  assert.equal(result.diagnostics[0].severity, "error");
  assert.equal(result.diagnostics[0].message, "Transclusion cycle detected.");
});

test("detects two-node cycle: A -> B -> A", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[b]]\n" },
    { path: "b.md", source: "![[a]]\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 2);
  assert.ok(result.diagnostics.length >= 1);
  assert.equal(result.diagnostics[0].code, TRANSCLUSION_CYCLE);
  assert.equal(result.diagnostics[0].severity, "error");
});

test("detects longer cycle: A -> B -> C -> A", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[b]]\n" },
    { path: "b.md", source: "![[c]]\n" },
    { path: "c.md", source: "![[a]]\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 3);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, TRANSCLUSION_CYCLE);
});

test("does not emit cycle for acyclic chain", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[b]]\n" },
    { path: "b.md", source: "![[c]]\n" },
    { path: "c.md", source: "No transclusions here.\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 2);
  assert.equal(result.diagnostics.length, 0);
});

test("does not emit cycle for diamond dependency", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[b]]\n![[c]]\n" },
    { path: "b.md", source: "![[d]]\n" },
    { path: "c.md", source: "![[d]]\n" },
    { path: "d.md", source: "No transclusions.\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.diagnostics.length, 0);
});

test("preserves existing direct transclusion resolution for acyclic graphs", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "source.md", source: "![[target]]\n" },
    { path: "target.md", source: "Content.\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.diagnostics.length, 0);
});

test("cycle detection coexists with valid resolutions", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[b]]\n![[valid]]\n" },
    { path: "b.md", source: "![[a]]\n" },
    { path: "valid.md", source: "Valid content.\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  const cycleDiags = result.diagnostics.filter(d => d.code === TRANSCLUSION_CYCLE);
  assert.equal(result.resolutions.length, 3);
  assert.ok(cycleDiags.length >= 1);

  const validRes = result.resolutions.find(r => r.target === "valid");
  assert.ok(validRes);
  assert.equal(validRes.resolved, true);
});
