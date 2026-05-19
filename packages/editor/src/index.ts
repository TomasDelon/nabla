export const NABLA_EDITOR_PACKAGE = "@nabla/editor";

export {
  createEditor,
  getDocumentBlockSummary,
  getSource,
  getTaskStates,
  insertMarkdownBlock,
  loadSource,
  replaceSource,
  setTaskState,
  toggleTaskState,
} from "./editor.js";
export {
  cycleTaskState,
  getTaskStateNodeViews,
  getTaskStatesFromMarkdown,
  NABLA_TASK_STATE_NODE_VIEW,
  setTaskStateInMarkdown,
  toggleTaskStateInMarkdown,
} from "./nodes/task-state.js";
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
export type { EditorTaskState } from "./nodes/task-state.js";
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
