import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/folded-heading.js", import.meta.url));
}

test("getFoldedHeadingDisplay returns open state with level and text", async () => {
  const mod = await load();

  const result = mod.getFoldedHeadingDisplay({ level: 2, foldState: "open", text: "Section Title" });

  assert.equal(result.level, 2);
  assert.equal(result.foldState, "open");
  assert.equal(result.text, "Section Title");
});

test("getFoldedHeadingDisplay returns closed state with level and text", async () => {
  const mod = await load();

  const result = mod.getFoldedHeadingDisplay({ level: 3, foldState: "closed", text: "Sub Section" });

  assert.equal(result.level, 3);
  assert.equal(result.foldState, "closed");
  assert.equal(result.text, "Sub Section");
});

test("getFoldedHeadingDisplay preserves heading level 1", async () => {
  const mod = await load();

  const result = mod.getFoldedHeadingDisplay({ level: 1, foldState: "open", text: "Top" });

  assert.equal(result.level, 1);
});

test("FoldedHeading is a function", async () => {
  const mod = await load();

  assert.equal(typeof mod.FoldedHeading, "function");
});
