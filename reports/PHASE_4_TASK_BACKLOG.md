# Phase 4 Task Backlog — `@nabla/components`

## Ordered Tasks

### P4-001 — Components Package Skeleton

| Field | Value |
|---|---|
| **Title** | Components package skeleton |
| **Goal** | Create `packages/components/` with `package.json`, `tsconfig.json`, minimal `src/index.ts` entry, and verify it builds in the monorepo. Do not implement any visual components yet. |
| **Allowed files** | `packages/components/`, `pnpm-workspace.yaml`, `root tsconfig.json` or `package.json` if workspace config is needed |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/src/**`, `packages/editor/src/**`, `specs/**`, `reports/PHASE_4_KICKOFF.md`, `reports/PHASE_4_TASK_BACKLOG.md`, `packages/app/` |
| **Acceptance criteria** | `pnpm build` includes `packages/components`; `packages/components/package.json` declares `@nabla/markup` as dependency; `pnpm typecheck` passes with components tsconfig included |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm validate:fixtures`, `pnpm check:boundaries` |
| **Hard stops** | Do not implement React node views in this task. Do not modify Phase 1, 2, or 3 source. |

---

### P4-002 — Component Rendering Contract and Types

| Field | Value |
|---|---|
| **Title** | Component rendering contract and types |
| **Goal** | Define TypeScript interfaces for the rendering contract: how each Nabla Markdown+ node type maps to a component. Create `packages/components/src/types.ts` with component prop types, rendering context, and adapter interface. No runtime rendering. |
| **Allowed files** | `packages/components/src/types.ts`, `packages/components/src/index.ts` |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/src/**`, `packages/editor/src/**` |
| **Acceptance criteria** | `types.ts` defines `NablaComponentProps` (or equivalent), node type enums/constants, and component registry interface that editor can use to resolve node views |
| **Gates** | `pnpm typecheck`, `pnpm check:boundaries` |
| **Hard stops** | No runtime rendering. No React/JSX files. Type-only task. |

---

### P4-003 — Visual Design Tokens and Minimal Styling Boundary

| Field | Value |
|---|---|
| **Title** | Visual design tokens and minimal styling boundary |
| **Goal** | Define a minimal set of CSS custom properties or theme tokens (colors, spacing, font sizes) for consistent component styling. Create `packages/components/src/theme.ts` or `packages/components/src/tokens.css` with default values. |
| **Allowed files** | `packages/components/src/theme.ts`, `packages/components/src/tokens.css`, `packages/components/src/index.ts` |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/src/**`, `packages/editor/src/**`, `specs/**` |
| **Acceptance criteria** | Token definitions exist; default values are reasonable for Nabla Markdown+ visual rendering; no application-specific theming |
| **Gates** | `pnpm typecheck`, `pnpm build`, `pnpm check:boundaries` |
| **Hard stops** | Do not implement `@nabla/theme` as a separate package. Keep tokens inline in `@nabla/components`. |

---

### P4-004 — Task State Visual Component

| Field | Value |
|---|---|
| **Title** | Task state visual component |
| **Goal** | Implement a React component for task state list items. Render four distinct checkbox states (unchecked, checked, cancelled, important) per `07_EDITOR_BEHAVIOR.md`. Accept task state, label text, and onChange callback as props. |
| **Allowed files** | `packages/components/src/task-state.tsx`, `packages/components/src/task-state.css`, `packages/components/src/index.ts` |
| **Forbidden files** | All other Nabla visual components; `packages/editor/src/**` |
| **Acceptance criteria** | `TaskStateCheckbox` component renders each state correctly; clicking calls `onChange` with new state; minimal CSS styling is applied |
| **Gates** | `pnpm build`, `pnpm typecheck` |
| **Hard stops** | Do not implement task state editing logic (toggle/cycle). Component is a controlled checkbox only. |

---

### P4-005 — Wiki Link Visual Component

| Field | Value |
|---|---|
| **Title** | Wiki link visual component |
| **Goal** | Implement a React component for wiki links. Render as internal links per `07_EDITOR_BEHAVIOR.md`. Support distinct visual states for resolved and missing targets. Display alias text when provided. |
| **Allowed files** | `packages/components/src/wiki-link.tsx`, `packages/components/src/wiki-link.css`, `packages/components/src/index.ts` |
| **Forbidden files** | All other Nabla visual components; `packages/editor/src/**`; `packages/workspace/src/**` |
| **Acceptance criteria** | `WikiLink` component renders target/alias text; missing-target state has distinct visual; component does not perform workspace resolution |
| **Gates** | `pnpm build`, `pnpm typecheck` |
| **Hard stops** | Do not implement workspace resolver wiring. Component receives resolved/missing state as a prop. |

---

### P4-006 — Tag and Highlight Visual Components

| Field | Value |
|---|---|
| **Title** | Tag and highlight visual components |
| **Goal** | Implement React components for tags (`#tag`, `#nested/tag`) and highlights (`==text==`, `=={#ff0}text==`). Tags render as pills per `07_EDITOR_BEHAVIOR.md`. Simple highlights use default style; color highlights use the specified hex color. |
| **Allowed files** | `packages/components/src/tag.tsx`, `packages/components/src/tag.css`, `packages/components/src/highlight.tsx`, `packages/components/src/highlight.css`, `packages/components/src/index.ts` |
| **Forbidden files** | All other Nabla visual components; `packages/editor/src/**` |
| **Acceptance criteria** | `Tag` component renders as a styled pill with tag text; `Highlight` component renders with appropriate color for both simple and color highlights |
| **Gates** | `pnpm build`, `pnpm typecheck` |
| **Hard stops** | Do not implement color picker or tag suggestion UI. Static rendering only. |

---

### P4-007 — Emoji Visual Component

| Field | Value |
|---|---|
| **Title** | Emoji visual component |
| **Goal** | Implement a React component for emoji shortcodes per `07_EDITOR_BEHAVIOR.md`. Known shortcodes render as emoji glyphs; unknown shortcodes render as literal source text. |
| **Allowed files** | `packages/components/src/emoji.tsx`, `packages/components/src/emoji.css`, `packages/components/src/index.ts` |
| **Forbidden files** | All other Nabla visual components; `packages/editor/src/**` |
| **Acceptance criteria** | `Emoji` component renders known shortcodes as emoji glyphs; unknown shortcodes display as literal text |
| **Gates** | `pnpm build`, `pnpm typecheck` |
| **Hard stops** | Do not implement emoji picker UI. |

---

### P4-008 — Footnote and Comment Visual Components

| Field | Value |
|---|---|
| **Title** | Footnote and comment visual components |
| **Goal** | Implement React components for footnotes and comments per `07_EDITOR_BEHAVIOR.md`. Footnote references render as clickable markers; footnote definitions render inline. Comments render muted in edit mode and hidden in reading mode. |
| **Allowed files** | `packages/components/src/footnote.tsx`, `packages/components/src/footnote.css`, `packages/components/src/comment.tsx`, `packages/components/src/comment.css`, `packages/components/src/index.ts` |
| **Forbidden files** | All other Nabla visual components; `packages/editor/src/**` |
| **Acceptance criteria** | `FootnoteReference` renders as marker; `FootnoteDefinition` renders inline; `Comment` renders muted/hidden per mode prop |
| **Gates** | `pnpm build`, `pnpm typecheck` |
| **Hard stops** | Do not implement footnote panel. Comments are rendered inline only. |

---

### P4-009 — Callout Visual Component

| Field | Value |
|---|---|
| **Title** | Callout visual component |
| **Goal** | Implement a React component for callout blocks per `07_EDITOR_BEHAVIOR.md`. Render as a visual callout block with type-specific styling. Unknown callout types use a generic style. Support fold state indicators using source markers (`[!type]>` open / `[!type]v` closed). |
| **Allowed files** | `packages/components/src/callout.tsx`, `packages/components/src/callout.css`, `packages/components/src/index.ts` |
| **Forbidden files** | Toggle visual component; folded heading visual component; `packages/editor/src/**` |
| **Acceptance criteria** | `Callout` component renders with type-specific header/icon; fold state indicator is shown; component accepts fold state and onToggleFold as props |
| **Gates** | `pnpm build`, `pnpm typecheck` |
| **Hard stops** | Do not implement fold state editing logic. Component receives fold state as a prop. |

---

### P4-010 — Toggle Visual Component

| Field | Value |
|---|---|
| **Title** | Toggle visual component |
| **Goal** | Implement a React component for toggle blocks per `07_EDITOR_BEHAVIOR.md`. Closed toggles hide children; open toggles show children. Support fold state indicators using source markers (`]>` open / `]v` closed). |
| **Allowed files** | `packages/components/src/toggle.tsx`, `packages/components/src/toggle.css`, `packages/components/src/index.ts` |
| **Forbidden files** | Callout visual component; folded heading visual component; `packages/editor/src/**` |
| **Acceptance criteria** | `Toggle` component shows/hides children based on fold state; fold indicator is displayed; component accepts fold state and onToggleFold as props |
| **Gates** | `pnpm build`, `pnpm typecheck` |
| **Hard stops** | Do not implement fold state editing logic. Component receives fold state as a prop. |

---

### P4-011 — Folded Heading Visual Component

| Field | Value |
|---|---|
| **Title** | Folded heading visual component |
| **Goal** | Implement a React component for folded headings per `07_EDITOR_BEHAVIOR.md`. Closed folded headings hide section content until the next heading of same or higher depth. Open folded headings show content. If a parent is closed, all nested children are hidden. Support fold state indicators using source markers (`#>` open / `#v` closed). |
| **Allowed files** | `packages/components/src/folded-heading.tsx`, `packages/components/src/folded-heading.css`, `packages/components/src/index.ts` |
| **Forbidden files** | Callout visual component; toggle visual component; `packages/editor/src/**` |
| **Acceptance criteria** | `FoldedHeading` component shows/hides content based on fold state; parent closure hides nested children; component accepts fold state and onToggleFold as props |
| **Gates** | `pnpm build`, `pnpm typecheck` |
| **Hard stops** | Do not implement fold state editing logic. Component receives fold state as a prop. |

---

### P4-012 — Editor-to-Components Bridge

| Field | Value |
|---|---|
| **Title** | Editor-to-components bridge |
| **Goal** | Create an adapter that maps `@nabla/editor` node view types (taskState, wikiLink, tag, highlight, emoji, footnote, comment, callout, toggle, foldedHeading) to their corresponding `@nabla/components` React component implementations. This bridge replaces the `"node-safe-adapter"` stubs used in Phase 3. |
| **Allowed files** | `packages/components/src/bridge.ts`, `packages/components/src/bridge.tsx`, `packages/components/src/index.ts`, `packages/editor/src/nodes/*.ts` (if needed to update adapter references) |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/src/**` |
| **Acceptance criteria** | Bridge provides a registry mapping each node view type to its component; editor can import and use the bridge to resolve node views; all existing editor tests still pass |
| **Gates** | `pnpm build`, `pnpm typecheck`, `node --test packages/editor/tests/**/*.test.mjs`, `pnpm validate:fixtures` |
| **Hard stops** | Do not modify parser/serializer. Do not modify workspace behavior. |

---

### P4-013 — Components API Consistency

| Field | Value |
|---|---|
| **Title** | Components API consistency |
| **Goal** | Audit the public API surface of `@nabla/components`. Ensure exports are consistent, match the component contract from P4-002, and no forbidden exports leak through. |
| **Allowed files** | `packages/components/src/index.ts`, `packages/components/tests/api-consistency.test.ts` |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/src/**`, `packages/editor/src/**` |
| **Acceptance criteria** | Public API is clean and minimal; all intended component exports exist; no forbidden exports exist; all existing tests still pass |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm check:boundaries` |
| **Hard stops** | Do not add new visual features. Validation and cleanup only. |

---

### P4-014 — Components Fixture/Regression Plan

| Field | Value |
|---|---|
| **Title** | Components fixture/regression plan |
| **Goal** | Create component-level rendering tests for all visual components. Each test renders a component with known props and verifies the rendered output (e.g., snapshot or DOM assertion). |
| **Allowed files** | `packages/components/tests/`, `packages/components/fixtures/` |
| **Forbidden files** | `packages/components/src/**` (read-only unless fixing a regression); `specs/**` |
| **Acceptance criteria** | Component rendering tests pass covering: task state, wiki link, tag, highlight, emoji, footnote, comment, callout, toggle, and folded heading visual output |
| **Gates** | `pnpm test`, `pnpm typecheck`, `pnpm validate:fixtures` |
| **Hard stops** | Do not add tests for blocked/deferred features (transclusion, tooltip). Do not modify spec fixtures. |

---

### P4-015 — Phase 4 Validation Report

| Field | Value |
|---|---|
| **Title** | Phase 4 validation report |
| **Goal** | Write `reports/PHASE_4_VALIDATION.md` documenting the completion status of all Phase 4 tasks, quality gate results, deferred scope, and a phase verdict. |
| **Allowed files** | `reports/PHASE_4_VALIDATION.md`, `reports/IMPLEMENTATION_PROGRESS.md` |
| **Forbidden files** | All source files; all spec files |
| **Acceptance criteria** | Report exists, all gates pass, deferred scope is documented, verdict is stated |
| **Gates** | Full gate suite (`pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm typecheck`, `pnpm build`, `pnpm validate:fixtures`, `pnpm validate:spec-version`, `pnpm check:boundaries`, `pnpm lint`, `git status --short`) |
| **Hard stops** | Do not modify any source or spec files. Documentation only. |

---

## Blocked/Deferred Tasks

The following areas are identified as blocked or deferred from Phase 4 scope:

| Area | Reason | Would-be task |
|---|---|---|
| Tooltip rendering | Tooltip extension (`packages/markup/src/extensions/tooltips.ts`) not implemented | Post-P4-014 or Phase 5 |
| Transclusion embedded rendering | Requires stable editor-to-components bridge and workspace resolver integration; the editor currently uses `"node-safe-adapter"` stubs for transclusion | Post-P4-012 |
| `@nabla/app` integration | Phase 5; not available yet | Phase 5 |
| Full UI layout / app shell | Phase 5 | Phase 5 |
| Persistence layer | Phase 5 | Phase 5 |
| `@nabla/theme` as separate package | Not required for Phase 4; tokens live in `@nabla/components` | Post-Phase 5 |
| Block ID copy-reference action | Requires clipboard API; low priority | Low priority |

## Non-Negotiable Rules

1. Components are the rendering/view layer only. They are not the source of truth.
2. No hidden JSON, no stored HTML, no component state serialization.
3. No parser/serializer modifications unless explicitly scoped.
4. No workspace modifications unless explicitly scoped.
5. No Phase 5 (`@nabla/app`) work in Phase 4.
6. If behavior is missing or contradictory, stop and write a missing-spec report.
7. Each task must produce an implementation commit and a separate audit-bundle commit.
8. Fold state is persisted through source markers managed by the editor — components must not persist fold state independently.
