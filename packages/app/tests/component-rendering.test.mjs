import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/component-rendering.js", import.meta.url));
}

test("component descriptor list is non-empty", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();

  assert.ok(Array.isArray(descriptors));
  assert.ok(descriptors.length > 0);
});

test("descriptor list includes taskState", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("taskState"));
});

test("task state descriptors use inProgress semantics for dash marker", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const taskStates = descriptors.filter((d) => d.kind === "taskState");
  const states = taskStates.map((d) => d.props.state);
  const texts = taskStates.map((d) => d.props.text);

  assert.ok(states.includes("inProgress"));
  assert.equal(states.includes("cancelled"), false);
  assert.ok(texts.includes("In progress task"));
  assert.equal(texts.includes("Cancelled task"), false);
});

test("descriptor list includes wikiLink", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("wikiLink"));
});

test("descriptor list includes tag", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("tag"));
});

test("descriptor list includes highlight", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("highlight"));
});

test("descriptor list includes emoji", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("emoji"));
});

test("descriptor list includes footnote", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("footnote"));
});

test("descriptor list includes comment", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("comment"));
});

test("descriptor list includes callout", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("callout"));
});

test("descriptor list includes toggle", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("toggle"));
});

test("descriptor list includes foldedHeading", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.ok(kinds.includes("foldedHeading"));
});

test("descriptor props contain no html key", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();

  for (const desc of descriptors) {
    assert.equal("html" in desc.props, false, `descriptor ${desc.kind} must not contain "html"`);
  }
});

test("descriptor props contain no innerHTML key", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();

  for (const desc of descriptors) {
    assert.equal("innerHTML" in desc.props, false, `descriptor ${desc.kind} must not contain "innerHTML"`);
  }
});

test("descriptor props contain no editorState key", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();

  for (const desc of descriptors) {
    assert.equal("editorState" in desc.props, false, `descriptor ${desc.kind} must not contain "editorState"`);
  }
});

test("descriptor props contain no jsonState key", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();

  for (const desc of descriptors) {
    assert.equal("jsonState" in desc.props, false, `descriptor ${desc.kind} must not contain "jsonState"`);
  }
});

test("descriptor props contain no serializedState key", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();

  for (const desc of descriptors) {
    assert.equal("serializedState" in desc.props, false, `descriptor ${desc.kind} must not contain "serializedState"`);
  }
});

test("render summary includes component count", async () => {
  const mod = await load();

  const summary = mod.getComponentRenderingSummary();

  assert.equal(typeof summary.totalCount, "number");
  assert.ok(summary.totalCount > 0);
});

test("render summary includes supported kinds", async () => {
  const mod = await load();

  const summary = mod.getComponentRenderingSummary();

  assert.ok(Array.isArray(summary.supportedKinds));
  assert.ok(summary.supportedKinds.length > 0);
});

test("transclusion is not included in sample descriptors", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.equal(kinds.includes("transclusion"), false);
});

test("tooltip is not included in sample descriptors", async () => {
  const mod = await load();

  const descriptors = mod.createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);

  assert.equal(kinds.includes("tooltip"), false);
});
