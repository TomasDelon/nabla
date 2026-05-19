import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.resolve(__dirname, "../fixtures");

const FIXTURE_CASES = [
  "task-state-toggle",
  "wiki-link-preserve",
  "tag-highlight-preserve",
  "emoji-preserve",
  "footnote-comment-preserve",
  "fold-callout-toggle",
  "fold-toggle-toggle",
  "fold-heading-toggle",
  "protected-region-preserve",
  "export-loss-controlled",
];

function readFixture(caseName) {
  const dir = path.join(fixturesDir, caseName);
  const input = fs.readFileSync(path.join(dir, "input.md"), "utf8");
  const expected = fs.readFileSync(path.join(dir, "expected.md"), "utf8");
  const operation = JSON.parse(
    fs.readFileSync(path.join(dir, "operation.json"), "utf8"),
  );
  return { input, expected, operation };
}

async function loadEditor() {
  return import(new URL("../dist/index.js", import.meta.url));
}

function runEditorOperation(mod, { input, operation }) {
  const editor = mod.createEditor();
  mod.loadSource(editor, input);

  if (operation.type === "none") {
  } else if (operation.type === "toggleTaskState") {
    mod.toggleTaskState(editor, operation.line);
  } else if (operation.type === "toggleCalloutFold") {
    mod.toggleCalloutFold(editor, operation.line);
  } else if (operation.type === "toggleToggleFold") {
    mod.toggleToggleFold(editor, operation.line);
  } else if (operation.type === "toggleFoldedHeadingFold") {
    mod.toggleFoldedHeadingFold(editor, operation.line);
  } else {
    throw new Error(`Unknown editor operation type: ${operation.type}`);
  }

  return mod.getSource(editor);
}

for (const caseName of FIXTURE_CASES) {
  test(`fixture: ${caseName}`, async () => {
    const { input, expected, operation } = readFixture(caseName);
    const mod = await loadEditor();

    if (operation.type === "canonicalizeWithFailedPreservation") {
      const result = mod.canonicalize(input, {
        preservation: {
          message: "Fixture preservation contract failed.",
          verify: () => false,
        },
      });
      assert.equal(
        result.canonicalMd.trimEnd(),
        expected.trimEnd(),
        `${caseName}: canonical output mismatch`,
      );
      assert.equal(
        result.diagnostics.some(
          (d) => d.code === mod.NABLA_EDITOR_EXPORT_LOSS,
        ),
        true,
        `${caseName}: expected NABLA_EDITOR_EXPORT_LOSS diagnostic`,
      );
    } else {
      const output = runEditorOperation(mod, { input, operation });
      assert.equal(
        output.trimEnd(),
        expected.trimEnd(),
        `${caseName}: editor output mismatch`,
      );
    }
  });
}
