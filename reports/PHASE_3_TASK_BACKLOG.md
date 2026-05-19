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
| **Goal** | Implement the concrete save pipeline: `editor export → @nabla/markup parser → @nabla/markup serializer → saved source`. Create `packages/editor/src/save-pipeline.ts` that takes a Markdown string from the editor export, runs it through the Nabla parser and serializer, and returns the canonical source. Include the export-loss diagnostic check. |
| **Allowed files** | `packages/editor/src/save-pipeline.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | Milkdown/ProseMirror integration files |
| **Acceptance criteria** | `savePipeline(exportedMd, originalSource)` runs parser+serializer, compares output to original source, emits `NABLA_EDITOR_EXPORT_LOSS` if they diverge. Unit tests verify loss detection. |
| **Gates** | `pnpm typecheck`, `pnpm build`, `pnpm test:editor` (when test runner exists) |
| **Hard stops** | Do not implement the editor frontend. Pipeline must work with raw strings. |

---

### P3-004 — Editor Command/Transaction Skeleton

| Field | Value |
|---|---|
| **Title** | Editor command/transaction skeleton |
| **Goal** | Set up a minimal Milkdown editor that can load a Markdown string and export a Markdown string. Install Milkdown/Crepe and ProseMirror dependencies. Create `packages/editor/src/editor.ts` with create/load/export functions. |
| **Allowed files** | `packages/editor/src/editor.ts`, `packages/editor/src/save-pipeline.ts` (if edits needed), `packages/editor/package.json` (add Milkdown deps), `packages/editor/src/index.ts` |
| **Forbidden files** | `packages/editor/src/model.ts` (binary), Nabla-specific node views |
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

### P3-007 — Editor Markdown Render/Edit Mode Boundary

| Field | Value |
|---|---|
| **Title** | Editor Markdown render/edit mode boundary |
| **Goal** | Implement Nabla-specific node views and marks for: task states, wiki links, tags, highlights, emoji shortcodes, footnotes, comments. Each renders according to `07_EDITOR_BEHAVIOR.md` and updates source markers on edit. |
| **Allowed files** | `packages/editor/src/nodes/`, `packages/editor/src/marks/`, `packages/editor/src/editor.ts`, `packages/editor/src/index.ts` |
| **Forbidden files** | `packages/editor/src/nodes/callout.ts`, `packages/editor/src/nodes/toggle.ts`, `packages/editor/src/nodes/folded-heading.ts`, `packages/editor/src/nodes/transclusion.ts`, `packages/editor/src/nodes/tooltip.ts` |
| **Acceptance criteria** | Wiki links render as internal links; missing links show missing state; tags render as pills; task states render as checkboxes that toggle source markers; highlights render with color; emoji shortcodes render as emoji; footnotes render as markers. Protected regions remain literal. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm validate:fixtures` |
| **Hard stops** | Do NOT implement callout/toggle/folded-heading/transclusion/tooltip rendering in this task. |

---

### P3-008 — Editor Validation/API Consistency

| Field | Value |
|---|---|
| **Title** | Editor validation and API consistency |
| **Goal** | Audit the public API surface of `@nabla/editor`. Ensure exports are consistent, documented, and match the adapter contract from `02_ARCHITECTURE.md`. Add a public API test that verifies `NABLA_EDITOR_EXPORT_LOSS` is emitted when the editor export loses a construct. |
| **Allowed files** | `packages/editor/src/**`, `packages/editor/tests/**` |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/src/**` |
| **Acceptance criteria** | Public API is clean and minimal; export-loss diagnostic test passes; all existing Phase 1/Phase 2 tests still pass. |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm check:boundaries` |
| **Hard stops** | Do not add new features. Validation and cleanup only. |

---

### P3-009 — Editor Fixture/Regression Plan

| Field | Value |
|---|---|
| **Title** | Editor fixture/regression plan |
| **Goal** | Create editor-level regression fixtures and tests. Each fixture loads a `.md` input, simulates an edit (e.g., toggle a task state, change a fold state), exports, and verifies the saved source matches expected output. |
| **Allowed files** | `packages/editor/tests/`, `packages/editor/fixtures/` |
| **Forbidden files** | `packages/editor/src/**` (read-only), `specs/**` |
| **Acceptance criteria** | Editor fixture tests pass. At minimum: task toggle roundtrip, fold state roundtrip, protected region preservation, and export-loss detection. |
| **Gates** | `pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm validate:fixtures` |
| **Hard stops** | Do not modify spec fixtures. Do not modify parser/serializer. |

---

### P3-010 — Phase 3 Validation Report

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
| Callout/toggle/folded-heading visual rendering | Depends on P3-007 inline rendering and fold-state commands being stable first | _Part of P3-007 or separate follow-up_ |
| Transclusion embedded rendering | Transclusion resolver is a workspace feature; editor visual embedding requires stable block rendering | _Post-P3-009_ |
| Tooltip rendering | Tooltip extension not implemented in Phase 1; blocked until `packages/markup/src/extensions/tooltips.ts` exists | _Deferred_ |
| `@nabla/components` node views | Phase 4; node views that belong in components must be implemented inline in editor until Phase 4 starts | _Deferred to Phase 4_ |
| Block ID copy-reference action | Requires clipboard API; minimum viable in Phase 3 is anchor rendering with manual copy | _Low priority_ |

## Non-Negotiable Rules

1. The editor is an adapter. It is not the source of truth.
2. Saved document state must pass through: `editor export → @nabla/markup parser → @nabla/markup serializer → Markdown source`.
3. No hidden JSON, no stored HTML, no editor state serialization.
4. No parser/serializer modifications unless explicitly scoped.
5. No Phase 4 (`@nabla/components`) or Phase 5 (`@nabla/app`) work in Phase 3.
6. If behavior is missing or contradictory, stop and write a missing-spec report.
7. Each task must produce an implementation commit and a separate audit-bundle commit.
