import test from "node:test";
import assert from "node:assert/strict";

async function loadTag() {
  return import(new URL("../dist/tag.js", import.meta.url));
}

async function loadHighlight() {
  return import(new URL("../dist/highlight.js", import.meta.url));
}

test("getTagDisplay returns value and segments", async () => {
  const mod = await loadTag();

  const result = mod.getTagDisplay({
    value: "mytag",
    segments: ["mytag"],
  });

  assert.equal(result.value, "mytag");
  assert.deepEqual(result.segments, ["mytag"]);
  assert.equal(result.displayText, "#mytag");
});

test("getTagDisplay preserves nested tag segments", async () => {
  const mod = await loadTag();

  const result = mod.getTagDisplay({
    value: "nested/tag",
    segments: ["nested", "tag"],
  });

  assert.equal(result.value, "nested/tag");
  assert.deepEqual(result.segments, ["nested", "tag"]);
  assert.equal(result.displayText, "#nested/tag");
});

test("Tag is a function", async () => {
  const mod = await loadTag();

  assert.equal(typeof mod.Tag, "function");
});

test("getHighlightStyle returns default background for simple highlight", async () => {
  const mod = await loadHighlight();

  const result = mod.getHighlightStyle({ text: "hello" });

  assert.equal(result.text, "hello");
  assert.equal(result.color, undefined);
  assert.equal(result.backgroundColor, "#ffff0066");
});

test("getHighlightStyle preserves color", async () => {
  const mod = await loadHighlight();

  const result = mod.getHighlightStyle({ text: "colored", color: "#ff0" });

  assert.equal(result.text, "colored");
  assert.equal(result.color, "#ff0");
  assert.equal(result.backgroundColor, "#ff0");
});

test("Highlight is a function", async () => {
  const mod = await loadHighlight();

  assert.equal(typeof mod.Highlight, "function");
});
