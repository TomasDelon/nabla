import test from "node:test";
import assert from "node:assert/strict";

import { loadTsModule } from "../../workspace/tests/helpers/load-ts-module.mjs";

const savePipelineUrl = new URL("../src/save-pipeline.ts", import.meta.url);

async function load() {
  return loadTsModule(savePipelineUrl);
}

test("known-good Markdown canonicalizes without export-loss diagnostics", async () => {
  const mod = await load();
  const input = "# Title\n\nParagraph text.\n";

  const result = mod.canonicalize(input);

  assert.equal(result.canonicalMd, "# Title\nParagraph text.\n");
  assert.equal(
    result.diagnostics.some(
      (diagnostic) => diagnostic.code === mod.NABLA_EDITOR_EXPORT_LOSS,
    ),
    false,
  );
});

test("parser diagnostics are forwarded as editor save diagnostics", async () => {
  const mod = await load();
  const result = mod.canonicalize("Before ![[note]] after\n");

  assert.equal(
    result.diagnostics.some(
      (diagnostic) =>
        diagnostic.code === "NABLA_TRANSCLUSION_INLINE_UNSUPPORTED" &&
        diagnostic.phase === "save",
    ),
    true,
  );
});

test("explicit preservation contract failures emit export-loss diagnostics", async () => {
  const mod = await load();
  const result = mod.canonicalize("Paragraph text.\n", {
    preservation: {
      message: "Preservation contract failed.",
      verify: () => false,
    },
  });

  assert.equal(
    result.diagnostics.some(
      (diagnostic) =>
        diagnostic.code === mod.NABLA_EDITOR_EXPORT_LOSS &&
        diagnostic.message === "Preservation contract failed.",
    ),
    true,
  );
});

test("valid edit divergence is not treated as export loss", async () => {
  const mod = await load();
  const first = mod.canonicalize("Alpha\n");
  const second = mod.canonicalize("Beta\n");

  assert.equal(
    first.diagnostics.some(
      (diagnostic) => diagnostic.code === mod.NABLA_EDITOR_EXPORT_LOSS,
    ),
    false,
  );
  assert.equal(
    second.diagnostics.some(
      (diagnostic) => diagnostic.code === mod.NABLA_EDITOR_EXPORT_LOSS,
    ),
    false,
  );
});
