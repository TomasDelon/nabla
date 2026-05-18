import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule as loadRuntimeTsModule } from "./helpers/load-ts-module.mjs";

const parserModuleUrl = new URL("../src/parser.ts", import.meta.url);
const serializerModuleUrl = new URL("../src/serializer.ts", import.meta.url);
const fixturesModuleUrl = new URL("../src/fixtures.ts", import.meta.url);
const frontmatterModuleUrl = new URL("../src/extensions/frontmatter.ts", import.meta.url);

const frontmatterFixtureIds = [
  "frontmatter/valid",
  "frontmatter/invalid",
  "frontmatter/horizontal-rule"
];

let parserPromise;
let serializerPromise;
let fixturesPromise;
let frontmatterPromise;

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

async function loadFrontmatterModule() {
  frontmatterPromise ??= loadTsModule(frontmatterModuleUrl);
  return frontmatterPromise;
}

test("frontmatter fixtures parse and serialize according to the checked-in contracts", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();
  const {
    compareFixtureAst,
    compareFixtureDiagnostics,
    compareFixtureOutput,
    loadParserFixture
  } = await loadFixturesModule();

  for (const fixtureId of frontmatterFixtureIds) {
    const fixture = await loadParserFixture(fixtureId);
    const parsed = parse(fixture.input);

    compareFixtureAst(parsed, fixture.ast);
    compareFixtureDiagnostics(parsed.diagnostics, fixture.diagnostics);
    compareFixtureOutput(serialize(parsed), fixture.output);
  }
});

test("parse valid frontmatter yields correct raw and data", async () => {
  const { parse } = await loadParserModule();
  const result = parse("---\ntitle: Analyse\ntags: [math]\n---\n# Course");

  const frontmatter = result.children[0];
  assert.equal(frontmatter.type, "frontmatter");
  assert.equal(frontmatter.raw, "title: Analyse\ntags: [math]");
  assert.deepEqual(frontmatter.data, { title: "Analyse", tags: ["math"] });
});

test("parse invalid frontmatter yields raw with null data and diagnostic", async () => {
  const { parse } = await loadParserModule();
  const result = parse("---\ntitle: [broken\n---\nText");

  const frontmatter = result.children[0];
  assert.equal(frontmatter.type, "frontmatter");
  assert.equal(frontmatter.raw, "title: [broken");
  assert.equal(frontmatter.data, null);

  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].severity, "warning");
  assert.equal(result.diagnostics[0].code, "NABLA_FRONTMATTER_INVALID");
  assert.equal(result.diagnostics[0].message, "Frontmatter could not be parsed.");
});

test("parse --- not at document start is not frontmatter", async () => {
  const { parse } = await loadParserModule();
  const result = parse("text\n---\nmore");
  const firstChild = result.children[0];

  assert.notEqual(firstChild.type, "frontmatter");
});

test("parse --- without closing delimiter is not frontmatter", async () => {
  const { parse } = await loadParserModule();
  const result = parse("---\ntitle: Analyse");
  const firstChild = result.children[0];

  assert.notEqual(firstChild.type, "frontmatter");
  assert.equal(result.diagnostics.length, 0);
});

test("serialize valid frontmatter round-trips", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();

  const input = "---\ntitle: Analyse\ntags: [math]\n---\n# Course";
  const parsed = parse(input);
  const output = serialize(parsed).trimEnd();

  assert.equal(output, input);
});

test("serialize invalid frontmatter round-trips", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();

  const input = "---\ntitle: [broken\n---\nText";
  const parsed = parse(input);
  const output = serialize(parsed).trimEnd();

  assert.equal(output, input);
});

test("parseFrontmatterBlock returns null for non-frontmatter start", async () => {
  const { parseFrontmatterBlock } = await loadFrontmatterModule();
  const result = parseFrontmatterBlock(["text", "---", "content", "---"], 0);
  assert.equal(result, null);
});

test("parseFrontmatterBlock returns null when no closing ---", async () => {
  const { parseFrontmatterBlock } = await loadFrontmatterModule();
  const result = parseFrontmatterBlock(["---", "title: broken"], 0);
  assert.equal(result, null);
});

test("thematic break round-trips", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();

  const input = "a\n\n---\n\nb";
  const parsed = parse(input);
  const output = serialize(parsed).trimEnd();
  assert.equal(output, input);
});
