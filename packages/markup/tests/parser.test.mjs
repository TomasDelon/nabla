import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const parserModuleUrl = new URL("../src/parser.ts", import.meta.url);

let parserModulePromise;

async function loadParserModule() {
  parserModulePromise ??= (async () => {
    const source = await readFile(parserModuleUrl, "utf8");
    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022
      }
    });

    return import(
      `data:text/javascript;base64,${Buffer.from(transpiled.outputText, "utf8").toString("base64")}`
    );
  })();

  return parserModulePromise;
}

test("parser skeleton exports a public parse entry point", async () => {
  const parserSource = await readFile(parserModuleUrl, "utf8");
  const indexSource = await readFile(new URL("../src/index.ts", import.meta.url), "utf8");

  assert.match(parserSource, /import type \{ NablaDocument \} from "\.\/ast\.js";/);
  assert.match(parserSource, /export function parse\(markdown: string, options: ParseOptions = \{\}\): NablaDocument/);
  assert.match(indexSource, /export \{ parse \} from "\.\/parser\.js";/);
});

test("parser skeleton returns a minimal NablaDocument placeholder without parsing markdown", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("# hello"), {
    type: "document",
    children: [],
    diagnostics: []
  });
  assert.deepEqual(parse("- [ ] task", { mode: "strict" }), {
    type: "document",
    children: [],
    diagnostics: []
  });
  assert.deepEqual(parse("[[wiki]]", { mode: "tolerant" }), {
    type: "document",
    children: [],
    diagnostics: []
  });
});
