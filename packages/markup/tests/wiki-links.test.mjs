import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule as loadRuntimeTsModule } from "./helpers/load-ts-module.mjs";

const parserModuleUrl = new URL("../src/parser.ts", import.meta.url);
const serializerModuleUrl = new URL("../src/serializer.ts", import.meta.url);
const fixturesModuleUrl = new URL("../src/fixtures.ts", import.meta.url);

const wikiFixtureIds = [
  "wiki-links/basic",
  "wiki-links/alias",
  "wiki-links/block-canonical",
  "wiki-links/block-compatible",
  "wiki-links/combined-alias-heading",
  "wiki-links/combined-alias-block-compatible",
  "wiki-links/escaped",
  "wiki-links/invalid-combined"
];

let parserModulePromise;
let serializerModulePromise;
let fixturesModulePromise;

async function loadTsModule(moduleUrl) {
  return loadRuntimeTsModule(moduleUrl);
}

async function loadParserModule() {
  parserModulePromise ??= loadTsModule(parserModuleUrl);
  return parserModulePromise;
}

async function loadSerializerModule() {
  serializerModulePromise ??= loadTsModule(serializerModuleUrl);
  return serializerModulePromise;
}

async function loadFixturesModule() {
  fixturesModulePromise ??= loadTsModule(fixturesModuleUrl);
  return fixturesModulePromise;
}

test("wiki link fixtures parse and serialize according to the checked-in contracts", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();
  const {
    compareFixtureAst,
    compareFixtureDiagnostics,
    compareFixtureOutput,
    loadParserFixture
  } = await loadFixturesModule();

  for (const fixtureId of wikiFixtureIds) {
    const fixture = await loadParserFixture(fixtureId);
    const parsed = parse(fixture.input);

    compareFixtureAst(parsed, fixture.ast);
    compareFixtureDiagnostics(parsed.diagnostics, fixture.diagnostics);
    compareFixtureOutput(serialize(parsed), fixture.output);
  }
});

test("wiki link parser handles heading-only links and leaves transclusion syntax literal", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("See [[Analyse#Limits]]."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: "See " },
          {
            type: "wikiLink",
            target: "Analyse",
            heading: "Limits",
            syntax: "canonical",
            raw: "[[Analyse#Limits]]"
          },
          { type: "text", value: "." }
        ]
      }
    ],
    diagnostics: []
  });

  assert.deepEqual(parse("See ![[Analyse]]."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: "See ![[Analyse]]." }]
      }
    ],
    diagnostics: []
  });
});

test("wiki link parser leaves syntax inside protected regions literal", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("See `[[Analyse]]` and <span>[[Algebra]]</span>."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "See `[[Analyse]]` and <span>[[Algebra]]</span>."
          }
        ]
      }
    ],
    diagnostics: []
  });
});
