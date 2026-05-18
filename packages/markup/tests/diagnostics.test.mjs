import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("markup package exports diagnostic constants", async () => {
  const source = await readFile(
    new URL("../src/diagnostics.ts", import.meta.url),
    "utf8"
  );

  for (const code of [
    "NABLA_FRONTMATTER_INVALID",
    "NABLA_LINK_MISSING_TARGET",
    "NABLA_LINK_AMBIGUOUS_TARGET",
    "NABLA_WIKI_LINK_INVALID_TARGET",
    "NABLA_HEADING_MISSING_TARGET",
    "NABLA_BLOCK_MISSING_TARGET",
    "NABLA_BLOCK_ID_INVALID",
    "NABLA_BLOCK_ID_INVALID_POSITION",
    "NABLA_BLOCK_ID_DUPLICATE",
    "NABLA_TOOLTIP_EMPTY_TARGET",
    "NABLA_TOOLTIP_UNCLOSED",
    "NABLA_HIGHLIGHT_UNCLOSED",
    "NABLA_HIGHLIGHT_INVALID_COLOR",
    "NABLA_CALLOUT_INVALID_TYPE",
    "NABLA_TOGGLE_MISSING_TITLE",
    "NABLA_TRANSCLUSION_INLINE_UNSUPPORTED",
    "NABLA_TRANSCLUSION_MISSING_TARGET",
    "NABLA_TRANSCLUSION_CYCLE",
    "NABLA_TRANSCLUSION_DEPTH_LIMIT",
    "NABLA_EMOJI_UNKNOWN",
    "NABLA_FOOTNOTE_MISSING_DEFINITION",
    "NABLA_FOOTNOTE_UNUSED_DEFINITION",
    "NABLA_EDITOR_EXPORT_LOSS"
  ]) {
    assert.match(source, new RegExp(code));
  }

  assert.match(source, /export const DIAGNOSTIC_CODES = \{/);
  assert.match(source, /export const DIAGNOSTIC_CATALOG = \[/);
});
