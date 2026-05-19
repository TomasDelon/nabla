import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const fileIndexUrl = new URL("../src/file-index.ts", import.meta.url);
const resolverUrl = new URL("../src/transclusion-resolver.ts", import.meta.url);

async function loadFileIndex() {
  return loadTsModule(fileIndexUrl);
}

async function loadResolver() {
  return loadTsModule(resolverUrl);
}

const TRANSCLUSION_MISSING = "NABLA_TRANSCLUSION_MISSING_TARGET";

test("resolves ![[note]] to existing file", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "note-a.md", source: "Content." },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(
    [{ path: "source.md", source: "![[note-a]]\n" }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].resolvedFilePath, "note-a.md");
  assert.equal(result.resolutions[0].target, "note-a");
  assert.equal(result.diagnostics.length, 0);
});

test("resolves ![[note#heading]] to heading slug", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [{ path: "doc.md", source: "# My Heading\nContent." }];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(
    [{ path: "source.md", source: "![[doc#My Heading]]\n" }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].heading, "My Heading");
  assert.equal(result.resolutions[0].target, "doc");
});

test("resolves ![[note^block]] to block ID", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [{ path: "doc.md", source: "Paragraph ^block1\n" }];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(
    [{ path: "source.md", source: "![[doc^block1]]\n" }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].blockId, "block1");
});

test("resolves ![[note#^block]] compatible syntax", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [{ path: "doc.md", source: "Paragraph ^block1\n" }];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(
    [{ path: "source.md", source: "![[doc#^block1]]\n" }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].blockId, "block1");
});

test("resolves ![[#heading]] to same-file heading", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [{ path: "doc.md", source: "# My Heading\n![[#My Heading]]\n" }];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].heading, "My Heading");
  assert.equal(result.resolutions[0].target, "");
});

test("resolves ![[^block]] to same-file block", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [{ path: "doc.md", source: "Paragraph ^myblock\n![[^myblock]]\n" }];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].blockId, "myblock");
});

test("missing transclusion target produces TRANSCLUSION_MISSING_TARGET diagnostic", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [{ path: "some-file.md", source: "![[nonexistent]]\n" }];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, false);
  assert.equal(result.resolutions[0].target, "nonexistent");
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, TRANSCLUSION_MISSING);
});

test("missing heading on existing file produces TRANSCLUSION_MISSING_TARGET", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "exists.md", source: "Content." },
    { path: "source.md", source: "![[exists#MissingHeading]]\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, false);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, TRANSCLUSION_MISSING);
});

test("missing block on existing file produces TRANSCLUSION_MISSING_TARGET", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "exists.md", source: "Content." },
    { path: "source.md", source: "![[exists^missingblock]]\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, false);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, TRANSCLUSION_MISSING);
});

test("missing target with nonexistent file and heading produces TRANSCLUSION_MISSING_TARGET", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [{ path: "source.md", source: "![[nonexistent#Heading]]\n" }];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, false);
  assert.equal(result.diagnostics[0].code, TRANSCLUSION_MISSING);
});

test("no transclusions produces empty result", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [{ path: "plain.md", source: "Just text.\n" }];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 0);
  assert.equal(result.diagnostics.length, 0);
});

test("resolves multiple transclusions from one file", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "a.md", source: "# Heading A\n" },
    { path: "b.md", source: "Content." },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(
    [{ path: "source.md", source: "![[a#Heading A]]\n\n![[b]]\n" }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 2);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[1].resolved, true);
  assert.equal(result.diagnostics.length, 0);
});

test("resolves mixed resolved and unresolved transclusions", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveTransclusions } = await loadResolver();

  const files = [
    { path: "exists.md", source: "Content." },
    { path: "source.md", source: "![[exists]]\n\n![[missing]]\n" },
  ];
  const index = buildFileIndex(files);
  const result = resolveTransclusions(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 2);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].target, "exists");
  assert.equal(result.resolutions[1].resolved, false);
  assert.equal(result.resolutions[1].target, "missing");
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, TRANSCLUSION_MISSING);
});
