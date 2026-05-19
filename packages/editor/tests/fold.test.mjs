import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/index.js", import.meta.url));
}

test("toggles a callout fold marker", async () => {
  const mod = await load();

  assert.equal(mod.toggleCalloutFoldInMarkdown("[!note]> Title\n", 0), "[!note]v Title\n");
});

test("toggles a toggle open closed marker", async () => {
  const mod = await load();

  assert.equal(mod.toggleToggleFoldInMarkdown("]> Title\n", 0), "]v Title\n");
});

test("toggles a folded heading marker", async () => {
  const mod = await load();

  assert.equal(mod.toggleFoldedHeadingFoldInMarkdown("##> Title\n", 0), "##v Title\n");
  assert.equal(mod.toggleFoldedHeadingFoldInMarkdown("##v Title\n", 0), "##> Title\n");
});

test("load toggle fold export produces updated markdown", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.loadSource(editor, "[!note]> Title\n");
  mod.toggleCalloutFold(editor, 0);

  assert.equal(mod.getSource(editor), "[!note]v Title");
});

test("out of range index throws deterministic RangeError", async () => {
  const mod = await load();

  assert.throws(() => mod.toggleCalloutFoldInMarkdown("[!note]> Title\n", 1), RangeError);
  assert.throws(() => mod.toggleToggleFoldInMarkdown("]> Title\n", 1), RangeError);
  assert.throws(() => mod.toggleFoldedHeadingFoldInMarkdown("#> Title\n", 1), RangeError);
});

test("no visual callout toggle folded heading node views are registered", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  assert.equal("callout" in editor.nodeViews, false);
  assert.equal("toggle" in editor.nodeViews, false);
  assert.equal("foldedHeading" in editor.nodeViews, false);
});
