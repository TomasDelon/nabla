export const NABLA_EDITOR_PACKAGE = "@nabla/editor";

export {
  NABLA_EDITOR_CANONICAL_SAVE_PATH,
  NABLA_EDITOR_SOURCE_OF_TRUTH,
} from "./model.js";

export { NABLA_EDITOR_EXPORT_LOSS, canonicalize } from "./save-pipeline.js";

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
