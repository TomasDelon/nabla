import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/bridge.js", import.meta.url));
}

test("toComponentKind returns taskState for task state metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "taskState", state: "checked", text: "task" });

  assert.equal(result, "taskState");
});

test("toComponentKind returns wikiLink for wiki link metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "wikiLink", target: "Page", raw: "[[Page]]", unresolved: false });

  assert.equal(result, "wikiLink");
});

test("toComponentKind returns tag for tag metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "tag", value: "mytag", segments: ["mytag"], raw: "#mytag" });

  assert.equal(result, "tag");
});

test("toComponentKind returns highlight for highlight metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "highlight", text: "hi", raw: "==hi==" });

  assert.equal(result, "highlight");
});

test("toComponentKind returns emoji for emoji metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "emoji", name: "check", value: "✅", raw: ":check:" });

  assert.equal(result, "emoji");
});

test("toComponentKind returns footnote for footnote metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "footnote", footnoteKind: "reference", id: "n1", raw: "[^n1]" });

  assert.equal(result, "footnote");
});

test("toComponentKind returns comment for comment metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "comment", text: "note", multiline: false, raw: "%%note%%" });

  assert.equal(result, "comment");
});

test("toComponentKind returns callout for callout metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "callout", calloutType: "note", foldState: "open" });

  assert.equal(result, "callout");
});

test("toComponentKind returns toggle for toggle metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "toggle", foldState: "closed" });

  assert.equal(result, "toggle");
});

test("toComponentKind returns foldedHeading for folded heading metadata", async () => {
  const mod = await load();

  const result = mod.toComponentKind({ kind: "foldedHeading", level: 2, text: "Title", foldState: "open" });

  assert.equal(result, "foldedHeading");
});

test("toComponentProps maps task state metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({ kind: "taskState", state: "unchecked", text: "buy milk" });

  assert.equal(props.kind, "taskState");
  assert.equal(props.state, "unchecked");
  assert.equal(props.text, "buy milk");
  assert.equal(typeof props.onChange, "function");
});

test("toComponentProps maps wiki link metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({
    kind: "wikiLink", target: "Page", alias: "Alias", heading: "Section", unresolved: true, raw: "[[Page#Section|Alias]]",
  });

  assert.equal(props.kind, "wikiLink");
  assert.equal(props.target, "Page");
  assert.equal(props.alias, "Alias");
  assert.equal(props.heading, "Section");
  assert.equal(props.unresolved, true);
  assert.equal(props.raw, "[[Page#Section|Alias]]");
});

test("toComponentProps maps tag metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({ kind: "tag", value: "nested/tag", segments: ["nested", "tag"], raw: "#nested/tag" });

  assert.equal(props.kind, "tag");
  assert.equal(props.value, "nested/tag");
  assert.deepEqual(props.segments, ["nested", "tag"]);
  assert.equal(props.raw, "#nested/tag");
});

test("toComponentProps maps highlight metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({ kind: "highlight", text: "yellow note", color: "#ff0", raw: "=={#ff0}yellow note==" });

  assert.equal(props.kind, "highlight");
  assert.equal(props.text, "yellow note");
  assert.equal(props.color, "#ff0");
});

test("toComponentProps maps emoji metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({ kind: "emoji", name: "check", value: "✅", raw: ":check:" });

  assert.equal(props.kind, "emoji");
  assert.equal(props.name, "check");
  assert.equal(props.value, "✅");
});

test("toComponentProps maps footnote metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({ kind: "footnote", footnoteKind: "definition", id: "def1", text: "Note text.", raw: "[^def1]: Note text." });

  assert.equal(props.kind, "footnote");
  assert.equal(props.footnoteKind, "definition");
  assert.equal(props.id, "def1");
  assert.equal(props.text, "Note text.");
});

test("toComponentProps maps comment metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({ kind: "comment", text: "private", multiline: false, raw: "%%private%%" });

  assert.equal(props.kind, "comment");
  assert.equal(props.text, "private");
  assert.equal(props.multiline, false);
});

test("toComponentProps maps callout metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({ kind: "callout", calloutType: "warning", foldState: "closed" });

  assert.equal(props.kind, "callout");
  assert.equal(props.calloutType, "warning");
  assert.equal(props.foldState, "closed");
  assert.equal(typeof props.onToggleFold, "function");
});

test("toComponentProps maps toggle metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({ kind: "toggle", foldState: "open" });

  assert.equal(props.kind, "toggle");
  assert.equal(props.foldState, "open");
  assert.equal(typeof props.onToggleFold, "function");
});

test("toComponentProps maps folded heading metadata to props", async () => {
  const mod = await load();

  const props = mod.toComponentProps({ kind: "foldedHeading", level: 3, text: "Sub", foldState: "closed" });

  assert.equal(props.kind, "foldedHeading");
  assert.equal(props.level, 3);
  assert.equal(props.foldState, "closed");
  assert.equal(typeof props.onToggleFold, "function");
});

test("createComponentDescriptor returns kind and props", async () => {
  const mod = await load();

  const descriptor = mod.createComponentDescriptor({ kind: "tag", value: "mytag", segments: ["mytag"], raw: "#mytag" });

  assert.equal(descriptor.kind, "tag");
  assert.equal(descriptor.props.kind, "tag");
  assert.equal(descriptor.props.value, "mytag");
});

test("isBridgeKindSupported returns true for all implemented kinds", async () => {
  const mod = await load();

  assert.equal(mod.isBridgeKindSupported("taskState"), true);
  assert.equal(mod.isBridgeKindSupported("wikiLink"), true);
  assert.equal(mod.isBridgeKindSupported("tag"), true);
  assert.equal(mod.isBridgeKindSupported("highlight"), true);
  assert.equal(mod.isBridgeKindSupported("emoji"), true);
  assert.equal(mod.isBridgeKindSupported("footnote"), true);
  assert.equal(mod.isBridgeKindSupported("comment"), true);
  assert.equal(mod.isBridgeKindSupported("callout"), true);
  assert.equal(mod.isBridgeKindSupported("toggle"), true);
  assert.equal(mod.isBridgeKindSupported("foldedHeading"), true);
});

test("isBridgeKindSupported returns false for deferred transclusion", async () => {
  const mod = await load();

  assert.equal(mod.isBridgeKindSupported("transclusion"), false);
});

test("isBridgeKindSupported returns false for blocked tooltip", async () => {
  const mod = await load();

  assert.equal(mod.isBridgeKindSupported("tooltip"), false);
});

test("BRIDGE_DEFERRED_KINDS includes transclusion", async () => {
  const mod = await load();

  assert.deepEqual([...mod.BRIDGE_DEFERRED_KINDS].sort(), ["transclusion"]);
});

test("BRIDGE_BLOCKED_KINDS includes tooltip", async () => {
  const mod = await load();

  assert.deepEqual([...mod.BRIDGE_BLOCKED_KINDS].sort(), ["tooltip"]);
});
