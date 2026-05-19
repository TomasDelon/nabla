import test from "node:test";
import assert from "node:assert/strict";

async function loadEditor() {
  return import(new URL("../dist/editor.js", import.meta.url));
}

async function loadTaskState() {
  return import(new URL("../dist/nodes/task-state.js", import.meta.url));
}

test("detects unchecked task state", async () => {
  const mod = await loadTaskState();

  assert.deepEqual(mod.getTaskStatesFromMarkdown("- [ ] one\n"), [
    { index: 0, line: 0, state: "unchecked", text: "one" },
  ]);
});

test("detects checked task state", async () => {
  const mod = await loadTaskState();

  assert.deepEqual(mod.getTaskStatesFromMarkdown("- [x] one\n"), [
    { index: 0, line: 0, state: "checked", text: "one" },
  ]);
});

test("detects cancelled task state", async () => {
  const mod = await loadTaskState();

  assert.deepEqual(mod.getTaskStatesFromMarkdown("- [-] one\n"), [
    { index: 0, line: 0, state: "cancelled", text: "one" },
  ]);
});

test("detects important task state", async () => {
  const mod = await loadTaskState();

  assert.deepEqual(mod.getTaskStatesFromMarkdown("- [!] one\n"), [
    { index: 0, line: 0, state: "important", text: "one" },
  ]);
});

test("toggling cycles task states deterministically", async () => {
  const mod = await loadTaskState();

  const checked = mod.toggleTaskStateInMarkdown("- [ ] one\n", 0);
  const cancelled = mod.toggleTaskStateInMarkdown(checked, 0);
  const important = mod.toggleTaskStateInMarkdown(cancelled, 0);
  const unchecked = mod.toggleTaskStateInMarkdown(important, 0);

  assert.equal(checked, "- [x] one\n");
  assert.equal(cancelled, "- [-] one\n");
  assert.equal(important, "- [!] one\n");
  assert.equal(unchecked, "- [ ] one\n");
});

test("load toggle export produces correct markdown", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();

  mod.loadSource(editor, "- [ ] one\n");
  mod.toggleTaskState(editor, 0);

  assert.equal(mod.getSource(editor), "- [x] one");
});

test("non-task list items are ignored", async () => {
  const mod = await loadTaskState();

  assert.deepEqual(mod.getTaskStatesFromMarkdown("- one\n* two\n"), []);
});

test("no other Nabla node views are registered", async () => {
  const mod = await loadEditor();
  const editor = mod.createEditor();

  assert.deepEqual(Object.keys(editor.nodeViews).sort(), ["taskState", "wikiLink"]);
  assert.equal(editor.nodeViews.taskState, "node-safe-adapter");
  assert.equal(editor.nodeViews.wikiLink, "node-safe-adapter");
});
