import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/render-pipeline.js", import.meta.url));
}

test("parseSampleSource parses sample source without throwing", async () => {
  const mod = await load();
  const source = "# Test\n\n- [x] done\n\n[[Page]]\n";

  const doc = mod.parseSampleSource(source);

  assert.ok(doc);
  assert.equal(typeof doc.type, "string");
  assert.ok(Array.isArray(doc.children));
  assert.ok(Array.isArray(doc.diagnostics));
});

test("canonicalizeSampleSource returns a non-empty string", async () => {
  const mod = await load();
  const source = "# Nabla Sample\n\n:check:\n\n==hi==\n";

  const output = mod.canonicalizeSampleSource(source);

  assert.equal(typeof output, "string");
  assert.ok(output.length > 0);
});

test("getRenderPipelineSummary returns all expected fields", async () => {
  const mod = await load();
  const source = "# Hello\n\n%%comment%%\n";

  const summary = mod.getRenderPipelineSummary(source);

  assert.ok(summary.originalLength > 0);
  assert.ok(summary.canonicalLength > 0);
  assert.equal(typeof summary.diagnosticsCount, "number");
  assert.equal(summary.hasCanonicalOutput, true);
  assert.equal(typeof summary.canonicalSource, "string");
  assert.ok(summary.canonicalSource.length > 0);
});

test("getRenderPipelineSummary processes full sample document", async () => {
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );
  const mod = await load();

  const summary = mod.getRenderPipelineSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.ok(summary.originalLength > 0);
  assert.ok(summary.canonicalLength > 0);
  assert.equal(typeof summary.diagnosticsCount, "number");
  assert.equal(summary.hasCanonicalOutput, true);
});

test("pipeline output preserves source-of-truth invariant", async () => {
  const mod = await load();
  const source = "# Test\n\n[!note]> callout\n";

  const summary = mod.getRenderPipelineSummary(source);

  const forbidden = ["html", "innerHTML", "editorState", "jsonState", "serializedState"];
  for (const key of forbidden) {
    assert.equal(key in summary, false, `summary must not contain "${key}"`);
  }

  const canonicalSource = summary.canonicalSource;
  assert.equal(typeof canonicalSource, "string");
  assert.ok(!canonicalSource.includes("<!DOCTYPE"));
  assert.ok(!canonicalSource.includes("<html"));
});
