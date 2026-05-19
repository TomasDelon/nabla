import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const fileIndexUrl = new URL("../src/file-index.ts", import.meta.url);
const resolverUrl = new URL("../src/wiki-link-resolver.ts", import.meta.url);

async function loadFileIndex() {
  return loadTsModule(fileIndexUrl);
}

async function loadResolver() {
  return loadTsModule(resolverUrl);
}

const LINK_MISSING = "NABLA_LINK_MISSING_TARGET";
const HEADING_MISSING = "NABLA_HEADING_MISSING_TARGET";
const BLOCK_MISSING = "NABLA_BLOCK_MISSING_TARGET";

test("resolves [[note]] to existing file", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [
    { path: "note-a.md", source: "Content." },
  ];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(
    [{ path: "source.md", source: "Link to [[note-a]]." }],
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

test("resolves [[note|alias]] with alias", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [{ path: "target.md", source: "Content." }];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(
    [{ path: "source.md", source: "Link to [[target|See Here]]." }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].alias, "See Here");
  assert.equal(result.resolutions[0].target, "target");
  assert.equal(result.resolutions[0].resolvedFilePath, "target.md");
});

test("resolves [[note#heading]] to heading slug", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [{ path: "doc.md", source: "# My Heading\nContent." }];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(
    [{ path: "source.md", source: "See [[doc#My Heading]]." }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].heading, "My Heading");
  assert.equal(result.resolutions[0].target, "doc");
});

test("resolves [[note^id]] to block ID", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [{ path: "doc.md", source: "Paragraph ^block1\n" }];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(
    [{ path: "source.md", source: "See [[doc^block1]]." }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].blockId, "block1");
});

test("resolves [[note#^id]] compatible syntax", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [{ path: "doc.md", source: "Paragraph ^block1\n" }];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(
    [{ path: "source.md", source: "See [[doc#^block1]]." }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].blockId, "block1");
});

test("resolves [[#heading]] to same-file heading", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  // Same file: the source file that contains the wiki link should also have the heading
  const files = [{ path: "doc.md", source: "# My Heading\nSee [[#My Heading]]." }];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].heading, "My Heading");
  assert.equal(result.resolutions[0].target, "");
});

test("missing note target produces LINK_MISSING_TARGET diagnostic", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [{ path: "some-file.md", source: "See [[nonexistent]]." }];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, false);
  assert.equal(result.resolutions[0].target, "nonexistent");
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, LINK_MISSING);
});

test("missing heading on existing file produces HEADING_MISSING_TARGET", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [
    { path: "exists.md", source: "Content." },
    { path: "source.md", source: "See [[exists#MissingHeading]]." },
  ];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, false);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, HEADING_MISSING);
});

test("missing block on existing file produces BLOCK_MISSING_TARGET", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [
    { path: "exists.md", source: "Content." },
    { path: "source.md", source: "See [[exists^missingblock]]." },
  ];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, false);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, BLOCK_MISSING);
});

test("note target with nonexistent file and heading produces LINK_MISSING_TARGET", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [{ path: "source.md", source: "See [[nonexistent#Heading]]." }];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 1);
  assert.equal(result.resolutions[0].resolved, false);
  assert.equal(result.diagnostics[0].code, LINK_MISSING);
});

test("no wiki links produces empty result", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [{ path: "plain.md", source: "Just text.\n" }];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 0);
  assert.equal(result.diagnostics.length, 0);
});

test("resolves multiple wiki links from one file", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [
    { path: "a.md", source: "# Heading A\n" },
    { path: "b.md", source: "Content." },
  ];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(
    [{ path: "source.md", source: "Link [[a#Heading A]] and [[b]]." }],
    index.entries,
    index.headings,
    index.blocks,
  );

  assert.equal(result.resolutions.length, 2);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[1].resolved, true);
  assert.equal(result.diagnostics.length, 0);
});

test("resolves mixed resolved and unresolved links", async () => {
  const { buildFileIndex } = await loadFileIndex();
  const { resolveWikiLinks } = await loadResolver();

  const files = [
    { path: "exists.md", source: "Content." },
    { path: "source.md", source: "See [[exists]] and [[missing]]." },
  ];
  const index = buildFileIndex(files);
  const result = resolveWikiLinks(files, index.entries, index.headings, index.blocks);

  assert.equal(result.resolutions.length, 2);
  assert.equal(result.resolutions[0].resolved, true);
  assert.equal(result.resolutions[0].target, "exists");
  assert.equal(result.resolutions[1].resolved, false);
  assert.equal(result.resolutions[1].target, "missing");
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].code, LINK_MISSING);
});
