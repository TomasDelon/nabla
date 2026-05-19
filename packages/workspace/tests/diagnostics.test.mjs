import test from "node:test";
import assert from "node:assert/strict";
import { DIAGNOSTIC_CODES } from "@nabla/markup";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const workspaceUrl = new URL("../src/workspace.ts", import.meta.url);

async function load() {
  return loadTsModule(workspaceUrl);
}

test("createWorkspace aggregates diagnostics in stable order: fileIndex, wikiLinks, transclusions", async () => {
  const { createWorkspace } = await load();

  const files = [
    { path: "dup.md", source: "First ^dup\n\nSecond ^dup\n" },
    { path: "links.md", source: "[[missing]]" },
    { path: "trans.md", source: "![[missing]]" },
  ];

  const result = createWorkspace(files);

  const codes = result.diagnostics.map(d => d.code);
  const fileIdx = codes.findIndex(c => c === DIAGNOSTIC_CODES.BLOCK_ID_DUPLICATE);
  const wikiIdx = codes.findIndex(c => c === DIAGNOSTIC_CODES.LINK_MISSING_TARGET);
  const transIdx = codes.findIndex(c => c === DIAGNOSTIC_CODES.TRANSCLUSION_MISSING_TARGET);

  assert.notEqual(fileIdx, -1, "BLOCK_ID_DUPLICATE diagnostic should be present");
  assert.notEqual(wikiIdx, -1, "LINK_MISSING_TARGET diagnostic should be present");
  assert.notEqual(transIdx, -1, "TRANSCLUSION_MISSING_TARGET diagnostic should be present");
  assert.ok(fileIdx < wikiIdx, "fileIndex diagnostics should come before wikiLink diagnostics");
  assert.ok(wikiIdx < transIdx, "wikiLink diagnostics should come before transclusion diagnostics");
});

test("createWorkspace wiki-link missing-target diagnostics use correct codes", async () => {
  const { createWorkspace } = await load();

  const files = [
    { path: "exists.md", source: "# Heading\n\nParagraph ^block1\n" },
    { path: "source.md", source: "[[missing]]\n[[exists#NoHeading]]\n[[exists^noblock]]" },
  ];

  const result = createWorkspace(files);

  const linkMissing = result.diagnostics.filter(d => d.code === DIAGNOSTIC_CODES.LINK_MISSING_TARGET);
  const headingMissing = result.diagnostics.filter(d => d.code === DIAGNOSTIC_CODES.HEADING_MISSING_TARGET);
  const blockMissing = result.diagnostics.filter(d => d.code === DIAGNOSTIC_CODES.BLOCK_MISSING_TARGET);

  assert.equal(linkMissing.length, 1, "missing note file should produce LINK_MISSING_TARGET");
  assert.equal(headingMissing.length, 1, "missing heading should produce HEADING_MISSING_TARGET");
  assert.equal(blockMissing.length, 1, "missing block should produce BLOCK_MISSING_TARGET");
});

test("createWorkspace transclusion missing-target diagnostics use correct code", async () => {
  const { createWorkspace } = await load();

  const files = [
    { path: "exists.md", source: "# Heading\n\nParagraph ^block1\n" },
    { path: "source.md", source: "![[missing]]\n![[exists#NoHeading]]\n![[exists^noblock]]" },
  ];

  const result = createWorkspace(files);

  const transMissing = result.diagnostics.filter(d => d.code === DIAGNOSTIC_CODES.TRANSCLUSION_MISSING_TARGET);

  assert.equal(transMissing.length, 3, "all three missing transclusion targets should produce TRANSCLUSION_MISSING_TARGET");
  transMissing.forEach(d => {
    assert.equal(d.severity, "warning");
  });
});

test("createWorkspace returns all diagnostics with severity warning", async () => {
  const { createWorkspace } = await load();

  const files = [
    { path: "dup.md", source: "First ^dup\n\nSecond ^dup\n" },
    { path: "links.md", source: "[[missing]]" },
    { path: "trans.md", source: "![[missing]]" },
  ];

  const result = createWorkspace(files);

  assert.ok(result.diagnostics.length > 0);
  result.diagnostics.forEach(d => {
    assert.equal(d.severity, "warning");
  });
});
