import test from "node:test";
import assert from "node:assert/strict";

async function loadIndex() {
  return import(new URL("../dist/index.js", import.meta.url));
}

async function loadBridge() {
  return import(new URL("../dist/bridge.js", import.meta.url));
}

// ── Component export completeness ──

const VISUAL_COMPONENTS = [
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

const PURE_HELPERS = [
  "getNextTaskState",
  "getWikiLinkDisplay",
  "getTagDisplay",
  "getHighlightStyle",
  "getEmojiDisplay",
  "getFootnoteDisplay",
  "getCommentDisplay",
  "getCalloutDisplay",
  "getToggleDisplay",
  "getFoldedHeadingDisplay",
];

const BRIDGE_EXPORTS = [
  "toComponentKind",
  "toComponentProps",
  "createComponentDescriptor",
  "isBridgeKindSupported",
  "BRIDGE_DEFERRED_KINDS",
  "BRIDGE_BLOCKED_KINDS",
];

test("all accepted visual components are exported", async () => {
  const mod = await loadIndex();

  for (const name of VISUAL_COMPONENTS) {
    assert.equal(typeof mod[name], "function", `${name} should be a function`);
  }
});

test("all accepted pure helpers are exported", async () => {
  const mod = await loadIndex();

  for (const name of PURE_HELPERS) {
    assert.equal(typeof mod[name], "function", `${name} should be a function`);
  }
});

test("all bridge APIs are exported", async () => {
  const mod = await loadIndex();

  for (const name of BRIDGE_EXPORTS) {
    if (name.startsWith("BRIDGE_")) {
      assert.ok(Array.isArray(mod[name]), `${name} should be an array`);
    } else {
      assert.equal(typeof mod[name], "function", `${name} should be a function`);
    }
  }
});

// ── Forbidden exports ──

test("no tooltip or transclusion renderer is exported", async () => {
  const mod = await loadIndex();
  const keys = Object.keys(mod);

  for (const forbidden of ["TooltipRenderer", "TransclusionRenderer"]) {
    assert.equal(keys.includes(forbidden), false, `${forbidden} must not be exported`);
  }
});

// ── Component kind coverage via bridge ──

const EXPECTED_BRIDGE_KINDS = [
  "taskState",
  "wikiLink",
  "tag",
  "highlight",
  "emoji",
  "footnote",
  "comment",
  "callout",
  "toggle",
  "foldedHeading",
];

test("all bridge-supported kinds are accepted", async () => {
  const mod = await loadBridge();

  for (const kind of EXPECTED_BRIDGE_KINDS) {
    assert.equal(mod.isBridgeKindSupported(kind), true, `${kind} should be bridge-supported`);
  }
});

test("bridge does not support transclusion", async () => {
  const mod = await loadBridge();

  assert.equal(mod.isBridgeKindSupported("transclusion"), false);
});

test("bridge does not support tooltip", async () => {
  const mod = await loadBridge();

  assert.equal(mod.isBridgeKindSupported("tooltip"), false);
});

test("BRIDGE_DEFERRED_KINDS marks transclusion as deferred", async () => {
  const mod = await loadBridge();

  assert.ok(mod.BRIDGE_DEFERRED_KINDS.includes("transclusion"));
});

test("BRIDGE_BLOCKED_KINDS marks tooltip as blocked", async () => {
  const mod = await loadBridge();

  assert.ok(mod.BRIDGE_BLOCKED_KINDS.includes("tooltip"));
});

// Check deferred/blocked via bridge
test("transclusion and tooltip are not bridge-supported", async () => {
  const mod = await loadBridge();

  assert.equal(mod.isBridgeKindSupported("transclusion"), false);
  assert.equal(mod.isBridgeKindSupported("tooltip"), false);
});

// ── Folded heading text preservation ──

test("FoldedHeadingProps in types.ts includes text", async () => {
  const mod = await loadBridge();

  const props = mod.toComponentProps({
    kind: "foldedHeading",
    level: 2,
    text: "Section Title",
    foldState: "open",
  });

  assert.equal(props.kind, "foldedHeading");
  assert.equal(props.text, "Section Title");
  assert.equal(props.level, 2);
  assert.equal(props.foldState, "open");
  assert.equal(typeof props.onToggleFold, "function");
});

test("toComponentProps preserves folded heading text through the bridge", async () => {
  const mod = await loadBridge();

  const inputText = "My Heading";
  const props = mod.toComponentProps({
    kind: "foldedHeading",
    level: 3,
    text: inputText,
    foldState: "closed",
  });

  assert.equal(props.text, inputText);
});

test("createComponentDescriptor preserves folded heading text", async () => {
  const mod = await loadBridge();

  const descriptor = mod.createComponentDescriptor({
    kind: "foldedHeading",
    level: 1,
    text: "Top Level",
    foldState: "open",
  });

  assert.equal(descriptor.props.text, "Top Level");
});

// ── Source-of-truth invariant ──

const FORBIDDEN_PROPS_KEYS = ["html", "innerHTML", "editorState", "jsonState", "serializedState"];

test("task state props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "taskState", state: "checked", text: "item" });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false, `props must not contain "${key}"`);
  }
});

test("wiki link props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "wikiLink", target: "Page", raw: "[[Page]]", unresolved: false });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false);
  }
});

test("tag props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "tag", value: "tag", segments: ["tag"], raw: "#tag" });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false);
  }
});

test("highlight props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "highlight", text: "hi", raw: "==hi==" });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false);
  }
});

test("emoji props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "emoji", name: "check", value: "✅", raw: ":check:" });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false);
  }
});

test("footnote props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "footnote", footnoteKind: "reference", id: "n1", raw: "[^n1]" });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false);
  }
});

test("comment props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "comment", text: "note", multiline: false, raw: "%%note%%" });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false);
  }
});

test("callout props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "callout", calloutType: "note", foldState: "open" });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false);
  }
});

test("toggle props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "toggle", foldState: "closed" });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false);
  }
});

test("folded heading props contain no hidden JSON or HTML", async () => {
  const mod = await loadBridge();
  const props = mod.toComponentProps({ kind: "foldedHeading", level: 2, text: "Title", foldState: "open" });

  for (const key of FORBIDDEN_PROPS_KEYS) {
    assert.equal(key in props, false);
  }
});

// ── Blocked/deferred scope covered above in bridge tests ──

// ── NABLA_COMPONENT_RENDERING_CONTRACT ──

test("NABLA_COMPONENT_RENDERING_CONTRACT is a non-empty string", async () => {
  const mod = await loadIndex();

  assert.equal(typeof mod.NABLA_COMPONENT_RENDERING_CONTRACT, "string");
  assert.ok(mod.NABLA_COMPONENT_RENDERING_CONTRACT.length > 0);
});
