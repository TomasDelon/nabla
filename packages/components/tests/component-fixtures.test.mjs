import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, "..", "fixtures");

const OPERATION_MODULES = {
  getNextTaskState: "../dist/task-state.js",
  getWikiLinkDisplay: "../dist/wiki-link.js",
  getTagDisplay: "../dist/tag.js",
  getHighlightStyle: "../dist/highlight.js",
  getEmojiDisplay: "../dist/emoji.js",
  getFootnoteDisplay: "../dist/footnote.js",
  getCommentDisplay: "../dist/comment.js",
  getCalloutDisplay: "../dist/callout.js",
  getToggleDisplay: "../dist/toggle.js",
  getFoldedHeadingDisplay: "../dist/folded-heading.js",
  toComponentKind: "../dist/bridge.js",
  toComponentProps: "../dist/bridge.js",
  createComponentDescriptor: "../dist/bridge.js",
  isBridgeKindSupported: "../dist/bridge.js",
};

function isObject(v) {
  return typeof v === "object" && v !== null;
}

function checkFunctionKeys(result, keys, label) {
  for (const key of keys) {
    assert.equal(typeof result[key], "function", `${label}: ${key} should be a function`);
  }
}

function checkFields(result, expected, label) {
  for (const [key, value] of Object.entries(expected)) {
    const actual = result[key];
    if (isObject(value)) {
      checkFields(actual, value, `${label}.${key}`);
    } else {
      assert.deepEqual(actual, value, `${label}: field "${key}" mismatch`);
    }
  }
}

async function loadFixtures() {
  const entries = await readdir(FIXTURES_DIR, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());
  const results = [];

  for (const dir of dirs) {
    const inputPath = join(FIXTURES_DIR, dir.name, "input.json");
    const expectedPath = join(FIXTURES_DIR, dir.name, "expected.json");

    const inputRaw = await readFile(inputPath, "utf8");
    const expectedRaw = await readFile(expectedPath, "utf8");

    const input = JSON.parse(inputRaw);
    const expected = JSON.parse(expectedRaw);

    results.push({
      name: dir.name,
      operation: input.operation,
      args: input.args ?? [],
      expected,
      functionKeys: input.functionKeys ?? [],
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

test("all component fixtures pass", async () => {
  const fixtures = await loadFixtures();

  assert.ok(fixtures.length > 0, "At least one fixture must exist");

  for (const fixture of fixtures) {
    await test(fixture.name, async () => {
      const modulePath = OPERATION_MODULES[fixture.operation];
      assert.ok(modulePath !== undefined, `Unknown operation: ${fixture.operation}`);

      const mod = await import(new URL(modulePath, import.meta.url));
      const fn = mod[fixture.operation];

      assert.equal(typeof fn, "function", `${fixture.operation} must be a function`);

      const result = fn(...fixture.args);

      checkFunctionKeys(result, fixture.functionKeys, fixture.name);

      if (isObject(fixture.expected)) {
        checkFields(result, fixture.expected, fixture.name);
      } else {
        assert.deepEqual(result, fixture.expected, `${fixture.name}: value mismatch`);
      }
    });
  }
});
