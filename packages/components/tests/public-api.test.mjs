import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/index.js", import.meta.url));
}

test("NABLA_COMPONENTS_PACKAGE constant is exported", async () => {
  const mod = await load();

  assert.equal(mod.NABLA_COMPONENTS_PACKAGE, "@nabla/components");
});

test("TaskStateCheckbox is exported from public API", async () => {
  const mod = await load();

  assert.equal(typeof mod.TaskStateCheckbox, "function");
  assert.equal(typeof mod.getNextTaskState, "function");
});

test("WikiLink is exported from public API", async () => {
  const mod = await load();

  assert.equal(typeof mod.WikiLink, "function");
  assert.equal(typeof mod.getWikiLinkDisplay, "function");
});

test("Tag and Highlight are exported from public API", async () => {
  const mod = await load();

  assert.equal(typeof mod.Tag, "function");
  assert.equal(typeof mod.getTagDisplay, "function");
  assert.equal(typeof mod.Highlight, "function");
  assert.equal(typeof mod.getHighlightStyle, "function");
});

test("Emoji is exported from public API", async () => {
  const mod = await load();

  assert.equal(typeof mod.Emoji, "function");
  assert.equal(typeof mod.getEmojiDisplay, "function");
});

test("Footnote and Comment are exported from public API", async () => {
  const mod = await load();

  assert.equal(typeof mod.FootnoteReference, "function");
  assert.equal(typeof mod.FootnoteDefinition, "function");
  assert.equal(typeof mod.getFootnoteDisplay, "function");
  assert.equal(typeof mod.Comment, "function");
  assert.equal(typeof mod.getCommentDisplay, "function");
});

test("Callout is exported from public API", async () => {
  const mod = await load();

  assert.equal(typeof mod.Callout, "function");
  assert.equal(typeof mod.getCalloutDisplay, "function");
});

test("Toggle is exported from public API", async () => {
  const mod = await load();

  assert.equal(typeof mod.Toggle, "function");
  assert.equal(typeof mod.getToggleDisplay, "function");
});

test("FoldedHeading is exported from public API", async () => {
  const mod = await load();

  assert.equal(typeof mod.FoldedHeading, "function");
  assert.equal(typeof mod.getFoldedHeadingDisplay, "function");
});

test("bridge functions are exported from public API", async () => {
  const mod = await load();

  assert.equal(typeof mod.toComponentKind, "function");
  assert.equal(typeof mod.toComponentProps, "function");
  assert.equal(typeof mod.createComponentDescriptor, "function");
  assert.equal(typeof mod.isBridgeKindSupported, "function");
  assert.ok(Array.isArray(mod.BRIDGE_DEFERRED_KINDS));
  assert.ok(Array.isArray(mod.BRIDGE_BLOCKED_KINDS));
});

test("no forbidden visual components are exported", async () => {
  const mod = await load();
  const keys = Object.keys(mod);

  assert.equal(keys.includes("TooltipRenderer"), false);
  assert.equal(keys.includes("TransclusionRenderer"), false);
});

test("NABLA_COMPONENT_THEME is exported", async () => {
  const mod = await load();

  assert.equal(typeof mod.NABLA_COMPONENT_THEME, "object");
  assert.equal(typeof mod.NABLA_COMPONENT_THEME.colors, "object");
});

test("NABLA_COMPONENT_RENDERING_CONTRACT is exported", async () => {
  const mod = await load();

  assert.equal(
    mod.NABLA_COMPONENT_RENDERING_CONTRACT,
    "nabla-component-rendering-contract",
  );
});
