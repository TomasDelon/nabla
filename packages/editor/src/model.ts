export const NABLA_EDITOR_SOURCE_OF_TRUTH = "markdown";

export const NABLA_EDITOR_CANONICAL_SAVE_PATH =
  "editor state -> Markdown string -> @nabla/markup parser -> @nabla/markup serializer -> saved Markdown source";

/**
 * Markdown/Nabla Markdown+ source is the only persistent source of truth.
 * Editor state is ephemeral and must always originate from source text.
 */
export interface EditorSource {
  readonly markdown: string;
}

/**
 * Ephemeral editor document state. Runtime implementations are deferred.
 * Hidden JSON, stored HTML, and serialized editor state are forbidden.
 */
export interface EditorState {
  readonly document: unknown;
}

export interface EditorDiagnostic {
  readonly code: string;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly phase: "load" | "save";
}

export interface EditorLoadResult {
  readonly source: EditorSource;
  readonly state: EditorState;
  readonly diagnostics: readonly EditorDiagnostic[];
}

/**
 * Adapters first export a Markdown string from editor state, then the save
 * pipeline reparses and reserializes it before writing the final source.
 */
export interface EditorSaveResult {
  readonly markdown: string;
  readonly diagnostics: readonly EditorDiagnostic[];
}

/**
 * Type-level boundary for future editor runtimes.
 *
 * Canonical save path:
 * editor state -> Markdown string -> @nabla/markup parser ->
 * @nabla/markup serializer -> saved Markdown source
 *
 * Markdown/Nabla Markdown+ remains the only persistent source of truth.
 * Hidden JSON, stored HTML, and serialized editor state are forbidden.
 * Runtime editor behavior is intentionally deferred to later tasks.
 */
export interface EditorAdapter {
  loadSource(source: string): EditorLoadResult;
  saveState(state: EditorState): EditorSaveResult;
}
