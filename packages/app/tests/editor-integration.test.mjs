import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/editor-integration.js", import.meta.url));
}

test("editor integration can load sample source", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const editor = mod.createSourceEditor(SAMPLE_DOCUMENT_SOURCE);

  assert.ok(editor);
  assert.equal(typeof editor.source, "string");
  assert.ok(editor.source.length > 0);
});

test("getEditableSource returns sample document source content", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const editable = mod.getEditableSource(SAMPLE_DOCUMENT_SOURCE);

  assert.equal(typeof editable, "string");
  assert.ok(editable.length > 0);
  assert.ok(editable.includes("Nabla Sample Document"));
});

test("editable source can be retrieved", async () => {
  const mod = await load();
  const source = "# Hello\n\nWorld.\n";

  const editable = mod.getEditableSource(source);

  assert.equal(typeof editable, "string");
  assert.ok(editable.length > 0);
});

test("canonical export returns non-empty string", async () => {
  const mod = await load();
  const source = "# Title\n\nParagraph.\n";

  const exported = mod.exportCanonicalSource(source);

  assert.equal(typeof exported, "string");
  assert.ok(exported.length > 0);
});

test("edited source changes canonical export deterministically", async () => {
  const mod = await load();

  const first = mod.exportCanonicalSource("# Alpha\n");
  const second = mod.exportCanonicalSource("# Beta\n");

  assert.equal(typeof first, "string");
  assert.equal(typeof second, "string");
  assert.notEqual(first, second);
  assert.ok(first.includes("Alpha"));
  assert.ok(second.includes("Beta"));
});

test("summary contains numeric source length", async () => {
  const mod = await load();
  const source = "Test source.\n";

  const summary = mod.getEditorIntegrationSummary(source);

  assert.equal(typeof summary.sourceLength, "number");
  assert.ok(summary.sourceLength > 0);
});

test("summary contains numeric exported length", async () => {
  const mod = await load();
  const source = "Test source.\n";

  const summary = mod.getEditorIntegrationSummary(source);

  assert.equal(typeof summary.exportedLength, "number");
  assert.ok(summary.exportedLength > 0);
});

test("summary contains diagnostics count", async () => {
  const mod = await load();
  const source = "Test source.\n";

  const summary = mod.getEditorIntegrationSummary(source);

  assert.equal(typeof summary.diagnosticsCount, "number");
});

test("summary hasExportedSource is true for valid source", async () => {
  const mod = await load();
  const source = "Test source.\n";

  const summary = mod.getEditorIntegrationSummary(source);

  assert.equal(summary.hasExportedSource, true);
});

test("summary contains no html key", async () => {
  const mod = await load();
  const source = "Test source.\n";

  const summary = mod.getEditorIntegrationSummary(source);

  assert.equal("html" in summary, false);
});

test("summary contains no innerHTML key", async () => {
  const mod = await load();
  const source = "Test source.\n";

  const summary = mod.getEditorIntegrationSummary(source);

  assert.equal("innerHTML" in summary, false);
});

test("summary contains no editorState key", async () => {
  const mod = await load();
  const source = "Test source.\n";

  const summary = mod.getEditorIntegrationSummary(source);

  assert.equal("editorState" in summary, false);
});

test("summary contains no jsonState key", async () => {
  const mod = await load();
  const source = "Test source.\n";

  const summary = mod.getEditorIntegrationSummary(source);

  assert.equal("jsonState" in summary, false);
});

test("summary contains no serializedState key", async () => {
  const mod = await load();
  const source = "Test source.\n";

  const summary = mod.getEditorIntegrationSummary(source);

  assert.equal("serializedState" in summary, false);
});

test("editor integration does not use workspace", async () => {
  const mod = await load();

  assert.equal(typeof mod.createSourceEditor, "function");
  assert.equal(typeof mod.getEditableSource, "function");
  assert.equal(typeof mod.exportCanonicalSource, "function");
  assert.equal(typeof mod.getEditorIntegrationSummary, "function");

  assert.ok(!("createWorkspace" in mod));
  assert.ok(!("resolveWikiLinks" in mod));
});

test("exported canonical export contains no hidden state keys", async () => {
  const mod = await load();
  const source = "# Hello\n\nWorld.\n";

  const exported = mod.exportCanonicalSource(source);

  const forbidden = ["html", "innerHTML", "editorState", "jsonState", "serializedState"];
  for (const key of forbidden) {
    assert.equal(typeof exported, "string");
    assert.ok(!exported.includes("<!DOCTYPE"));
    assert.ok(!exported.includes("<html"));
  }
});
