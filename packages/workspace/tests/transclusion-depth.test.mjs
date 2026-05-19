import test from "node:test";
import assert from "node:assert/strict";
import { DIAGNOSTIC_CODES } from "@nabla/markup";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const fileIndexUrl = new URL("../src/file-index.ts", import.meta.url);
const resolverUrl = new URL("../src/transclusion-resolver.ts", import.meta.url);
const workspaceUrl = new URL("../src/workspace.ts", import.meta.url);

const TRANSCLUSION_DEPTH_LIMIT = DIAGNOSTIC_CODES.TRANSCLUSION_DEPTH_LIMIT;
const TRANSCLUSION_CYCLE = DIAGNOSTIC_CODES.TRANSCLUSION_CYCLE;

async function loadFileIndex() {
  return loadTsModule(fileIndexUrl);
}

async function loadResolver() {
  return loadTsModule(resolverUrl);
}

async function loadWorkspace() {
  return loadTsModule(workspaceUrl);
}

function chain(...names) {
  return names.map((name, i) => {
    const isLast = i === names.length - 1;
    return {
      path: `${name}.md`,
      source: isLast ? "Leaf.\n" : `![[${names[i + 1]}]]\n`,
    };
  });
}

test("default max depth: chain of 6 emits depth-limit for 7th file", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = chain("a", "b", "c", "d", "e", "f", "g");
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks, 5);

  const diags = result.diagnostics.filter(d => d.code === TRANSCLUSION_DEPTH_LIMIT);
  assert.equal(diags.length, 1);
  assert.equal(diags[0].severity, "warning");
  assert.equal(diags[0].message, "Transclusion depth limit reached.");
  assert.equal(result.resolutions.length, 5);
});

test("custom max depth via createWorkspace limits chain", async () => {
  const { createWorkspace } = await loadWorkspace();

  const files = chain("a", "b", "c", "d", "e", "f");
  const result = createWorkspace(files, { maxTransclusionDepth: 3 });

  const diags = result.diagnostics.filter(d => d.code === TRANSCLUSION_DEPTH_LIMIT);
  assert.equal(diags.length, 1);
  assert.equal(result.transclusions.resolutions.length, 3);
});

test("short acyclic chain does not emit depth-limit diagnostic", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = chain("a", "b", "c");
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks, 5);

  const diags = result.diagnostics.filter(d => d.code === TRANSCLUSION_DEPTH_LIMIT);
  assert.equal(diags.length, 0);
  assert.equal(result.resolutions.length, 2);
});

test("single transclusion within maxDepth=1 does not emit depth-limit", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[b]]\n" },
    { path: "b.md", source: "Leaf.\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks, 1);

  const diags = result.diagnostics.filter(d => d.code === TRANSCLUSION_DEPTH_LIMIT);
  assert.equal(diags.length, 0);
  assert.equal(result.resolutions.length, 1);
});

test("diamond dependency does not emit depth-limit", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[b]]\n![[c]]\n" },
    { path: "b.md", source: "![[d]]\n" },
    { path: "c.md", source: "![[d]]\n" },
    { path: "d.md", source: "Leaf.\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks, 10);

  const diags = result.diagnostics.filter(d => d.code === TRANSCLUSION_DEPTH_LIMIT);
  assert.equal(diags.length, 0);
});

test("cycle detection still works alongside depth limit", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[b]]\n" },
    { path: "b.md", source: "![[c]]\n" },
    { path: "c.md", source: "![[a]]\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks, 10);

  const cycleDiags = result.diagnostics.filter(d => d.code === TRANSCLUSION_CYCLE);
  const depthDiags = result.diagnostics.filter(d => d.code === TRANSCLUSION_DEPTH_LIMIT);
  assert.ok(cycleDiags.length >= 1, "cycle still detected with maxDepth");
  assert.equal(depthDiags.length, 0, "depth limit not exceeded");
});

test("depth limit stops before cycle when root leads into cycle", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "root.md", source: "![[a]]\n" },
    { path: "a.md", source: "![[b]]\n" },
    { path: "b.md", source: "![[c]]\n" },
    { path: "c.md", source: "![[a]]\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks, 2);

  const cycleDiags = result.diagnostics.filter(d => d.code === TRANSCLUSION_CYCLE);
  const depthDiags = result.diagnostics.filter(d => d.code === TRANSCLUSION_DEPTH_LIMIT);
  assert.equal(cycleDiags.length, 0, "cycle not reached before depth limit");
  assert.equal(depthDiags.length, 1, "depth limit halts before cycle");
  assert.equal(result.resolutions.length, 2);
});

test("closed cycle still detected when depth limit is high", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "![[b]]\n" },
    { path: "b.md", source: "![[c]]\n" },
    { path: "c.md", source: "![[a]]\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks, 10);

  const cycleDiags = result.diagnostics.filter(d => d.code === TRANSCLUSION_CYCLE);
  const depthDiags = result.diagnostics.filter(d => d.code === TRANSCLUSION_DEPTH_LIMIT);
  assert.equal(cycleDiags.length, 1, "closed cycle detected with depth limit");
  assert.equal(depthDiags.length, 0, "no depth limit for closed cycle");
});

test("acyclic chain still passes with default createWorkspace", async () => {
  const { createWorkspace } = await loadWorkspace();

  const files = chain("a", "b", "c");
  const result = createWorkspace(files);

  const depthDiags = result.diagnostics.filter(d => d.code === TRANSCLUSION_DEPTH_LIMIT);
  assert.equal(depthDiags.length, 0);
  assert.equal(result.transclusions.resolutions.length, 2);
});

test("direct transclusion resolution still works", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "source.md", source: "![[target]]\n" },
    { path: "target.md", source: "Content.\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks, 5);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.diagnostics.length, 0);
});
