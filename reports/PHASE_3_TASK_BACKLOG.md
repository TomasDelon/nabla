# Phase 3 Task Backlog — `@nabla/editor`

## Ordered Tasks

### P3-001 — Editor Package Skeleton

| Field | Value |
|---|---|
| **Title** | Editor package skeleton |
| **Goal** | Create `packages/editor/` with `package.json`, `tsconfig.json`, minimal `src/index.ts` entry, and verify it builds in the monorepo. Do not add Milkdown or ProseMirror yet. |
| **Allowed files** | `packages/editor/`, `pnpm-workspace.yaml`, `package.json` (root scripts if needed) |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/src/**`, `specs/**`, `reports/PHASE_3_KICKOFF.md`, `reports/PHASE_3_TASK_BACKLOG.md`, `packages/components/`, `packages/app/` |
| **Acceptance criteria** | `pnpm build` includes `packages/editor`; `packages/editor/package.json` declares `@nabla/markup` as dependency; `pnpm typecheck` passes with editor tsconfig included |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm validate:fixtures`, `pnpm check:boundaries` |
| **Hard stops** | Do not add Milkdown/ProseMirror dependencies in this task. Do not modify `reports/PHASE_3_*`. Do not modify Phase 1 or Phase 2 source. |

---

### P3-002 — Editor Document Model Boundary

| Field | Value |
|---|---|
| **Title** | Editor document model boundary |
| **Goal** | Define the TypeScript types/interfaces for the editor adapter boundary: how Nabla source maps to an editor document, how the editor document maps back to source. Create `packages/editor/src/model.ts` with the adapter contract types. No runtime implementation. |
| **Allowed files** | `packages/editor/src/model.ts`, `packages/editor/src/index.ts` (re-export) |
| **Forbidden files** | Same as P3-001 + `packages/editor/src/*` other than `model.ts` and `index.ts` |
| **Acceptance criteria** | `model.ts` defines: `EditorAdapter` interface (or equivalent), `loadSource(source: string) → EditorState`, `saveState(state: EditorState) → string`, and documents the parser+serializer roundtrip |
| **Gates** | `pnpm typecheck`, `pnpm check:boundaries` |
| **Hard stops** | Do not implement Milkdown/ProseMirror integration. Type-only task. |

---

### P3-003 — Editor Source-of-Truth Synchronization Contract

| Field | Value |
|---|---|
| **Title** | Editor source-of-truth synchronization contract |
| **Goal** | Implement the concrete save pipeline: `editor exported Markdown → @nabla/markup parser → @nabla/markup serializer → canonical saved Markdown`. Create `packages/editor/src/save-pipeline.ts` with a `canonicalize(exportedMd: string): { canonicalMd: string; diagnostics: Diagnostic[] }` function. Do NOT compare canonical output to the original source — valid user edits legitimately diverge. Export-loss detection (`NABLA_EDITOR_EXPORT_LOSS`) MUST only trigger under explicit controlled conditions: no-op load/export roundtrip loses constructs, protected/literal regions are dropped or altered, parser diagnostics indicate unsupported editor export constructs, or a specific preservation contract fails. |
| **Allowed files** | `packages/editor/src/save-pipeline.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | Milkdown/ProseMirror integration files; `packages/editor/src/model.ts` read-only |
| **Acceptance criteria** | `canonicalize()` runs exportedMd through parser → serializer. Unit test A: no-op canonicalize of known-good Markdown produces identical output and no `NABLA_EDITOR_EXPORT_LOSS`. Unit test B: canonicalize of Markdown with intentionally mangled protected region produces `NABLA_EDITOR_EXPORT_LOSS` diagnostic. Unit test C: pipeline reports parser diagnostics alongside canonical output. |
| **Gates** | `pnpm typecheck`, `pnpm build`, `pnpm test:editor` (when test runner exists) |
| **Hard stops** | Do not compare canonical output to original source for loss detection. Do not implement editor frontend. Pipeline must work with raw strings. |

---

### P3-004 — Editor Command/Transaction Skeleton

| Field | Value |
|---|---|
| **Title** | Editor command/transaction skeleton |
| **Goal** | Set up a minimal Milkdown editor that can load a Markdown string and export a Markdown string. Install Milkdown/Crepe and ProseMirror dependencies. Create `packages/editor/src/editor.ts` with create/load/export functions. |
| **Allowed files** | `packages/editor/src/editor.ts`, `packages/editor/src/save-pipeline.ts` (if edits needed), `packages/editor/package.json` (add Milkdown deps), `packages/editor/src/index.ts` |
| **Forbidden files** | `packages/editor/src/model.ts` — read-only unless adapter contract changes are explicitly needed (if needed, stop and report). Nabla-specific node views. |
| **Acceptance criteria** | `createEditor()` returns an editor instance; `loadSource(editor, md)` loads Markdown; `getSource(editor)` returns exported Markdown string. Unit test: load → export is lossless for standard Markdown. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test` |
| **Hard stops** | Do not add Nabla node views. Plain Markdown only. |

---

### P3-005 — Editor Selection/Cursor Model

| Field | Value |
|---|---|
| **Title** | Editor selection/cursor model |
| **Goal** | Document and implement how the editor maps Nabla AST positions to ProseMirror document positions and vice versa. Create `packages/editor/src/position.ts` with helper functions. |
| **Allowed files** | `packages/editor/src/position.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | Node views, Milkdown plugins |
| **Acceptance criteria** | Position mapping functions exist and are unit-testable. No runtime selection behavior yet. |
| **Gates** | `pnpm typecheck`, `pnpm build` |
| **Hard stops** | Do not implement cursor movement or selection UI. |

---

### P3-006 — Editor Block Navigation Basics

| Field | Value |
|---|---|
| **Title** | Editor block navigation basics |
| **Goal** | Implement ProseMirror node types for basic Nabla block constructs (paragraph, heading, list, code block) as they pass through Milkdown. Ensure standard Markdown blocks render and export correctly. |
| **Allowed files** | `packages/editor/src/nodes/` (create), `packages/editor/src/editor.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | Nabla-specific node views (callouts, toggles, folded headings, wiki links, tags, etc.) |
| **Acceptance criteria** | Standard Markdown block nodes (paragraph, heading, list, code, blockquote) roundtrip through load → edit → export without loss. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test` |
| **Hard stops** | No Nabla extension rendering yet. |

---

### P3-007 — Task State Node View

| Field | Value |
|---|---|
| **Title** | Task state node view |
| **Goal** | Implement a ProseMirror node view or mark for task state list items. Render as distinct checkbox states (unchecked, checked, cancelled, important) per `07_EDITOR_BEHAVIOR.md`. Toggling a checkbox updates the corresponding source marker (`[ ]`, `[x]`, `[-]`, `[!]`). |
| **Allowed files** | `packages/editor/src/nodes/task-state.ts`, `packages/editor/src/nodes/`, `packages/editor/src/marks/`, `packages/editor/src/editor.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | All other Nabla-specific node views (wiki links, tags, highlights, emoji, footnotes, comments, callouts, toggles, folded headings, transclusions, tooltips) |
| **Acceptance criteria** | Task state list items display as checkboxes; clicking a checkbox cycles the state and updates the serialized source marker; load → toggle → export produces correct updated Markdown. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm validate:fixtures` |
| **Hard stops** | Do not implement any other Nabla node view in this task. |

---

### P3-008 — Wiki Link Node View

| Field | Value |
|---|---|
| **Title** | Wiki link node view |
| **Goal** | Implement a ProseMirror node view or mark for wiki links (`[[Target]]`, `[[Target\|Alias]]`, `[[Target#Heading]]`, `[[Target^block]]`). Render as internal links per `07_EDITOR_BEHAVIOR.md`. Missing targets render with a missing/distinct state. Aliases show alias text. |
| **Allowed files** | `packages/editor/src/nodes/wiki-link.ts`, `packages/editor/src/nodes/`, `packages/editor/src/marks/`, `packages/editor/src/editor.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | Task state node view; tags/highlights; emoji; footnotes/comments; callouts; toggles; folded headings; transclusions; tooltips |
| **Acceptance criteria** | Wiki links render as clickable internal links; missing-target wiki links show a distinct visual state; aliases display alias text instead of target; roundtrip preserves link syntax. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm validate:fixtures` |
| **Hard stops** | Do not implement workspace resolution callback wiring — wiki link integration with workspace index is a separate concern. |

---

### P3-009 — Tags and Highlights Node Views

| Field | Value |
|---|---|
| **Title** | Tags and highlights node views |
| **Goal** | Implement ProseMirror node views or marks for tags (`#tag`, `#nested/tag`) and highlights (`==text==`, `==#ff0 text==`). Tags render as pills per `07_EDITOR_BEHAVIOR.md`. Simple highlights use default style; color highlights use the specified hex color. |
| **Allowed files** | `packages/editor/src/nodes/tag.ts`, `packages/editor/src/nodes/highlight.ts`, `packages/editor/src/nodes/`, `packages/editor/src/marks/`, `packages/editor/src/editor.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | Task state; wiki links; emoji; footnotes/comments; callouts; toggles; folded headings; transclusions; tooltips |
| **Acceptance criteria** | Tags render as styled pills; highlights render with appropriate color styling; roundtrip preserves tag and highlight syntax. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm validate:fixtures` |
| **Hard stops** | Do not implement color picker or tag suggestion UI. Plain rendering only. |

---

### P3-010 — Emoji Shortcode Node View

| Field | Value |
|---|---|
| **Title** | Emoji shortcode node view |
| **Goal** | Implement a ProseMirror node view or mark for emoji shortcodes (`:check:`). Known shortcodes render as the corresponding emoji per `07_EDITOR_BEHAVIOR.md`. Unknown shortcodes remain as source text. |
| **Allowed files** | `packages/editor/src/nodes/emoji.ts`, `packages/editor/src/nodes/`, `packages/editor/src/marks/`, `packages/editor/src/editor.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | Task state; wiki links; tags/highlights; footnotes/comments; callouts; toggles; folded headings; transclusions; tooltips |
| **Acceptance criteria** | Known `:code:` patterns render as emoji glyphs; unknown codes display as literal source text; roundtrip preserves shortcode syntax. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm validate:fixtures` |
| **Hard stops** | Do not implement emoji picker UI. |

---

### P3-011 — Footnotes and Comments Node Views

| Field | Value |
|---|---|
| **Title** | Footnotes and comments node views |
| **Goal** | Implement ProseMirror node views or marks for footnotes (`[^id]` references and definitions) and comments (`%%text%%`). Footnote references render as markers; definitions render at source position per `07_EDITOR_BEHAVIOR.md`. Private comments are hidden in reading mode and muted in edit mode. |
| **Allowed files** | `packages/editor/src/nodes/footnote.ts`, `packages/editor/src/nodes/comment.ts`, `packages/editor/src/nodes/`, `packages/editor/src/marks/`, `packages/editor/src/editor.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | Task state; wiki links; tags/highlights; emoji; callouts; toggles; folded headings; transclusions; tooltips |
| **Acceptance criteria** | Footnote references display as clickable markers; footnote definitions render at their source position; private comments are visually muted or hidden depending on mode; roundtrip preserves footnote and comment syntax. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm validate:fixtures` |
| **Hard stops** | Do not implement footnote panel (deferred to future UI). Comments are rendered inline only. |

---

### P3-012 — Fold State Commands

| Field | Value |
|---|---|
| **Title** | Fold state commands |
| **Goal** | Implement editor commands that toggle fold states on callouts (`[!type]` fold marker), toggles (`<details>` open/close), and folded headings (`#>`/`#v` markers). Each command updates the corresponding source marker on execution. No custom node views for these constructs — source-marker manipulation only. |
| **Allowed files** | `packages/editor/src/commands/fold.ts`, `packages/editor/src/commands/`, `packages/editor/src/editor.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | `packages/editor/src/nodes/callout.ts`, `packages/editor/src/nodes/toggle.ts`, `packages/editor/src/nodes/folded-heading.ts` |
| **Acceptance criteria** | `toggleCalloutFold()`, `toggleToggleFold()`, `toggleFoldedHeadingFold()` commands exist and update source markers. Unit test: load Markdown with foldable constructs → toggle fold → export produces Markdown with updated fold markers. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test` |
| **Hard stops** | Do not implement visual rendering of callouts, toggles, or folded headings in this task. Marker manipulation only. |

---

### P3-013 — Editor Validation/API Consistency

| Field | Value |
|---|---|
| **Title** | Editor validation and API consistency |
| **Goal** | Audit the public API surface of `@nabla/editor`. Ensure exports are consistent, documented, and match the adapter contract from `02_ARCHITECTURE.md`. Add a public API test that verifies `NABLA_EDITOR_EXPORT_LOSS` is emitted under explicit controlled conditions (protected region loss, no-op roundtrip failure). |
| **Allowed files** | `packages/editor/src/**`, `packages/editor/tests/**` |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/src/**` |
| **Acceptance criteria** | Public API is clean and minimal; export-loss diagnostic test triggers only under controlled conditions (not on canonical-vs-original divergence); all existing Phase 1/Phase 2 tests still pass. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm check:boundaries` |
| **Hard stops** | Do not add new features beyond what is already implemented by prior tasks. Validation and cleanup only. |

---

### P3-014 — Editor Fixture/Regression Plan

| Field | Value |
|---|---|
| **Title** | Editor fixture/regression plan |
| **Goal** | Create editor-level regression fixtures and tests covering all features implemented in P3-007 through P3-012. Each fixture loads a `.md` input, performs an editor operation (e.g., toggle a task state, toggle a fold), exports, and verifies the saved source matches expected output. Do NOT require tests for features not yet implemented (e.g., callout/toggle visual rendering, transclusion embedding, tooltip rendering). |
| **Allowed files** | `packages/editor/tests/`, `packages/editor/fixtures/` |
| **Forbidden files** | `packages/editor/src/**` (read-only unless fixing a regression bug in the current task), `specs/**` |
| **Acceptance criteria** | Editor fixture tests pass covering: task state toggle roundtrip, wiki link rendering, tag/highlight rendering, emoji shortcode rendering, footnote/comment rendering, fold state command roundtrip, protected region preservation, and export-loss detection under controlled conditions. |
| **Gates** | `pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm validate:fixtures` |
| **Hard stops** | Do not modify spec fixtures. Do not modify parser/serializer. Do not add fixture tests for deferred features (callout visual, toggle visual, folded-heading visual, transclusion, tooltip). |

---

### P3-015 — Phase 3 Validation Report

| Field | Value |
|---|---|
| **Title** | Phase 3 validation report |
| **Goal** | Write `reports/PHASE_3_VALIDATION.md` documenting the completion status of all Phase 3 tasks, quality gate results, deferred scope, and a phase verdict. |
| **Allowed files** | `reports/PHASE_3_VALIDATION.md`, `reports/IMPLEMENTATION_PROGRESS.md` |
| **Forbidden files** | All source files; all spec files |
| **Acceptance criteria** | Report exists, all gates pass, deferred scope is documented, verdict is stated. |
| **Gates** | Full gate suite (`pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm validate:fixtures`, `pnpm validate:spec-version`, `pnpm check:boundaries`, `pnpm lint`, `git status --short`) |
| **Hard stops** | Do not modify any source or spec files. Documentation only. |

---

## Blocked/Deferred Tasks

The following areas are identified as blocked or deferred from Phase 3 scope:

| Area | Reason | Would-be task |
|---|---|---|
| Callout visual rendering | Depends on P3-012 fold state commands; visual node view is separate | Post-P3-012 or Phase 4 |
| Toggle visual rendering | Depends on P3-012 fold state commands; visual node view is separate | Post-P3-012 or Phase 4 |
| Folded heading visual rendering | Depends on P3-012 fold state commands; visual node view is separate | Post-P3-012 or Phase 4 |
| Transclusion embedded rendering | Transclusion resolver is a workspace feature; editor visual embedding requires stable block rendering | Post-P3-014 |
| Tooltip rendering | Tooltip extension not implemented in Phase 1; blocked until `packages/markup/src/extensions/tooltips.ts` exists | Deferred |
| `@nabla/components` node views | Phase 4; node views that belong in components must be implemented inline in editor until Phase 4 starts | Deferred to Phase 4 |
| Block ID copy-reference action | Requires clipboard API; minimum viable in Phase 3 is anchor rendering with manual copy | Low priority |

## Non-Negotiable Rules

1. The editor is an adapter. It is not the source of truth.
2. Saved document state must pass through: `editor export → @nabla/markup parser → @nabla/markup serializer → Markdown source`.
3. No hidden JSON, no stored HTML, no editor state serialization.
4. No parser/serializer modifications unless explicitly scoped.
5. No Phase 4 (`@nabla/components`) or Phase 5 (`@nabla/app`) work in Phase 3.
6. If behavior is missing or contradictory, stop and write a missing-spec report.
7. Each task must produce an implementation commit and a separate audit-bundle commit.
8. Export-loss detection (`NABLA_EDITOR_EXPORT_LOSS`) must not compare canonical output to original source — valid edits diverge legitimately. Detection only under explicit controlled conditions: no-op roundtrip failure, protected region loss, parser diagnostics indicating unsupported constructs, or preservation contract failure.
