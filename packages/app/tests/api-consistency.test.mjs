import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/index.js", import.meta.url));
}

const INTENDED_EXPORTS = [
  "NABLA_APP_PACKAGE",
  "SAMPLE_DOCUMENT_SOURCE",
  "canonicalizeSampleSource",
  "getRenderPipelineSummary",
  "createSampleComponentDescriptors",
  "getComponentRenderingSummary",
  "createSourceEditor",
  "getEditableSource",
  "exportCanonicalSource",
  "getEditorIntegrationSummary",
  "createSampleWorkspaceIndex",
  "getWorkspaceIntegrationSummary",
];

const FORBIDDEN_INTERNALS = [
  "parse",
  "serialize",
  "createWorkspace",
  "createEditor",
  "loadSource",
  "getSource",
  "TaskStateCheckbox",
  "WikiLink",
  "Tag",
  "Highlight",
  "Emoji",
  "FootnoteReference",
  "FootnoteDefinition",
  "Comment",
  "Callout",
  "Toggle",
  "FoldedHeading",
  "createComponentDescriptor",
  "toComponentProps",
];

const SOURCE_OF_TRUTH_VIOLATIONS = [
  "html",
  "innerHTML",
  "editorState",
  "jsonState",
  "serializedState",
];

test("app public API exports NABLA_APP_PACKAGE", async () => {
  const mod = await load();
  assert.equal(mod.NABLA_APP_PACKAGE, "@nabla/app");
});

test("app public API exports SAMPLE_DOCUMENT_SOURCE", async () => {
  const mod = await load();
  assert.equal(typeof mod.SAMPLE_DOCUMENT_SOURCE, "string");
  assert.ok(mod.SAMPLE_DOCUMENT_SOURCE.length > 0);
});

test("app public API exports canonicalizeSampleSource", async () => {
  const mod = await load();
  assert.equal(typeof mod.canonicalizeSampleSource, "function");
  const result = mod.canonicalizeSampleSource("# Test");
  assert.equal(typeof result, "string");
});

test("app public API exports getRenderPipelineSummary", async () => {
  const mod = await load();
  assert.equal(typeof mod.getRenderPipelineSummary, "function");
  const result = mod.getRenderPipelineSummary("# Test");
  assert.equal(typeof result.originalLength, "number");
  assert.equal(typeof result.canonicalLength, "number");
  assert.equal(typeof result.diagnosticsCount, "number");
  assert.equal(typeof result.hasCanonicalOutput, "boolean");
  assert.equal(typeof result.canonicalSource, "string");
});

test("app public API exports createSampleComponentDescriptors", async () => {
  const mod = await load();
  assert.equal(typeof mod.createSampleComponentDescriptors, "function");
  const descriptors = mod.createSampleComponentDescriptors();
  assert.ok(Array.isArray(descriptors));
  assert.ok(descriptors.length > 0);
});

test("app public API exports getComponentRenderingSummary", async () => {
  const mod = await load();
  assert.equal(typeof mod.getComponentRenderingSummary, "function");
  const summary = mod.getComponentRenderingSummary();
  assert.equal(typeof summary.totalCount, "number");
  assert.ok(Array.isArray(summary.uniqueKinds));
  assert.ok(Array.isArray(summary.supportedKinds));
});

test("app public API exports createSourceEditor", async () => {
  const mod = await load();
  assert.equal(typeof mod.createSourceEditor, "function");
  const editor = mod.createSourceEditor("# Test");
  assert.ok(editor);
  assert.equal(typeof editor.source, "string");
});

test("app public API exports getEditableSource", async () => {
  const mod = await load();
  assert.equal(typeof mod.getEditableSource, "function");
  const source = mod.getEditableSource("# Hello");
  assert.equal(typeof source, "string");
  assert.ok(source.length > 0);
});

test("app public API exports exportCanonicalSource", async () => {
  const mod = await load();
  assert.equal(typeof mod.exportCanonicalSource, "function");
  const result = mod.exportCanonicalSource("# Hello\n\nWorld.");
  assert.equal(typeof result, "string");
  assert.ok(result.length > 0);
});

test("app public API exports getEditorIntegrationSummary", async () => {
  const mod = await load();
  assert.equal(typeof mod.getEditorIntegrationSummary, "function");
  const summary = mod.getEditorIntegrationSummary("# Test");
  assert.equal(typeof summary.sourceLength, "number");
  assert.equal(typeof summary.exportedLength, "number");
  assert.equal(typeof summary.diagnosticsCount, "number");
  assert.equal(typeof summary.hasExportedSource, "boolean");
});

test("app public API exports createSampleWorkspaceIndex", async () => {
  const mod = await load();
  assert.equal(typeof mod.createSampleWorkspaceIndex, "function");
  const result = mod.createSampleWorkspaceIndex("# Test\n\n[[Page]]\n");
  assert.ok(result);
  assert.ok(result.workspace);
});

test("app public API exports getWorkspaceIntegrationSummary", async () => {
  const mod = await load();
  assert.equal(typeof mod.getWorkspaceIntegrationSummary, "function");
  const summary = mod.getWorkspaceIntegrationSummary("# Test\n\n[[Page]]\n");
  assert.equal(typeof summary.hasWorkspaceIndex, "boolean");
  assert.equal(typeof summary.documentCount, "number");
  assert.equal(typeof summary.linkCount, "number");
  assert.equal(typeof summary.backlinkCount, "number");
  assert.equal(typeof summary.diagnosticCount, "number");
});

test("app public API exports all intended exports", async () => {
  const mod = await load();
  for (const name of INTENDED_EXPORTS) {
    assert.ok(name in mod, `expected export "${name}" is missing from app public API`);
  }
});

test("app public API does not export forbidden low-level parser/serializer internals", async () => {
  const mod = await load();
  for (const name of ["parse", "serialize"]) {
    assert.equal(name in mod, false, `must not export "${name}"`);
  }
});

test("app public API does not export forbidden low-level workspace internals", async () => {
  const mod = await load();
  assert.equal("createWorkspace" in mod, false, "must not export createWorkspace");
});

test("app public API does not export forbidden low-level editor internals", async () => {
  const mod = await load();
  for (const name of ["createEditor", "loadSource", "getSource"]) {
    assert.equal(name in mod, false, `must not export "${name}"`);
  }
});

test("app public API does not export component React classes directly", async () => {
  const mod = await load();
  const componentNames = [
    "TaskStateCheckbox",
    "WikiLink",
    "Tag",
    "Highlight",
    "Emoji",
    "FootnoteReference",
    "FootnoteDefinition",
    "Comment",
    "Callout",
    "Toggle",
    "FoldedHeading",
  ];
  for (const name of componentNames) {
    assert.equal(name in mod, false, `must not export component "${name}" directly`);
  }
});

test("app public API does not export component bridge internals", async () => {
  const mod = await load();
  for (const name of ["createComponentDescriptor", "toComponentProps"]) {
    assert.equal(name in mod, false, `must not export "${name}"`);
  }
});

test("app public API does not export any forbidden internals", async () => {
  const mod = await load();
  for (const name of FORBIDDEN_INTERNALS) {
    assert.equal(name in mod, false, `must not export forbidden internal "${name}"`);
  }
});

test("app public API does not expose source-of-truth violation keys on summary objects", async () => {
  const mod = await load();
  const summaries = [
    { label: "renderPipelineSummary", value: mod.getRenderPipelineSummary("# Test") },
    { label: "editorIntegrationSummary", value: mod.getEditorIntegrationSummary("# Test") },
    { label: "workspaceIntegrationSummary", value: mod.getWorkspaceIntegrationSummary("# Test\n\n[[Page]]\n") },
  ];
  const componentSummary = mod.getComponentRenderingSummary();
  for (const { label, value } of summaries) {
    for (const key of SOURCE_OF_TRUTH_VIOLATIONS) {
      assert.equal(key in value, false, `${label} must not contain "${key}"`);
    }
  }
  for (const desc of mod.createSampleComponentDescriptors()) {
    for (const key of SOURCE_OF_TRUTH_VIOLATIONS) {
      assert.equal(key in desc.props, false, `descriptor ${desc.kind} props must not contain "${key}"`);
    }
  }
});

test("tooltip renderers are not exported from app public API", async () => {
  const mod = await load();
  const tooltipNames = [
    "TooltipRenderer",
    "renderTooltip",
    "TooltipComponent",
  ];
  for (const name of tooltipNames) {
    assert.equal(name in mod, false, `must not export tooltip renderer "${name}"`);
  }
});

test("transclusion renderers are not exported from app public API", async () => {
  const mod = await load();
  const transclusionNames = [
    "TransclusionRenderer",
    "renderTransclusion",
    "TransclusionComponent",
  ];
  for (const name of transclusionNames) {
    assert.equal(name in mod, false, `must not export transclusion renderer "${name}"`);
  }
});

test("Node-safe import — dist/index.js loads without error", async () => {
  const mod = await load();
  assert.ok(mod, "app public API module loaded successfully");
});

test("intended exports are all functions or strings", async () => {
  const mod = await load();
  const stringExports = new Set(["NABLA_APP_PACKAGE", "SAMPLE_DOCUMENT_SOURCE"]);
  for (const name of INTENDED_EXPORTS) {
    const val = mod[name];
    if (stringExports.has(name)) {
      assert.equal(typeof val, "string", `${name} should be a string`);
    } else {
      assert.equal(typeof val, "function", `${name} should be a function`);
    }
  }
});
