import test from "node:test";
import assert from "node:assert/strict";

async function loadEditor() {
  return import(new URL("../dist/editor.js", import.meta.url));
}

async function loadEmoji() {
  return import(new URL("../dist/nodes/emoji.js", import.meta.url));
}

test("detects known shortcode :check:", async () => {
  const mod = await loadEmoji();

  assert.deepEqual(mod.getEmojiShortcodesFromMarkdown(":check:\n"), [
    { index: 0, name: "check", raw: ":check:", value: "✅" },
  ]);
});

test("unknown shortcode is ignored and remains literal source text", async () => {
  const mod = await loadEmoji();

  assert.deepEqual(mod.getEmojiShortcodesFromMarkdown(":unknown:\n"), []);
});

test("ignores protected regions", async () => {
  const mod = await loadEmoji();

  assert.deepEqual(mod.getEmojiShortcodesFromMarkdown("`:check:`\n"), []);
});

test("load detect export preserves emoji shortcode syntax", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();

  mod.loadSource(editor, "Status :check:\n");

  assert.deepEqual(mod.getEmojiShortcodes(editor), [
    { index: 0, name: "check", raw: ":check:", value: "✅" },
  ]);
  assert.equal(mod.getSource(editor), "Status :check:");
});

test("no node views other than accepted task-state, wiki-link, tag, highlight, emoji are registered", async () => {
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
