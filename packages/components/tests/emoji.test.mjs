import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/emoji.js", import.meta.url));
}

test("getEmojiDisplay marks known shortcode when value differs from raw", async () => {
  const mod = await load();

  const result = mod.getEmojiDisplay({
    name: "check",
    value: "✅",
    raw: ":check:",
  });

  assert.equal(result.name, "check");
  assert.equal(result.value, "✅");
  assert.equal(result.raw, ":check:");
  assert.equal(result.isKnown, true);
});

test("getEmojiDisplay marks unknown shortcode when value equals raw", async () => {
  const mod = await load();

  const result = mod.getEmojiDisplay({
    name: "unknown",
    value: ":unknown:",
    raw: ":unknown:",
  });

  assert.equal(result.name, "unknown");
  assert.equal(result.value, ":unknown:");
  assert.equal(result.raw, ":unknown:");
  assert.equal(result.isKnown, false);
});

test("Emoji is a function", async () => {
  const mod = await load();

  assert.equal(typeof mod.Emoji, "function");
});
