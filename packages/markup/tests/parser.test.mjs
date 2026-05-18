import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const parserModuleUrl = new URL("../src/parser.ts", import.meta.url);

let parserModulePromise;

async function loadParserModule() {
  parserModulePromise ??= loadTsModule(parserModuleUrl);

  return parserModulePromise;
}

test("parser skeleton exports a public parse entry point", async () => {
  const parserSource = await readFile(parserModuleUrl, "utf8");
  const indexSource = await readFile(new URL("../src/index.ts", import.meta.url), "utf8");

  assert.match(parserSource, /import type \{ .*NablaDocument.*\} from "\.\/ast\.js";/);
  assert.match(parserSource, /export function parse\(markdown: string, options: ParseOptions = \{\}\): NablaDocument/);
  assert.match(indexSource, /export \{ parse \} from "\.\/parser\.js";/);
});

test("parser returns a minimal paragraph document when no wiki link grammar applies", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("# hello"), {
    type: "document",
    children: [
      {
        type: "heading",
        depth: 1,
        children: [{ type: "text", value: "hello" }]
      }
    ],
    diagnostics: []
  });
  assert.deepEqual(parse("- [ ] task", { mode: "strict" }), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: "- [ ] task" }]
      }
    ],
    diagnostics: []
  });
  assert.deepEqual(parse("![[note]]", { mode: "tolerant" }), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: "![[note]]" }]
      }
    ],
    diagnostics: []
  });
});
