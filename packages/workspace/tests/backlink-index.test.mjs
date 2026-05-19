import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const backlinkIndexUrl = new URL("../src/backlink-index.ts", import.meta.url);

async function loadModule() {
  return loadTsModule(backlinkIndexUrl);
}

function noteResolved(filePath, target, resolvedFilePath) {
  return { filePath, target, resolved: true, resolvedFilePath };
}

function headingResolved(filePath, target, heading, resolvedFilePath) {
  return { filePath, target, heading, resolved: true, resolvedFilePath };
}

function blockResolved(filePath, target, blockId, resolvedFilePath) {
  return { filePath, target, blockId, resolved: true, resolvedFilePath };
}

function unresolved(filePath, target) {
  return { filePath, target, resolved: false };
}

test("empty resolutions produce empty backlinks", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const result = buildBacklinkIndex([]);
  assert.equal(result.length, 0);
});

test("resolved note link creates backlink with kind note", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [noteResolved("source.md", "target", "target.md")];
  const result = buildBacklinkIndex(resolutions);

  assert.equal(result.length, 1);
  assert.equal(result[0].sourcePath, "source.md");
  assert.equal(result[0].targetPath, "target.md");
  assert.equal(result[0].kind, "note");
});

test("resolved heading link creates backlink with kind heading", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [headingResolved("source.md", "target", "My Heading", "target.md")];
  const result = buildBacklinkIndex(resolutions);

  assert.equal(result.length, 1);
  assert.equal(result[0].sourcePath, "source.md");
  assert.equal(result[0].targetPath, "target.md");
  assert.equal(result[0].kind, "heading");
});

test("resolved block link creates backlink with kind block", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [blockResolved("source.md", "target", "block1", "target.md")];
  const result = buildBacklinkIndex(resolutions);

  assert.equal(result.length, 1);
  assert.equal(result[0].sourcePath, "source.md");
  assert.equal(result[0].targetPath, "target.md");
  assert.equal(result[0].kind, "block");
});

test("unresolved links are skipped", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [unresolved("source.md", "missing")];
  const result = buildBacklinkIndex(resolutions);
  assert.equal(result.length, 0);
});

test("mixed resolved and unresolved; only resolved create backlinks", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [
    unresolved("source.md", "missing"),
    noteResolved("source.md", "exists", "exists.md"),
  ];
  const result = buildBacklinkIndex(resolutions);

  assert.equal(result.length, 1);
  assert.equal(result[0].sourcePath, "source.md");
  assert.equal(result[0].targetPath, "exists.md");
  assert.equal(result[0].kind, "note");
});

test("multiple resolved links from one source", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [
    noteResolved("source.md", "a", "a.md"),
    headingResolved("source.md", "b", "Heading", "b.md"),
    blockResolved("source.md", "c", "block1", "c.md"),
  ];
  const result = buildBacklinkIndex(resolutions);

  assert.equal(result.length, 3);
  assert.equal(result[0].sourcePath, "source.md");
  assert.equal(result[0].targetPath, "a.md");
  assert.equal(result[0].kind, "note");
  assert.equal(result[1].sourcePath, "source.md");
  assert.equal(result[1].targetPath, "b.md");
  assert.equal(result[1].kind, "heading");
  assert.equal(result[2].sourcePath, "source.md");
  assert.equal(result[2].targetPath, "c.md");
  assert.equal(result[2].kind, "block");
});

test("alias does not affect backlink target", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [
    {
      filePath: "source.md",
      target: "target",
      alias: "Display Text",
      resolved: true,
      resolvedFilePath: "target.md",
    },
  ];
  const result = buildBacklinkIndex(resolutions);

  assert.equal(result.length, 1);
  assert.equal(result[0].sourcePath, "source.md");
  assert.equal(result[0].targetPath, "target.md");
  assert.equal(result[0].kind, "note");
});

test("same-file heading ref creates backlink to self", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [headingResolved("doc.md", "", "My Heading", "doc.md")];
  const result = buildBacklinkIndex(resolutions);

  assert.equal(result.length, 1);
  assert.equal(result[0].sourcePath, "doc.md");
  assert.equal(result[0].targetPath, "doc.md");
  assert.equal(result[0].kind, "heading");
});

test("same-file block ref creates backlink to self", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [blockResolved("doc.md", "", "block1", "doc.md")];
  const result = buildBacklinkIndex(resolutions);

  assert.equal(result.length, 1);
  assert.equal(result[0].sourcePath, "doc.md");
  assert.equal(result[0].targetPath, "doc.md");
  assert.equal(result[0].kind, "block");
});

test("backlinks from multiple sources", async () => {
  const { buildBacklinkIndex } = await loadModule();
  const resolutions = [
    noteResolved("source-a.md", "target", "target.md"),
    noteResolved("source-b.md", "target", "target.md"),
  ];
  const result = buildBacklinkIndex(resolutions);

  assert.equal(result.length, 2);
  assert.equal(result[0].sourcePath, "source-a.md");
  assert.equal(result[1].sourcePath, "source-b.md");
  assert.equal(result[0].targetPath, "target.md");
  assert.equal(result[1].targetPath, "target.md");
});

test("createWorkspace populates index.backlinks", async () => {
  const workspaceUrl = new URL("../src/workspace.ts", import.meta.url);
  const { createWorkspace } = await loadTsModule(workspaceUrl);

  const files = [
    { path: "target.md", source: "Content." },
  ];
  const result = createWorkspace([{ path: "source.md", source: "See [[target]]." }, ...files]);

  assert.equal(result.workspace.index.backlinks.length, 1);
  assert.equal(result.workspace.index.backlinks[0].sourcePath, "source.md");
  assert.equal(result.workspace.index.backlinks[0].targetPath, "target.md");
  assert.equal(result.workspace.index.backlinks[0].kind, "note");
});

test("transclusions do not create backlinks", async () => {
  const workspaceUrl = new URL("../src/workspace.ts", import.meta.url);
  const { createWorkspace } = await loadTsModule(workspaceUrl);

  const files = [
    { path: "target.md", source: "Content." },
  ];
  const result = createWorkspace([{ path: "source.md", source: "![[target]]." }, ...files]);

  assert.equal(result.workspace.index.backlinks.length, 0);
});

test("missing wiki links produce diagnostic but no backlink", async () => {
  const workspaceUrl = new URL("../src/workspace.ts", import.meta.url);
  const { createWorkspace } = await loadTsModule(workspaceUrl);

  const result = createWorkspace([{ path: "source.md", source: "See [[missing]]." }]);

  assert.equal(result.workspace.index.backlinks.length, 0);

  const linkDiags = result.diagnostics.filter(d => d.code === "NABLA_LINK_MISSING_TARGET");
  assert.equal(linkDiags.length, 1);
});
