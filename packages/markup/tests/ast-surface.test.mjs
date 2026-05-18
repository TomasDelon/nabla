import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("markup package exports AST type surface", async () => {
  const astSource = await readFile(new URL("../src/ast.ts", import.meta.url), "utf8");
  const indexSource = await readFile(new URL("../src/index.ts", import.meta.url), "utf8");
  const parseModeSource = await readFile(
    new URL("../src/parse-mode.ts", import.meta.url),
    "utf8"
  );

  assert.match(astSource, /export type NablaDocument = \{/);
  assert.match(astSource, /export type MarkdownNode = \{/);
  assert.match(astSource, /nablaTaskState\?: TaskState;/);
  assert.match(astSource, /nablaBlockId\?: string;/);
  assert.match(astSource, /export type \{ ParseMode \};/);
  assert.match(parseModeSource, /export type ParseMode = "strict" \| "tolerant";/);
  assert.match(indexSource, /from "\.\/ast\.js";/);
  assert.match(indexSource, /from "\.\/parse-mode\.js";/);
});
