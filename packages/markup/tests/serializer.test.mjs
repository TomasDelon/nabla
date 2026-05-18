import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const serializerModuleUrl = new URL("../src/serializer.ts", import.meta.url);

let serializerModulePromise;

async function loadSerializerModule() {
  serializerModulePromise ??= loadTsModule(serializerModuleUrl);

  return serializerModulePromise;
}

test("serializer skeleton exports a public serialize entry point", async () => {
  const serializerSource = await readFile(serializerModuleUrl, "utf8");
  const indexSource = await readFile(new URL("../src/index.ts", import.meta.url), "utf8");

  assert.match(serializerSource, /import type \{ .*NablaDocument.*\} from "\.\/ast\.js";/);
  assert.match(serializerSource, /export function serialize\(source: NablaDocument, options: SerializeOptions = \{\}\)/);
  assert.match(indexSource, /export \{ serialize \} from "\.\/serializer\.js";/);
});

test("serializer emits plain paragraph text and canonical wiki links", async () => {
  const { serialize } = await loadSerializerModule();
  const document = {
    type: "document",
    children: [{ type: "paragraph", children: [{ type: "text", value: "hello" }] }],
    diagnostics: []
  };
  const compatibleBlockLink = {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: "See " },
          {
            type: "wikiLink",
            target: "Analyse",
            blockId: "thm-main",
            syntax: "compatible",
            raw: "[[Analyse#^thm-main]]"
          },
          { type: "text", value: "." }
        ]
      }
    ],
    diagnostics: []
  };

  assert.equal(serialize(document), "hello\n");
  assert.equal(serialize(document, { lineEnding: "lf" }), "hello\n");
  assert.equal(serialize(document, { lineEnding: "crlf" }), "hello\r\n");
  assert.equal(serialize(compatibleBlockLink), "See [[Analyse^thm-main]].\n");
});
