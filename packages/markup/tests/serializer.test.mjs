import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const serializerModuleUrl = new URL("../src/serializer.ts", import.meta.url);

let serializerModulePromise;

async function loadSerializerModule() {
  serializerModulePromise ??= (async () => {
    const source = await readFile(serializerModuleUrl, "utf8");
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

  return serializerModulePromise;
}

test("serializer skeleton exports a public serialize entry point", async () => {
  const serializerSource = await readFile(serializerModuleUrl, "utf8");
  const indexSource = await readFile(new URL("../src/index.ts", import.meta.url), "utf8");

  assert.match(serializerSource, /import type \{ NablaDocument \} from "\.\/ast\.js";/);
  assert.match(serializerSource, /export function serialize\(source: NablaDocument, options: SerializeOptions = \{\}\)/);
  assert.match(indexSource, /export \{ serialize \} from "\.\/serializer\.js";/);
});

test("serializer skeleton returns a string placeholder without implementing markdown rules", async () => {
  const { serialize } = await loadSerializerModule();
  const document = {
    type: "document",
    children: [{ type: "paragraph", children: [{ type: "text", value: "hello" }] }],
    diagnostics: []
  };

  assert.equal(serialize(document), "");
  assert.equal(serialize(document, { lineEnding: "lf" }), "");
  assert.equal(serialize(document, { lineEnding: "crlf" }), "");
});
