import test from "node:test";
import assert from "node:assert/strict";

async function loadEditor() {
  return import(new URL("../dist/editor.js", import.meta.url));
}

async function loadTag() {
  return import(new URL("../dist/nodes/tag.js", import.meta.url));
}

async function loadHighlight() {
  return import(new URL("../dist/nodes/highlight.js", import.meta.url));
}

test("detects simple tag #tag", async () => {
  const mod = await loadTag();

  assert.deepEqual(mod.getTagsFromMarkdown("#tag\n"), [
    { index: 0, value: "tag", segments: ["tag"], raw: "#tag" },
  ]);
});

test("detects nested tag #nested/tag", async () => {
  const mod = await loadTag();

  assert.deepEqual(mod.getTagsFromMarkdown("#nested/tag\n"), [
    { index: 0, value: "nested/tag", segments: ["nested", "tag"], raw: "#nested/tag" },
  ]);
});

test("ignores markdown heading # Title", async () => {
  const mod = await loadTag();

  assert.deepEqual(mod.getTagsFromMarkdown("# Title\n"), []);
});

test("detects simple highlight ==text==", async () => {
  const mod = await loadHighlight();

  assert.deepEqual(mod.getHighlightsFromMarkdown("==text==\n"), [
    { index: 0, raw: "==text==", text: "text", kind: "highlight" },
  ]);
});

test("detects color highlight =={#ff0}text==", async () => {
  const mod = await loadHighlight();

  assert.deepEqual(mod.getHighlightsFromMarkdown("=={#ff0}text==\n"), [
    {
      index: 0,
      raw: "=={#ff0}text==",
      text: "text",
      color: "#ff0",
      kind: "colorHighlight",
    },
  ]);
});

test("load detect export preserves tag and highlight syntax", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();
  const source = "#tag ==text== =={#ff0}color==\n";

  mod.loadSource(editor, source);

  assert.deepEqual(mod.getTags(editor), [
    { index: 0, value: "tag", segments: ["tag"], raw: "#tag" },
  ]);
  assert.deepEqual(mod.getHighlights(editor), [
    { index: 0, raw: "==text==", text: "text", kind: "highlight" },
    {
      index: 1,
      raw: "=={#ff0}color==",
      text: "color",
      color: "#ff0",
      kind: "colorHighlight",
    },
  ]);
  assert.equal(mod.getSource(editor), "#tag ==text== =={#ff0}color==");
});

test("ignores tags and highlights inside protected regions", async () => {
  const tagMod = await loadTag();
  const highlightMod = await loadHighlight();

  assert.deepEqual(tagMod.getTagsFromMarkdown("`#tag`\n"), []);
  assert.deepEqual(highlightMod.getHighlightsFromMarkdown("`==text==`\n"), []);
});

test("no node views other than accepted task-state, wiki-link, tag, and highlight are registered", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();

  assert.deepEqual(Object.keys(editor.nodeViews).sort(), ["emoji", "highlight", "tag", "taskState", "wikiLink"]);
  assert.equal(editor.nodeViews.emoji, "node-safe-adapter");
  assert.equal(editor.nodeViews.highlight, "node-safe-adapter");
  assert.equal(editor.nodeViews.tag, "node-safe-adapter");
  assert.equal(editor.nodeViews.taskState, "node-safe-adapter");
  assert.equal(editor.nodeViews.wikiLink, "node-safe-adapter");
});
