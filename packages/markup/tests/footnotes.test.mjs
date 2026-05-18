import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule as loadRuntimeTsModule } from "./helpers/load-ts-module.mjs";

const parserModuleUrl = new URL("../src/parser.ts", import.meta.url);
const serializerModuleUrl = new URL("../src/serializer.ts", import.meta.url);
const fixturesModuleUrl = new URL("../src/fixtures.ts", import.meta.url);

const footnoteFixtureIds = [
  "footnotes/basic",
  "footnotes/missing-definition",
  "footnotes/unused-definition"
];

let parserPromise;
let serializerPromise;
let fixturesPromise;

async function loadTsModule(moduleUrl) {
  return loadRuntimeTsModule(moduleUrl);
}

async function loadParserModule() {
  parserPromise ??= loadTsModule(parserModuleUrl);
  return parserPromise;
}

async function loadSerializerModule() {
  serializerPromise ??= loadTsModule(serializerModuleUrl);
  return serializerPromise;
}

async function loadFixturesModule() {
  fixturesPromise ??= loadTsModule(fixturesModuleUrl);
  return fixturesPromise;
}

test("footnote fixtures parse and serialize according to the checked-in contracts", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();
  const {
    compareFixtureAst,
    compareFixtureDiagnostics,
    compareFixtureOutput,
    loadParserFixture
  } = await loadFixturesModule();

  for (const fixtureId of footnoteFixtureIds) {
    const fixture = await loadParserFixture(fixtureId);
    const parsed = parse(fixture.input);

    compareFixtureAst(parsed, fixture.ast);
    compareFixtureDiagnostics(parsed.diagnostics, fixture.diagnostics);
    compareFixtureOutput(serialize(parsed), fixture.output);
  }
});

test("parse basic footnote reference and definition", async () => {
  const { parse } = await loadParserModule();
  const result = parse("Text[^a].\n\n[^a]: Footnote content.");

  const ref = result.children[0].children[1];
  assert.equal(ref.type, "footnoteReference");
  assert.equal(ref.id, "a");
  assert.equal(ref.raw, "[^a]");

  const def = result.children[1];
  assert.equal(def.type, "footnoteDefinition");
  assert.equal(def.id, "a");
  assert.equal(def.raw, "[^a]: Footnote content.");
});

test("parse missing footnote definition yields diagnostic", async () => {
  const { parse } = await loadParserModule();
  const result = parse("Text[^missing].");

  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].severity, "warning");
  assert.equal(result.diagnostics[0].code, "NABLA_FOOTNOTE_MISSING_DEFINITION");
  assert.equal(result.diagnostics[0].message, "Footnote reference has no matching definition.");
});

test("parse unused footnote definition yields diagnostic", async () => {
  const { parse } = await loadParserModule();
  const result = parse("Text.\n\n[^unused]: Unused.");

  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].severity, "info");
  assert.equal(result.diagnostics[0].code, "NABLA_FOOTNOTE_UNUSED_DEFINITION");
  assert.equal(result.diagnostics[0].message, "Footnote definition is not referenced.");
});

test("parse footnote and tooltip with no conflict", async () => {
  const { parse } = await loadParserModule();
  const result = parse("Text[^a] and word^[tip].");

  const ref = result.children[0].children[1];
  assert.equal(ref.type, "footnoteReference");
  assert.equal(ref.id, "a");
});

test("serialize footnote round-trips", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();

  const input = "Text[^a].\n\n[^a]: Footnote content.";
  const parsed = parse(input);
  const output = serialize(parsed).trimEnd();

  assert.equal(output, input);
});

test("serialize missing definition round-trips", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();

  const input = "Text[^missing].";
  const parsed = parse(input);
  const output = serialize(parsed).trimEnd();

  assert.equal(output, input);
});

test("serialize unused definition round-trips", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();

  const input = "Text.\n\n[^unused]: Unused.";
  const parsed = parse(input);
  const output = serialize(parsed).trimEnd();

  assert.equal(output, input);
});

test("footnote reference in protected region remains literal", async () => {
  const { parse } = await loadParserModule();
  const result = parse("`[^a]`");

  assert.equal(result.children[0].children[0].type, "inlineCode");
  assert.equal(result.children[0].children[0].value, "[^a]");
  assert.equal(result.diagnostics.length, 0);
});
