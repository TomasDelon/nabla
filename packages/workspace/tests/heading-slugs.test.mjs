import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "../../markup/tests/helpers/load-ts-module.mjs";

const slugModuleUrl = new URL("../src/slug.ts", import.meta.url);
const headingIndexModuleUrl = new URL("../src/heading-index.ts", import.meta.url);
const parseModuleUrl = new URL("../../markup/src/parser.ts", import.meta.url);

let slugModulePromise;
let headingIndexModulePromise;
let parseModulePromise;

async function loadSlugModule() {
  slugModulePromise ??= loadTsModule(slugModuleUrl);
  return slugModulePromise;
}

async function loadHeadingIndexModule() {
  headingIndexModulePromise ??= loadTsModule(headingIndexModuleUrl);
  return headingIndexModulePromise;
}

async function loadParseModule() {
  parseModulePromise ??= loadTsModule(parseModuleUrl);
  return parseModulePromise;
}

test("createSlug lowercases and trims", async () => {
  const { createSlug } = await loadSlugModule();
  assert.equal(createSlug("  Hello World  "), "hello-world");
});

test("createSlug replaces whitespace with hyphens", async () => {
  const { createSlug } = await loadSlugModule();
  assert.equal(createSlug("a  b\tc\n d"), "a-b-c-d");
});

test("createSlug removes accents via Unicode decomposition", async () => {
  const { createSlug } = await loadSlugModule();
  assert.equal(createSlug("Café résumé"), "cafe-resume");
  assert.equal(createSlug("über cool"), "uber-cool");
});

test("createSlug removes punctuation except hyphen and underscore", async () => {
  const { createSlug } = await loadSlugModule();
  assert.equal(createSlug("Hello, World! How's it going?"), "hello-world-hows-it-going");
  assert.equal(createSlug("foo_bar"), "foo_bar");
});

test("createSlug collapses repeated hyphens", async () => {
  const { createSlug } = await loadSlugModule();
  assert.equal(createSlug("foo---bar"), "foo-bar");
});

test("createSlug trims leading and trailing hyphens", async () => {
  const { createSlug } = await loadSlugModule();
  assert.equal(createSlug("-hello-"), "hello");
  assert.equal(createSlug("--hi--"), "hi");
});

test("createSlug returns empty string for all-punctuation input", async () => {
  const { createSlug } = await loadSlugModule();
  assert.equal(createSlug("!!?"), "");
});

test("deduplicateSlugs returns first occurrence unchanged", async () => {
  const { deduplicateSlugs } = await loadSlugModule();
  assert.deepEqual(deduplicateSlugs(["hello"]), ["hello"]);
});

test("deduplicateSlugs suffixes second occurrence with -2", async () => {
  const { deduplicateSlugs } = await loadSlugModule();
  assert.deepEqual(deduplicateSlugs(["hello", "hello"]), ["hello", "hello-2"]);
});

test("deduplicateSlugs handles triple duplicates as slug, slug-2, slug-3", async () => {
  const { deduplicateSlugs } = await loadSlugModule();
  assert.deepEqual(
    deduplicateSlugs(["foo", "foo", "foo"]),
    ["foo", "foo-2", "foo-3"]
  );
});

test("deduplicateSlugs handles interleaved duplicates independently", async () => {
  const { deduplicateSlugs } = await loadSlugModule();
  assert.deepEqual(
    deduplicateSlugs(["a", "b", "a", "b", "a"]),
    ["a", "b", "a-2", "b-2", "a-3"]
  );
});

test("buildHeadingIndex extracts standard heading nodes", async () => {
  const { parse } = await loadParseModule();
  const { buildHeadingIndex } = await loadHeadingIndexModule();

  const doc = parse("# Hello\n## World\n");
  const index = buildHeadingIndex(doc, "test.md");

  assert.equal(index.length, 2);
  assert.equal(index[0].slug, "hello");
  assert.equal(index[0].text, "Hello");
  assert.equal(index[0].depth, 1);
  assert.equal(index[0].filePath, "test.md");
  assert.equal(index[1].slug, "world");
  assert.equal(index[1].text, "World");
  assert.equal(index[1].depth, 2);
});

test("buildHeadingIndex extracts foldable heading nodes", async () => {
  const { parse } = await loadParseModule();
  const { buildHeadingIndex } = await loadHeadingIndexModule();

  const doc = parse("#> Closed\n\n##v Open\n");
  const index = buildHeadingIndex(doc, "test.md");

  assert.equal(index.length, 2);
  assert.equal(index[0].slug, "closed");
  assert.equal(index[0].text, "Closed");
  assert.equal(index[1].slug, "open");
  assert.equal(index[1].text, "Open");
});

test("buildHeadingIndex deduplicates duplicate heading texts", async () => {
  const { parse } = await loadParseModule();
  const { buildHeadingIndex } = await loadHeadingIndexModule();

  const doc = parse("# Duplicate\n# Duplicate\n# Duplicate\n");
  const index = buildHeadingIndex(doc, "test.md");

  assert.equal(index.length, 3);
  assert.equal(index[0].slug, "duplicate");
  assert.equal(index[1].slug, "duplicate-2");
  assert.equal(index[2].slug, "duplicate-3");
});

test("buildHeadingIndex handles mixed standard and foldable headings", async () => {
  const { parse } = await loadParseModule();
  const { buildHeadingIndex } = await loadHeadingIndexModule();

  const doc = parse("# Standard\n#> Foldable\n## Another\n##v Foldable 2\n");
  const index = buildHeadingIndex(doc, "test.md");

  assert.equal(index.length, 4);
  assert.equal(index[0].text, "Standard");
  assert.equal(index[1].text, "Foldable");
  assert.equal(index[2].text, "Another");
  assert.equal(index[3].text, "Foldable 2");
});
