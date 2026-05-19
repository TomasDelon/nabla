import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/task-state.js", import.meta.url));
}

test("TASK_STATE_ORDER contains all four states in cycle order", async () => {
  const mod = await load();

  assert.deepEqual(mod.TASK_STATE_ORDER, [
    "unchecked",
    "checked",
    "cancelled",
    "important",
  ]);
});

test("getNextTaskState cycles deterministically", async () => {
  const mod = await load();

  assert.equal(mod.getNextTaskState("unchecked"), "checked");
  assert.equal(mod.getNextTaskState("checked"), "cancelled");
  assert.equal(mod.getNextTaskState("cancelled"), "important");
  assert.equal(mod.getNextTaskState("important"), "unchecked");
});

test("getNextTaskState cycles through full loop", async () => {
  const mod = await load();

  let state = "unchecked";
  for (let i = 0; i < 4; i++) {
    state = mod.getNextTaskState(state);
  }

  assert.equal(state, "unchecked");
});

test("TASK_STATE_MARKERS maps each state to its bracket marker", async () => {
  const mod = await load();

  assert.equal(mod.TASK_STATE_MARKERS.unchecked, " ");
  assert.equal(mod.TASK_STATE_MARKERS.checked, "x");
  assert.equal(mod.TASK_STATE_MARKERS.cancelled, "-");
  assert.equal(mod.TASK_STATE_MARKERS.important, "!");
});

test("TASK_STATE_LABELS maps each state to a human-readable label", async () => {
  const mod = await load();

  assert.equal(mod.TASK_STATE_LABELS.unchecked, "Unchecked");
  assert.equal(mod.TASK_STATE_LABELS.checked, "Checked");
  assert.equal(mod.TASK_STATE_LABELS.cancelled, "Cancelled");
  assert.equal(mod.TASK_STATE_LABELS.important, "Important");
});

test("TaskStateCheckbox is a function", async () => {
  const mod = await load();

  assert.equal(typeof mod.TaskStateCheckbox, "function");
});
