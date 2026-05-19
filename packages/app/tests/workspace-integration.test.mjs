import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/workspace-integration.js", import.meta.url));
}

test("sample workspace summary has documentCount >= 1", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal(typeof summary.documentCount, "number");
  assert.ok(summary.documentCount >= 1);
});

test("linkCount is numeric", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal(typeof summary.linkCount, "number");
});

test("backlinkCount is numeric", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal(typeof summary.backlinkCount, "number");
});

test("diagnosticCount is numeric", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal(typeof summary.diagnosticCount, "number");
});

test("summary hasWorkspaceIndex is true for valid source", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal(summary.hasWorkspaceIndex, true);
});

test("no filesystem path assumptions leak into summary", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal("path" in summary, false);
});

test("summary contains no html key", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal("html" in summary, false);
});

test("summary contains no innerHTML key", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal("innerHTML" in summary, false);
});

test("summary contains no editorState key", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal("editorState" in summary, false);
});

test("summary contains no jsonState key", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal("jsonState" in summary, false);
});

test("summary contains no serializedState key", async () => {
  const mod = await load();
  const { SAMPLE_DOCUMENT_SOURCE } = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );

  const summary = mod.getWorkspaceIntegrationSummary(SAMPLE_DOCUMENT_SOURCE);

  assert.equal("serializedState" in summary, false);
});
