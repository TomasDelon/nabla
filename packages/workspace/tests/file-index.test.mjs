import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const fileIndexUrl = new URL("../src/file-index.ts", import.meta.url);

async function load() {
  return loadTsModule(fileIndexUrl);
}

test("buildFileIndex produces entries from a single file", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([{ path: "test.md", source: "# Hello\nWorld.\n" }]);

  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].path, "test.md");
  assert.equal(result.entries[0].normalizedPath, "test");
});

test("buildFileIndex produces headings per file", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([{ path: "test.md", source: "# Hello\n## World\n" }]);

  assert.equal(result.headings.length, 2);
  assert.equal(result.headings[0].slug, "hello");
  assert.equal(result.headings[0].text, "Hello");
  assert.equal(result.headings[0].depth, 1);
  assert.equal(result.headings[1].slug, "world");
});

test("buildFileIndex produces blocks per file", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([{ path: "test.md", source: "Hello ^greeting\n" }]);

  assert.equal(result.blocks.length, 1);
  assert.equal(result.blocks[0].blockId, "greeting");
  assert.equal(result.blocks[0].filePath, "test");
});

test("buildFileIndex handles multiple files", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([
    { path: "a.md", source: "# File A\n" },
    { path: "b.md", source: "# File B\n" },
  ]);

  assert.equal(result.entries.length, 2);
  assert.equal(result.entries[0].normalizedPath, "a");
  assert.equal(result.entries[1].normalizedPath, "b");
  assert.equal(result.headings.length, 2);
  assert.equal(result.headings[0].filePath, "a");
  assert.equal(result.headings[1].filePath, "b");
});

test("buildFileIndex handles empty file list", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([]);

  assert.equal(result.entries.length, 0);
  assert.equal(result.headings.length, 0);
  assert.equal(result.blocks.length, 0);
  assert.equal(result.diagnostics.length, 0);
});

test("buildFileIndex normalizes paths with ./ prefix", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([{ path: "./notes/doc.md", source: "# Title\n" }]);

  assert.equal(result.entries[0].normalizedPath, "notes/doc");
});

test("buildFileIndex handles files without .md extension", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([{ path: "readme", source: "# Readme\n" }]);

  assert.equal(result.entries[0].normalizedPath, "readme");
  assert.equal(result.entries[0].path, "readme");
});

test("buildFileIndex forwards diagnostics from markup parser", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([{ path: "test.md", source: "# Hello\n![[invalid\n" }]);

  assert.equal(result.entries.length, 1);
  assert.equal(result.diagnostics.length, 0);
});

test("buildFileIndex produces block index with filePath using normalized path", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([{ path: "./my-note.md", source: "Paragraph ^block1\n" }]);

  assert.equal(result.blocks.length, 1);
  assert.equal(result.blocks[0].filePath, "my-note");
});

test("buildFileIndex handles file with no headings or blocks", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([{ path: "plain.md", source: "Just a paragraph.\n\nAnother one.\n" }]);

  assert.equal(result.entries.length, 1);
  assert.equal(result.headings.length, 0);
  assert.equal(result.blocks.length, 0);
});

test("buildFileIndex populates heading index with normalized filePath", async () => {
  const { buildFileIndex } = await load();
  const result = buildFileIndex([{ path: "./sub/note.md", source: "# Header\n" }]);

  assert.equal(result.headings.length, 1);
  assert.equal(result.headings[0].filePath, "sub/note");
});
