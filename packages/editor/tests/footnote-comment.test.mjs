import test from "node:test";
import assert from "node:assert/strict";

async function loadEditor() {
  return import(new URL("../dist/editor.js", import.meta.url));
}

async function loadFootnote() {
  return import(new URL("../dist/nodes/footnote.js", import.meta.url));
}

async function loadComment() {
  return import(new URL("../dist/nodes/comment.js", import.meta.url));
}

test("detects footnote reference [^id]", async () => {
  const mod = await loadFootnote();

  assert.deepEqual(mod.getFootnotesFromMarkdown("Use it[^id]\n"), [
    { index: 0, kind: "reference", id: "id", raw: "[^id]" },
  ]);
});

test("detects footnote definition [^id]: text", async () => {
  const mod = await loadFootnote();

  assert.deepEqual(mod.getFootnotesFromMarkdown("[^id]: text\n"), [
    { index: 0, kind: "definition", id: "id", raw: "[^id]: text", text: "text" },
  ]);
});

test("detects both footnote reference and definition in same document", async () => {
  const mod = await loadFootnote();

  assert.deepEqual(mod.getFootnotesFromMarkdown("Use it[^id]\n\n[^id]: text\n"), [
    { index: 0, kind: "definition", id: "id", raw: "[^id]: text", text: "text" },
    { index: 1, kind: "reference", id: "id", raw: "[^id]" },
  ]);
});

test("detects comment %%text%%", async () => {
  const mod = await loadComment();

  assert.deepEqual(mod.getCommentsFromMarkdown("%%text%%\n"), [
    { index: 0, raw: "%%text%%", text: "text", multiline: false },
  ]);
});

test("detects multiline comment when supported by current syntax", async () => {
  const mod = await loadComment();

  assert.deepEqual(mod.getCommentsFromMarkdown("%%line 1\nline 2%%\n"), [
    { index: 0, raw: "%%line 1\nline 2%%", text: "line 1\nline 2", multiline: true },
  ]);
});

test("ignores protected regions", async () => {
  const footnoteMod = await loadFootnote();
  const commentMod = await loadComment();

  assert.deepEqual(footnoteMod.getFootnotesFromMarkdown("`[^id]`\n"), []);
  assert.deepEqual(commentMod.getCommentsFromMarkdown("`%%text%%`\n"), []);
});

test("load detect export preserves footnote and comment syntax", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();
  const source = "Use it[^id]\n\n[^id]: text\n\n%%note%%\n";

  mod.loadSource(editor, source);

  assert.deepEqual(mod.getFootnotes(editor), [
    { index: 0, kind: "definition", id: "id", raw: "[^id]: text", text: "text" },
    { index: 1, kind: "reference", id: "id", raw: "[^id]" },
  ]);
  assert.deepEqual(mod.getComments(editor), [
    { index: 0, raw: "%%note%%", text: "note", multiline: false },
  ]);
  assert.equal(mod.getSource(editor), "Use it[^id]\n\n[^id]: text\n\n%%note%%");
});

test("no node views other than accepted task-state, wiki-link, tag, highlight, emoji, footnote, comment are registered", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();

  assert.deepEqual(Object.keys(editor.nodeViews).sort(), ["comment", "emoji", "footnote", "highlight", "tag", "taskState", "wikiLink"]);
  assert.equal(editor.nodeViews.comment, "node-safe-adapter");
  assert.equal(editor.nodeViews.emoji, "node-safe-adapter");
  assert.equal(editor.nodeViews.footnote, "node-safe-adapter");
  assert.equal(editor.nodeViews.highlight, "node-safe-adapter");
  assert.equal(editor.nodeViews.tag, "node-safe-adapter");
  assert.equal(editor.nodeViews.taskState, "node-safe-adapter");
  assert.equal(editor.nodeViews.wikiLink, "node-safe-adapter");
});
