import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/toggle.js", import.meta.url));
}

test("getToggleDisplay for open state", async () => {
  const mod = await load();

  const result = mod.getToggleDisplay({ foldState: "open" });

  assert.equal(result.foldState, "open");
});

test("getToggleDisplay for closed state", async () => {
  const mod = await load();

  const result = mod.getToggleDisplay({ foldState: "closed" });

  assert.equal(result.foldState, "closed");
});

test("Toggle is a function", async () => {
  const mod = await load();

  assert.equal(typeof mod.Toggle, "function");
});
