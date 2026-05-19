import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/index.js", import.meta.url));
}

test("all intended runtime exports exist", async () => {
  const mod = await load();

  assert.equal(mod.NABLA_EDITOR_PACKAGE, "@nabla/editor");

  assert.equal(typeof mod.createEditor, "function");
  assert.equal(typeof mod.loadSource, "function");
  assert.equal(typeof mod.getSource, "function");
  assert.equal(typeof mod.replaceSource, "function");
  assert.equal(typeof mod.insertMarkdownBlock, "function");
  assert.equal(typeof mod.getDocumentBlockSummary, "function");
  assert.equal(typeof mod.getComments, "function");
  assert.equal(typeof mod.getEmojiShortcodes, "function");
  assert.equal(typeof mod.getFootnotes, "function");
  assert.equal(typeof mod.getHighlights, "function");
  assert.equal(typeof mod.getTags, "function");
  assert.equal(typeof mod.getTaskStates, "function");
  assert.equal(typeof mod.getWikiLinks, "function");
  assert.equal(typeof mod.setTaskState, "function");
  assert.equal(typeof mod.toggleTaskState, "function");
  assert.equal(typeof mod.setWikiLinkAlias, "function");

  assert.equal(typeof mod.toggleCalloutFold, "function");
  assert.equal(typeof mod.toggleCalloutFoldInMarkdown, "function");
  assert.equal(typeof mod.toggleToggleFold, "function");
  assert.equal(typeof mod.toggleToggleFoldInMarkdown, "function");
  assert.equal(typeof mod.toggleFoldedHeadingFold, "function");
  assert.equal(typeof mod.toggleFoldedHeadingFoldInMarkdown, "function");

  assert.equal(mod.NABLA_TASK_STATE_NODE_VIEW, "node-safe-adapter");
  assert.equal(mod.NABLA_WIKI_LINK_NODE_VIEW, "node-safe-adapter");
  assert.equal(mod.NABLA_TAG_NODE_VIEW, "node-safe-adapter");
  assert.equal(mod.NABLA_HIGHLIGHT_NODE_VIEW, "node-safe-adapter");
  assert.equal(mod.NABLA_EMOJI_NODE_VIEW, "node-safe-adapter");
  assert.equal(mod.NABLA_FOOTNOTE_NODE_VIEW, "node-safe-adapter");
  assert.equal(mod.NABLA_COMMENT_NODE_VIEW, "node-safe-adapter");

  assert.equal(typeof mod.getTaskStateNodeViews, "function");
  assert.equal(typeof mod.getWikiLinkNodeViews, "function");
  assert.equal(typeof mod.getTagNodeViews, "function");
  assert.equal(typeof mod.getHighlightNodeViews, "function");
  assert.equal(typeof mod.getEmojiNodeViews, "function");
  assert.equal(typeof mod.getFootnoteNodeViews, "function");
  assert.equal(typeof mod.getCommentNodeViews, "function");

  assert.equal(typeof mod.getTaskStatesFromMarkdown, "function");
  assert.equal(typeof mod.getWikiLinksFromMarkdown, "function");
  assert.equal(typeof mod.getTagsFromMarkdown, "function");
  assert.equal(typeof mod.getHighlightsFromMarkdown, "function");
  assert.equal(typeof mod.getEmojiShortcodesFromMarkdown, "function");
  assert.equal(typeof mod.getFootnotesFromMarkdown, "function");
  assert.equal(typeof mod.getCommentsFromMarkdown, "function");

  assert.equal(typeof mod.setTaskStateInMarkdown, "function");
  assert.equal(typeof mod.toggleTaskStateInMarkdown, "function");
  assert.equal(typeof mod.cycleTaskState, "function");
  assert.equal(typeof mod.setWikiLinkAliasInMarkdown, "function");

  assert.equal(typeof mod.clampOffset, "function");
  assert.equal(typeof mod.createEditorPosition, "function");
  assert.equal(typeof mod.createSourcePosition, "function");
  assert.equal(typeof mod.editorToSourcePosition, "function");
  assert.equal(typeof mod.isValidOffset, "function");
  assert.equal(typeof mod.sourceToEditorPosition, "function");

  assert.equal(mod.NABLA_EDITOR_SOURCE_OF_TRUTH, "markdown");
  assert.equal(typeof mod.NABLA_EDITOR_CANONICAL_SAVE_PATH, "string");

  assert.equal(typeof mod.canonicalize, "function");
  assert.equal(mod.NABLA_EDITOR_EXPORT_LOSS, "NABLA_EDITOR_EXPORT_LOSS");
});

test("no forbidden runtime exports exist", async () => {
  const mod = await load();
  const keys = Object.keys(mod);

  assert.equal(keys.includes("NABLA_CALLOUT_NODE_VIEW"), false);
  assert.equal(keys.includes("getCalloutNodeViews"), false);
  assert.equal(keys.includes("getCalloutsFromMarkdown"), false);

  assert.equal(keys.includes("NABLA_TOGGLE_NODE_VIEW"), false);
  assert.equal(keys.includes("getToggleNodeViews"), false);
  assert.equal(keys.includes("getTogglesFromMarkdown"), false);

  assert.equal(keys.includes("NABLA_FOLDED_HEADING_NODE_VIEW"), false);
  assert.equal(keys.includes("getFoldedHeadingNodeViews"), false);
  assert.equal(keys.includes("getFoldedHeadingsFromMarkdown"), false);

  assert.equal(keys.includes("NABLA_TRANSCLUSION_NODE_VIEW"), false);
  assert.equal(keys.includes("getTransclusionNodeViews"), false);

  assert.equal(keys.includes("NABLA_TOOLTIP_NODE_VIEW"), false);
  assert.equal(keys.includes("getTooltipNodeViews"), false);

  assert.equal(keys.includes("insertBlockId"), false);
  assert.equal(keys.includes("removeBlockId"), false);
  assert.equal(keys.includes("setBlockId"), false);
  assert.equal(keys.includes("getBlockIds"), false);

  assert.equal(keys.includes("renderEditor"), false);
  assert.equal(keys.includes("EditorComponent"), false);
  assert.equal(keys.includes("mountEditor"), false);
});

test("NABLA_EDITOR_EXPORT_LOSS is not emitted for canonical-vs-original divergence", async () => {
  const mod = await load();

  const a = mod.canonicalize("Alpha\n");
  const b = mod.canonicalize("Beta\n");

  assert.equal(
    a.diagnostics.some(d => d.code === mod.NABLA_EDITOR_EXPORT_LOSS),
    false,
    "valid divergent content must not trigger export loss",
  );
  assert.equal(
    b.diagnostics.some(d => d.code === mod.NABLA_EDITOR_EXPORT_LOSS),
    false,
  );
});

test("NABLA_EDITOR_EXPORT_LOSS is emitted under explicit controlled conditions", async () => {
  const mod = await load();

  const result = mod.canonicalize("Paragraph text.\n", {
    preservation: {
      message: "Preservation contract failed.",
      verify: () => false,
    },
  });

  assert.equal(
    result.diagnostics.some(d => d.code === mod.NABLA_EDITOR_EXPORT_LOSS),
    true,
    "explicit preservation contract failure must emit export loss",
  );
});

test("source preservation: task states roundtrip", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.loadSource(editor, "- [ ] a\n- [x] b\n- [-] c\n- [!] d\n");
  assert.equal(mod.getSource(editor), "- [ ] a\n- [x] b\n- [-] c\n- [!] d");
});

test("source preservation: wiki link roundtrip", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.loadSource(editor, "[[Target]] [[Target|Alias]]\n");
  assert.equal(mod.getSource(editor), "[[Target]] [[Target|Alias]]");
});

test("source preservation: tag and highlight roundtrip", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.loadSource(editor, "#tag ==hl== =={#ff0}c==\n");
  assert.equal(mod.getSource(editor), "#tag ==hl== =={#ff0}c==");
});

test("source preservation: emoji shortcode roundtrip", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.loadSource(editor, ":check:\n");
  assert.equal(mod.getSource(editor), ":check:");
});

test("source preservation: footnote and comment roundtrip", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.loadSource(editor, "a[^b]\n\n[^b]: text\n%%c%%\n");
  assert.equal(mod.getSource(editor), "a[^b]\n\n[^b]: text\n%%c%%");
});

test("source preservation: fold markers roundtrip", async () => {
  const mod = await load();
  const editor = mod.createEditor();

  mod.loadSource(editor, "[!note]> callout\n");
  assert.equal(mod.getSource(editor), "[!note]> callout");
});
