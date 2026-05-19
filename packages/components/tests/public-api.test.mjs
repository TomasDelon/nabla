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

test("no forbidden visual components are exported", async () => {
  const mod = await load();
  const keys = Object.keys(mod);

  assert.equal(keys.includes("Emoji"), false);
  assert.equal(keys.includes("Footnote"), false);
  assert.equal(keys.includes("Comment"), false);
  assert.equal(keys.includes("Callout"), false);
  assert.equal(keys.includes("Toggle"), false);
  assert.equal(keys.includes("FoldedHeading"), false);
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
