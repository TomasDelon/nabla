import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "../../workspace/tests/helpers/load-ts-module.mjs";

const indexUrl = new URL("../src/index.ts", import.meta.url);

async function load() {
  return loadTsModule(indexUrl);
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
