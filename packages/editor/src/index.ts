export const NABLA_EDITOR_PACKAGE = "@nabla/editor";

export {
  getComments,
  createEditor,
  getDocumentBlockSummary,
  getEmojiShortcodes,
  getFootnotes,
  getHighlights,
  getSource,
  getTags,
  getTaskStates,
  getWikiLinks,
  insertMarkdownBlock,
  loadSource,
  replaceSource,
  setTaskState,
  setWikiLinkAlias,
  toggleTaskState,
} from "./editor.js";
export {
  toggleCalloutFold,
  toggleCalloutFoldInMarkdown,
  toggleFoldedHeadingFold,
  toggleFoldedHeadingFoldInMarkdown,
  toggleToggleFold,
  toggleToggleFoldInMarkdown,
} from "./commands/fold.js";
export {
  getCommentNodeViews,
  getCommentsFromMarkdown,
  NABLA_COMMENT_NODE_VIEW,
} from "./nodes/comment.js";
export {
  getEmojiNodeViews,
  getEmojiShortcodesFromMarkdown,
  NABLA_EMOJI_NODE_VIEW,
} from "./nodes/emoji.js";
export {
  getFootnoteNodeViews,
  getFootnotesFromMarkdown,
  NABLA_FOOTNOTE_NODE_VIEW,
} from "./nodes/footnote.js";
export {
  getHighlightNodeViews,
  getHighlightsFromMarkdown,
  NABLA_HIGHLIGHT_NODE_VIEW,
} from "./nodes/highlight.js";
export {
  getTagNodeViews,
  getTagsFromMarkdown,
  NABLA_TAG_NODE_VIEW,
} from "./nodes/tag.js";
export {
  cycleTaskState,
  getTaskStateNodeViews,
  getTaskStatesFromMarkdown,
  NABLA_TASK_STATE_NODE_VIEW,
  setTaskStateInMarkdown,
  toggleTaskStateInMarkdown,
} from "./nodes/task-state.js";
export {
  getWikiLinkNodeViews,
  getWikiLinksFromMarkdown,
  NABLA_WIKI_LINK_NODE_VIEW,
  setWikiLinkAliasInMarkdown,
} from "./nodes/wiki-link.js";
export {
  clampOffset,
  createEditorPosition,
  createSourcePosition,
  editorToSourcePosition,
  isValidOffset,
  sourceToEditorPosition,
} from "./position.js";
export {
  NABLA_EDITOR_CANONICAL_SAVE_PATH,
  NABLA_EDITOR_SOURCE_OF_TRUTH,
} from "./model.js";

export { NABLA_EDITOR_EXPORT_LOSS, canonicalize } from "./save-pipeline.js";

export type { Editor, EditorBlockSummary } from "./editor.js";
export type { EditorComment } from "./nodes/comment.js";
export type { EditorEmojiShortcode } from "./nodes/emoji.js";
export type { EditorFootnote } from "./nodes/footnote.js";
export type { EditorHighlight } from "./nodes/highlight.js";
export type { EditorTag } from "./nodes/tag.js";
export type { EditorTaskState } from "./nodes/task-state.js";
export type { EditorWikiLink } from "./nodes/wiki-link.js";
export type { EditorPosition, SourcePosition } from "./position.js";
export type {
  EditorAdapter,
  EditorDiagnostic,
  EditorLoadResult,
  EditorSaveResult,
  EditorSource,
  EditorState,
} from "./model.js";

export type {
  CanonicalizeOptions,
  CanonicalizeResult,
} from "./save-pipeline.js";
