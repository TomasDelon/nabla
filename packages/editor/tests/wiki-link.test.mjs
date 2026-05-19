import test from "node:test";
import assert from "node:assert/strict";

async function loadEditor() {
  return import(new URL("../dist/editor.js", import.meta.url));
}

async function loadWikiLink() {
  return import(new URL("../dist/nodes/wiki-link.js", import.meta.url));
}

test("detects [[Target]]", async () => {
  const mod = await loadWikiLink();

  assert.deepEqual(mod.getWikiLinksFromMarkdown("[[Target]]\n"), [
    {
      index: 0,
      target: "Target",
      syntax: "canonical",
      raw: "[[Target]]",
      unresolved: false,
    },
  ]);
});

test("detects [[Target|Alias]]", async () => {
  const mod = await loadWikiLink();

  assert.deepEqual(mod.getWikiLinksFromMarkdown("[[Target|Alias]]\n"), [
    {
      index: 0,
      target: "Target",
      alias: "Alias",
      syntax: "canonical",
      raw: "[[Target|Alias]]",
      unresolved: false,
    },
  ]);
});

test("detects [[Target#Heading]]", async () => {
  const mod = await loadWikiLink();

  assert.deepEqual(mod.getWikiLinksFromMarkdown("[[Target#Heading]]\n"), [
    {
      index: 0,
      target: "Target",
      heading: "Heading",
      syntax: "canonical",
      raw: "[[Target#Heading]]",
      unresolved: false,
    },
  ]);
});

test("detects [[Target^block]]", async () => {
  const mod = await loadWikiLink();

  assert.deepEqual(mod.getWikiLinksFromMarkdown("[[Target^block]]\n"), [
    {
      index: 0,
      target: "Target",
      blockId: "block",
      syntax: "canonical",
      raw: "[[Target^block]]",
      unresolved: false,
    },
  ]);
});

test("detects combined target and alias forms", async () => {
  const mod = await loadWikiLink();

  assert.deepEqual(mod.getWikiLinksFromMarkdown("[[Target#Heading|Alias]] [[Target#^block|Alias]]\n"), [
    {
      index: 0,
      target: "Target",
      heading: "Heading",
      alias: "Alias",
      syntax: "canonical",
      raw: "[[Target#Heading|Alias]]",
      unresolved: false,
    },
    {
      index: 1,
      target: "Target",
      blockId: "block",
      alias: "Alias",
      syntax: "compatible",
      raw: "[[Target#^block|Alias]]",
      unresolved: false,
    },
  ]);
});

test("ignores standard markdown links", async () => {
  const mod = await loadWikiLink();

  assert.deepEqual(mod.getWikiLinksFromMarkdown("[text](url)\n"), []);
});

test("load detect export preserves wiki link syntax", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();
  const source = "See [[Target#Heading|Alias]] today.\n";

  mod.loadSource(editor, source);

  assert.deepEqual(mod.getWikiLinks(editor), [
    {
      index: 0,
      target: "Target",
      heading: "Heading",
      alias: "Alias",
      syntax: "canonical",
      raw: "[[Target#Heading|Alias]]",
      unresolved: false,
    },
  ]);
  assert.equal(mod.getSource(editor), "See [[Target#Heading|Alias]] today.");
});

test("setWikiLinkAlias updates source alias deterministically", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();

  mod.loadSource(editor, "[[Target]]\n");
  mod.setWikiLinkAlias(editor, 0, "Alias");

  assert.equal(mod.getSource(editor), "[[Target|Alias]]");
});

test("no node views other than task-state and wiki-link are registered", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();

  assert.deepEqual(Object.keys(editor.nodeViews).sort(), ["highlight", "tag", "taskState", "wikiLink"]);
  assert.equal(editor.nodeViews.highlight, "node-safe-adapter");
  assert.equal(editor.nodeViews.tag, "node-safe-adapter");
  assert.equal(editor.nodeViews.taskState, "node-safe-adapter");
  assert.equal(editor.nodeViews.wikiLink, "node-safe-adapter");
});
