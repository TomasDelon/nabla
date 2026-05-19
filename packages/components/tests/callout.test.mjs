import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/callout.js", import.meta.url));
}

test("getCalloutDisplay returns type and foldState for open note", async () => {
  const mod = await load();

  const result = mod.getCalloutDisplay({ calloutType: "note", foldState: "open" });

  assert.equal(result.calloutType, "note");
  assert.equal(result.foldState, "open");
  assert.equal(result.typeLabel, "Note");
});

test("getCalloutDisplay for closed warning", async () => {
  const mod = await load();

  const result = mod.getCalloutDisplay({ calloutType: "warning", foldState: "closed" });

  assert.equal(result.calloutType, "warning");
  assert.equal(result.foldState, "closed");
  assert.equal(result.typeLabel, "Warning");
});

test("getCalloutDisplay preserves unknown callout type as label", async () => {
  const mod = await load();

  const result = mod.getCalloutDisplay({ calloutType: "custom", foldState: "open" });

  assert.equal(result.calloutType, "custom");
  assert.equal(result.typeLabel, "custom");
});

test("Callout is a function", async () => {
  const mod = await load();

  assert.equal(typeof mod.Callout, "function");
});
