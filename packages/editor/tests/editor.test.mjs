import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/editor.js", import.meta.url));
}

function withoutTrailingNewline(value) {
  return value.replace(/\n$/, "");
}

test("public editor exports exist", async () => {
  const mod = await load();

  assert.equal(typeof mod.createEditor, "function");
  assert.equal(typeof mod.replaceSource, "function");
  assert.equal(typeof mod.insertMarkdownBlock, "function");
  assert.equal(typeof mod.getDocumentBlockSummary, "function");
  assert.equal(typeof mod.getEmojiShortcodes, "function");
  assert.equal(typeof mod.getHighlights, "function");
  assert.equal(typeof mod.getTaskStates, "function");
  assert.equal(typeof mod.getTags, "function");
  assert.equal(typeof mod.getWikiLinks, "function");
  assert.equal(typeof mod.setTaskState, "function");
  assert.equal(typeof mod.setWikiLinkAlias, "function");
  assert.equal(typeof mod.toggleTaskState, "function");
  assert.equal(typeof mod.loadSource, "function");
  assert.equal(typeof mod.getSource, "function");
});

test("heading and paragraph load and export works in Node", async () => {
  const mod = await load();
  const editor = mod.createEditor();
  const source = "# Title\n\nParagraph text.\n";

  mod.loadSource(editor, source);

  assert.equal(mod.getSource(editor), withoutTrailingNewline(source));
});

test("bullet list load and export works", async () => {
  const mod = await load();
  const editor = mod.createEditor();
  const source = "- one\n- two\n";

  mod.replaceSource(editor, source);

  assert.equal(mod.getSource(editor), "* one\n* two");
});

test("ordered list load and export works", async () => {
  const mod = await load();
  const editor = mod.createEditor();
  const source = "1. one\n2. two\n";

  mod.replaceSource(editor, source);

  assert.equal(mod.getSource(editor), withoutTrailingNewline(source));
});

test("code block load and export works", async () => {
  const mod = await load();
  const editor = mod.createEditor();
  const source = "```\nconst x = 1;\n```\n";

  mod.replaceSource(editor, source);

  assert.equal(mod.getSource(editor), withoutTrailingNewline(source));
});

test("blockquote load and export works", async () => {
  const mod = await load();
  const editor = mod.createEditor();
  const source = "> quoted\n";

  mod.replaceSource(editor, source);

  assert.equal(mod.getSource(editor), withoutTrailingNewline(source));
});

test("insertMarkdownBlock appends a plain markdown block", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.replaceSource(editor, "# Title\n");
  mod.insertMarkdownBlock(editor, "Paragraph text.\n");

  assert.equal(mod.getSource(editor), "# Title\n\nParagraph text.");
});

test("block summary identifies standard markdown block node types", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.replaceSource(
    editor,
    "# Title\n\nParagraph text.\n\n- one\n- two\n\n1. first\n2. second\n\n> quoted\n\n```\nconst x = 1;\n```\n",
  );

  assert.deepEqual(mod.getDocumentBlockSummary(editor), [
    { type: "heading", level: 1 },
    { type: "paragraph" },
    { type: "bullet_list" },
    { type: "list_item" },
    { type: "paragraph" },
    { type: "list_item" },
    { type: "paragraph" },
    { type: "ordered_list" },
    { type: "list_item" },
    { type: "paragraph" },
    { type: "list_item" },
    { type: "paragraph" },
    { type: "blockquote" },
    { type: "paragraph" },
    { type: "code_block" },
  ]);
});

test("only accepted node view adapters are registered", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  assert.deepEqual(editor.nodeViews, {
    emoji: "node-safe-adapter",
    highlight: "node-safe-adapter",
    tag: "node-safe-adapter",
    taskState: "node-safe-adapter",
    wikiLink: "node-safe-adapter",
  });
});
