import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/index.js", import.meta.url));
}

test("NABLA_EDITOR_PACKAGE constant is exported", async () => {
  const mod = await load();
  assert.equal(mod.NABLA_EDITOR_PACKAGE, "@nabla/editor");
});

test("editor model runtime constants are exported", async () => {
  const mod = await load();

  assert.equal(mod.NABLA_EDITOR_SOURCE_OF_TRUTH, "markdown");
  assert.equal(
    mod.NABLA_EDITOR_CANONICAL_SAVE_PATH,
    "editor state -> Markdown string -> @nabla/markup parser -> @nabla/markup serializer -> saved Markdown source",
  );
});

test("save pipeline runtime exports are wired", async () => {
  const mod = await load();

  assert.equal(typeof mod.canonicalize, "function");
  assert.equal(mod.NABLA_EDITOR_EXPORT_LOSS, "NABLA_EDITOR_EXPORT_LOSS");
});

test("editor runtime exports are wired", async () => {
  const mod = await load();

  assert.equal(typeof mod.createEditor, "function");
  assert.equal(typeof mod.loadSource, "function");
  assert.equal(typeof mod.getSource, "function");
});
