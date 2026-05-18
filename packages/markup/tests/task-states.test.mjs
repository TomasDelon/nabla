import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule as loadRuntimeTsModule } from "./helpers/load-ts-module.mjs";

const parserModuleUrl = new URL("../src/parser.ts", import.meta.url);
const serializerModuleUrl = new URL("../src/serializer.ts", import.meta.url);
const fixturesModuleUrl = new URL("../src/fixtures.ts", import.meta.url);

const taskStateFixtureIds = [
  "task-states/basic",
  "task-states/unsupported-marker"
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

test("task state fixtures parse and serialize according to the checked-in contracts", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();
  const {
    compareFixtureAst,
    compareFixtureDiagnostics,
    compareFixtureOutput,
    loadParserFixture
  } = await loadFixturesModule();

  for (const fixtureId of taskStateFixtureIds) {
    const fixture = await loadParserFixture(fixtureId);
    const parsed = parse(fixture.input);

    compareFixtureAst(parsed, fixture.ast);
    compareFixtureDiagnostics(parsed.diagnostics, fixture.diagnostics);
    compareFixtureOutput(serialize(parsed), fixture.output);
  }
});

test("parse unmaps task state markers to data.nablaTaskState", async () => {
  const { parse } = await loadParserModule();

  const result = parse("- [ ] a\n- [x] b\n- [-] c\n- [!] d");
  const list = result.children[0];
  const items = list.children;

  assert.equal(items[0].data.nablaTaskState, "unchecked");
  assert.equal(items[1].data.nablaTaskState, "checked");
  assert.equal(items[2].data.nablaTaskState, "cancelled");
  assert.equal(items[3].data.nablaTaskState, "important");
});

test("parse leaves unsupported markers as literal text without task state", async () => {
  const { parse } = await loadParserModule();

  const result = parse("- [?] maybe");
  const list = result.children[0];
  const item = list.children[0];

  assert.equal(item.data, undefined);
  const paragraph = item.children[0];
  const text = paragraph.children[0];
  assert.equal(text.value, "[?] maybe");
});

test("serialize emits canonical task state markers", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();

  const input = "- [ ] a\n- [x] b\n- [-] c\n- [!] d";
  const parsed = parse(input);
  const output = serialize(parsed).trimEnd();

  assert.equal(output, input);
});

test("serialize emits literal text for unsupported markers", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();

  const input = "- [?] maybe";
  const parsed = parse(input);
  const output = serialize(parsed).trimEnd();

  assert.equal(output, input);
});
