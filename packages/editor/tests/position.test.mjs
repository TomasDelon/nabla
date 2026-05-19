import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/position.js", import.meta.url));
}

test("valid offsets are accepted", async () => {
  const mod = await load();

  assert.equal(mod.isValidOffset(0), true);
  assert.equal(mod.isValidOffset(7), true);
  assert.deepEqual(mod.createSourcePosition(3), { offset: 3 });
  assert.deepEqual(mod.createEditorPosition(5), { offset: 5 });
});

test("invalid offsets are rejected", async () => {
  const mod = await load();

  assert.equal(mod.isValidOffset(-1), false);
  assert.equal(mod.isValidOffset(1.5), false);
  assert.equal(mod.isValidOffset(Number.NaN), false);
  assert.throws(() => mod.createSourcePosition(-1), RangeError);
  assert.throws(() => mod.createEditorPosition(1.5), RangeError);
});

test("clamp behavior works", async () => {
  const mod = await load();

  assert.equal(mod.clampOffset(-5, 10), 0);
  assert.equal(mod.clampOffset(4, 10), 4);
  assert.equal(mod.clampOffset(99, 10), 10);
  assert.equal(mod.clampOffset(4.8, 10), 4);
});

test("source and editor position roundtrip preserves offsets", async () => {
  const mod = await load();
  const sourcePosition = mod.createSourcePosition(12);
  const editorPosition = mod.sourceToEditorPosition(sourcePosition);
  const roundTrip = mod.editorToSourcePosition(editorPosition);

  assert.deepEqual(editorPosition, { offset: 12 });
  assert.deepEqual(roundTrip, { offset: 12 });
});

test("position helpers do not require DOM or browser runtime", async () => {
  const mod = await load();

  assert.equal(typeof globalThis.document, "undefined");
  assert.deepEqual(mod.editorToSourcePosition({ offset: 2 }), { offset: 2 });
});
