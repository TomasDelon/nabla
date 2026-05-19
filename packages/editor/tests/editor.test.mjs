import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/editor.js", import.meta.url));
}

test("public editor exports exist", async () => {
  const mod = await load();

  assert.equal(typeof mod.createEditor, "function");
  assert.equal(typeof mod.loadSource, "function");
  assert.equal(typeof mod.getSource, "function");
});

test("simple Markdown load and export works in Node", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.loadSource(editor, "# Title\n\nParagraph text.\n");

  assert.equal(mod.getSource(editor), "# Title\n\nParagraph text.");
});

test("no Nabla-specific node views are registered", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  assert.deepEqual(editor.nodeViews, {});
});
