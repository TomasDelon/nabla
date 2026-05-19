import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/sample-document.js", import.meta.url));
}

test("SAMPLE_DOCUMENT_SOURCE is a non-empty string", async () => {
  const mod = await load();

  assert.equal(typeof mod.SAMPLE_DOCUMENT_SOURCE, "string");
  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.length > 0);
});

test("SAMPLE_DOCUMENT_SOURCE contains heading marker", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("# Nabla Sample Document"));
});

test("SAMPLE_DOCUMENT_SOURCE contains task state markers", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("- [ ]"));
  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("- [x]"));
  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("- [-]"));
  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("- [!]"));
});

test("SAMPLE_DOCUMENT_SOURCE contains wiki link syntax", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("[[ResolvedPage|Resolved Link]]"));
  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("[[MissingPage]]"));
});

test("SAMPLE_DOCUMENT_SOURCE contains tag syntax", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("#mytag"));
  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("#nested/tag"));
});

test("SAMPLE_DOCUMENT_SOURCE contains highlight syntax", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("==highlight=="));
});

test("SAMPLE_DOCUMENT_SOURCE contains emoji shortcode", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes(":check:"));
});

test("SAMPLE_DOCUMENT_SOURCE contains footnote syntax", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("[^1]"));
});

test("SAMPLE_DOCUMENT_SOURCE contains comment syntax", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("%%"));
});

test("SAMPLE_DOCUMENT_SOURCE contains callout marker", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("[!note]>"));
});

test("SAMPLE_DOCUMENT_SOURCE contains toggle marker", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("]>"));
});

test("SAMPLE_DOCUMENT_SOURCE contains folded heading marker", async () => {
  const mod = await load();

  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.includes("#>"));
});
