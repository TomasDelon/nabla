import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("markup package skeleton exists", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8")
  );

  assert.equal(packageJson.name, "@nabla/markup");
  assert.equal(packageJson.type, "module");
});
