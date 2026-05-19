# Implementation Progress Report

## Phase

Phase 5 — `@nabla/app`

## Last Task

`P5-011` — Phase 5 Validation Report

## Branch

`phase-5-app-core`

## Status

P3-000 completed. P3-000-REPAIR completed. P3-001 completed. P3-002 completed. P3-003 completed. P3-004 completed. P3-005 completed. P3-006 completed. P3-007 completed. P3-008 completed. P3-009 completed. P3-010 completed. P3-011 completed. P3-012 completed. P3-013 completed. P3-014 completed. P3-015 completed. P4-000 completed. P4-001 completed. P4-002 completed. P4-003 completed. P4-004 completed. P4-005 completed. P4-006 completed. P4-007 completed. P4-008 completed. P4-008A completed. P4-008B completed. P4-009 completed. P4-010 completed. P4-011 completed. P4-012 completed. P4-013 completed. P4-014 completed. P4-015 completed. P5-000 completed. P5-001 completed. P5-002 completed. P5-003 completed. P5-004 completed. P5-005 completed. P5-005-REPAIR completed. P5-006 completed. P5-006-REPAIR completed. P5-007 completed. P5-008 completed. P5-009 completed. P5-010 completed. P5-011 completed.

Phase 1 (`@nabla/markup`) — ACCEPTED.
Phase 2 (`@nabla/workspace`) — ACCEPTED.
Phase 3 (`@nabla/editor`) — ACCEPTED.
Phase 4 (`@nabla/components`) — ACCEPTED.
Phase 5 (`@nabla/app`) — MVP COMPLETED. PASS WITH DEFERRED SCOPE.

### Repairs Applied

1. **P3-003 export-loss semantics fixed**: save pipeline canonicalizes editor export; `NABLA_EDITOR_EXPORT_LOSS` not detected by comparing to original source. Detection only under explicit controlled conditions (no-op roundtrip, protected region loss, parser diagnostics, preservation contract).
2. **P3-007 split**: monolithic node view task split into P3-007 (task states), P3-008 (wiki links), P3-009 (tags/highlights), P3-010 (emoji shortcodes), P3-011 (footnotes/comments).
3. **P3-004 forbidden files fixed**: replaced ambiguous `(binary)` with clear read-only rule for `model.ts`.
4. **P3-009/P3-014 aligned**: fixture/regression plan (now P3-014) scoped to only features implemented before it; fold state commands (P3-012) added as explicit prerequisite for fold roundtrip tests.
5. **Phase 3 scope kept clean**: no Phase 4/5 work, no parser/serializer changes, no specs/fixtures modifications.

### P3-001 Notes

- No Milkdown or ProseMirror dependencies added.
- No editor behavior implemented.
- Minimal package skeleton created: `packages/editor/` with package.json, tsconfig.json, src/index.ts, and test.

### P3-002 Notes

- Added type-level editor adapter contracts in `packages/editor/src/model.ts`.
- No Milkdown or ProseMirror dependencies added.
- No runtime editor behavior implemented.
- Save-pipeline runtime work remains deferred; this task defines contracts only.

### P3-003 Notes

- Added `packages/editor/src/save-pipeline.ts` with editor-exported Markdown canonicalization through `@nabla/markup` parse/serialize APIs.
- Export-loss semantics are controlled and explicit; canonical output is not compared against original source as a generic loss detector.
- Parser diagnostics are forwarded as editor save diagnostics.
- No Milkdown or ProseMirror dependencies added.
- No editor frontend/runtime behavior implemented beyond raw string canonicalization.

### P3-004 Notes

- Corrected wording drift: accepted backlog `P3-004` is `Editor Command/Transaction Skeleton`.
- Added plain Markdown editor skeleton in `packages/editor/src/editor.ts` using `prosemirror-markdown` and `prosemirror-state`.
- Added dependencies: `prosemirror-markdown`, `prosemirror-state`.
- Plain Markdown only; no Nabla-specific node views, node specs, marks, or frontend integration.
- Runtime strategy is Node-safe for basic load/export tests.

### P3-005 Notes

- Corrected wording drift: accepted backlog `P3-005` is `Editor Selection/Cursor Model`.
- Added pure position helpers in `packages/editor/src/position.ts` for source/editor offset creation, validation, clamping, and roundtrip conversion.
- No dependencies added.
- No cursor UI or selection UI implemented.
- No Nabla node views or DOM/browser runtime required for the position model helpers.

### P3-006 Notes

- Corrected wording drift: accepted backlog `P3-006` is `Editor Block Navigation Basics`.
- Strengthened plain Markdown block support in `packages/editor/src/editor.ts` with source replacement, block insertion, and block-summary helpers.
- Verified plain Markdown block roundtrip coverage for headings, paragraphs, bullet lists, ordered lists, blockquotes, and code blocks.
- No dependencies added.
- No Nabla-specific node views added.

### P3-007 Notes

- Added task-state support only in `packages/editor/src/nodes/task-state.ts` and editor integration helpers.
- Supported task markers: `[ ]`, `[x]`, `[-]`, `[!]`.
- Runtime strategy remains a Node-safe adapter boundary; no browser DOM node view rendering was added.
- No other Nabla node views added.
- No dependencies added.

### P3-008 Notes

- Added wiki-link support only in `packages/editor/src/nodes/wiki-link.ts` and editor integration helpers.
- Supported syntax: `[[Target]]`, `[[Target|Alias]]`, `[[Target#Heading]]`, `[[Target^block]]`, `[[Target#Heading|Alias]]`, and compatible `[[Target#^block|Alias]]`.
- No workspace resolver integration was added; unresolved state remains adapter metadata only.
- Runtime strategy remains a Node-safe adapter boundary; no browser DOM node view rendering was added.
- No other Nabla node views added.
- No dependencies added.

### P3-009 Notes

- Added tag and highlight support only in `packages/editor/src/nodes/tag.ts` and `packages/editor/src/nodes/highlight.ts` plus editor integration helpers.
- Supported tag syntax: `#tag` and nested tags like `#nested/tag`.
- Supported highlight syntax: `==text==` and color highlights in the existing markup form `=={#ff0}text==`.
- No other Nabla node views added.
- No dependencies added.

### P3-010 Notes

- Added emoji shortcode support only in `packages/editor/src/nodes/emoji.ts` plus editor integration helpers.
- Known shortcodes follow the existing public markup registry.
- Unknown shortcodes remain literal source text and are ignored by the adapter metadata.
- No emoji picker UI was added.
- No other Nabla node views added.
- No dependencies added.

### P3-011 Notes

- Added footnote and comment support only in `packages/editor/src/nodes/footnote.ts` and `packages/editor/src/nodes/comment.ts` plus editor integration helpers.
- Footnote metadata distinguishes references and definitions.
- Comment metadata supports multiline block comments when the current markup syntax supports them.
- No footnote panel UI or comment mode UI was added.
- No other Nabla node views added.
- No dependencies added.

### P3-012 Notes

- Added fold state commands only in `packages/editor/src/commands/fold.ts`.
- Supported source markers: callouts `[!Type]>`/`[!Type]v`, toggles `]>`/`]v`, and folded headings `#>`/`#v`.
- No visual rendering for callouts, toggles, or folded headings was added.
- No dependencies added.

### P3-013 Notes

- Audited public API surface of `@nabla/editor`.
- Added API consistency tests in `packages/editor/tests/api-consistency.test.mjs`.
- Verified all intended runtime exports exist and are grouped logically.
- Verified no forbidden runtime exports exist (callout visual, toggle visual, folded heading visual, transclusion, tooltip, block ID editing, components/app integration).
- Verified `NABLA_EDITOR_EXPORT_LOSS` is emitted only under explicit controlled conditions, not generic canonical-vs-original divergence.
- Verified source preservation for all accepted syntax surfaces: task states, wiki links, tags, highlights, emoji shortcodes, footnotes, comments, and fold markers.
- No new editor features implemented.
- No dependencies added.
- No parser/serializer changes.
- No workspace changes.

### P3-014 Notes

- Created editor-level regression fixtures in `packages/editor/fixtures/`.
- Added 10 fixture cases: task-state-toggle, wiki-link-preserve, tag-highlight-preserve, emoji-preserve, footnote-comment-preserve, fold-callout-toggle, fold-toggle-toggle, fold-heading-toggle, protected-region-preserve, export-loss-controlled.
- Each fixture has input.md, expected.md, and operation.json.
- Created fixture test runner in `packages/editor/tests/editor-fixtures.test.mjs`.
- Fixtures cover all features from P3-007 through P3-012: task state toggle, wiki link preservation, tag/highlight preservation, emoji preservation, footnote/comment preservation, callout fold toggle, toggle fold toggle, heading fold toggle, protected region preservation, and controlled export-loss detection.
- No deferred visual features tested (callout visual, toggle visual, folded heading visual, transclusion, tooltip).
- No source files changed.
- No dependencies added.
- No parser/serializer changes.
- No workspace changes.

### P3-015 Notes

- Created Phase 3 validation report in `reports/PHASE_3_VALIDATION.md`.
- Documents completion status of all 15 Phase 3 tasks (P3-000 through P3-014).
- Quality gate results: all pass.
- Test coverage summary covering editor API consistency, fixture regression, and all accepted syntax surfaces.
- Deferred scope documented: visual callout, toggle, folded heading, transclusion, tooltip, components, app.
- Explicit confirmations: no parser/serializer changes, no workspace changes, no Phase 4 started, source-of-truth invariant preserved.
- Phase verdict: PASS WITH DEFERRED SCOPE.
- No source files changed.
- No dependencies added.

### P4-000 Notes

- Created Phase 4 kickoff report in `reports/PHASE_4_KICKOFF.md`.
- Created Phase 4 task backlog in `reports/PHASE_4_TASK_BACKLOG.md`.
- New branch created: `phase-4-components-core`.
- Package target: `@nabla/components`.
- Backlog contains 15 tasks (P4-001 through P4-015): package skeleton, rendering contract, design tokens, individual visual components for all accepted Nabla syntax surfaces, editor-to-components bridge, API consistency, fixture/regression plan, and validation report.
- Deferred scope documented: tooltip rendering (blocked), transclusion embedded rendering (deferred), app integration (Phase 5).
- No source files changed.
- No dependencies added.
- No parser/serializer changes.
- No workspace changes.
- No editor source changes.

### P4-001 Notes

- Created `packages/components/` with `package.json`, `tsconfig.json`, and `src/index.ts`.
- Package exports `NABLA_COMPONENTS_PACKAGE` constant.
- Updated root `package.json` build/typecheck scripts to include `packages/components/tsconfig.json`.
- No React dependencies added.
- No visual components implemented.
- No editor source modified.
- No parser/serializer or workspace changes.
- Only dependency: `@nabla/markup` (workspace).

### P4-002 Notes

- Created `packages/components/src/types.ts` with full rendering contract types.
- Defined `NablaComponentKind` union for all 10 implementable component kinds (taskState, wikiLink, tag, highlight, emoji, footnote, comment, callout, toggle, foldedHeading).
- Defined `NablaDeferredComponentKind` marking transclusion (DEFERRED) and tooltip (BLOCKED).
- Defined per-kind prop interfaces: `TaskStateProps`, `WikiLinkProps`, `TagProps`, `HighlightProps`, `EmojiProps`, `FootnoteProps`, `CommentProps`, `CalloutProps`, `ToggleProps`, `FoldedHeadingProps`.
- Defined `NablaComponentRegistry` interface for editor bridge resolution.
- Added `NABLA_COMPONENT_RENDERING_CONTRACT` constant.
- Re-exported all types from `packages/components/src/index.ts`.
- No React dependency added.
- No visual components implemented.
- No editor/markup/workspace source changes.

### P4-003 Notes

- Created `packages/components/src/theme.ts` with typed `NablaComponentTheme` interface and `NABLA_COMPONENT_THEME` default object.
- Token categories: colors (text, surface, primary, danger, warning, success, code background), spacing (xs-xl), radius (sm-full), typography (font families, sizes, line height), borders (width, style), shadows (sm, md).
- Created `packages/components/src/tokens.css` with CSS custom properties under `:root` using `--nabla-*` naming convention.
- Re-exported theme from `packages/components/src/index.ts`.
- No component-specific styling implemented (no task state, wiki link, tag, highlight, emoji, footnote, comment, callout, toggle, or folded heading styling).
- No React dependency added.
- No visual components implemented.
- No editor/markup/workspace source changes.

### P4-004 Notes

- Created `packages/components/src/task-state.tsx` with `TaskStateCheckbox` component.
- Pure helpers: `getNextTaskState`, `TASK_STATE_ORDER`, `TASK_STATE_MARKERS`, `TASK_STATE_LABELS`.
- Created `packages/components/src/task-state.css` using `--nabla-*` token variables.
- Added React 18 as dependency in `packages/components/package.json`.
- Updated `packages/components/tsconfig.json` to support TSX with `jsx: "react-jsx"`.
- Created tests: `tests/task-state.test.mjs` (7 tests) and `tests/public-api.test.mjs` (5 tests).
- Public API consistency: only task-state component exported; no other visual components leak.
- Browser DOM rendering tests deferred to P4-014 (no DOM/jsdom setup in repo).
- No editor/markup/workspace source changes.

### P4-005 Notes

- Created `packages/components/src/wiki-link.tsx` with `WikiLink` component.
- Pure helper: `getWikiLinkDisplay` — resolves display text (alias over target) and metadata flags.
- Created `packages/components/src/wiki-link.css` using `--nabla-*` token variables.
- Resolved links styled with primary color solid underline; unresolved links with muted color dashed underline.
- Created tests: `tests/wiki-link.test.mjs` (6 tests); updated `tests/public-api.test.mjs`.
- Public API consistency: `WikiLink` and `getWikiLinkDisplay` exported; no other visual components leak.
- No workspace resolver integration — component receives resolved/unresolved state as props.
- No dependencies added.
- No editor/markup/workspace source changes.

### P4-006 Notes

- Created `packages/components/src/tag.tsx` with `Tag` component and `getTagDisplay` helper.
- Created `packages/components/src/tag.css` — pill-style rendering using `--nabla-*` tokens.
- Created `packages/components/src/highlight.tsx` with `Highlight` component and `getHighlightStyle` helper.
- Created `packages/components/src/highlight.css` — default yellow highlight; color highlights use inline `style` with provided hex color.
- Created tests: `tests/tag-highlight.test.mjs` (6 tests); updated `tests/public-api.test.mjs`.
- Public API consistency: `Tag`, `Highlight`, and helpers exported; no future components leak.
- No color picker or tag suggestion UI implemented.
- No dependencies added.
- No editor/markup/workspace source changes.

### P4-007 Notes

- Created `packages/components/src/emoji.tsx` with `Emoji` component and `getEmojiDisplay` helper.
- Created `packages/components/src/emoji.css` — minimal styling using `--nabla-*` tokens.
- Known shortcodes render emoji glyph; unknown shortcodes render literal raw text with muted color.
- Created tests: `tests/emoji.test.mjs` (3 tests); updated `tests/public-api.test.mjs`.
- Public API consistency: `Emoji` and `getEmojiDisplay` exported; no future components leak.
- No emoji picker UI implemented.
- No dependencies added.
- No editor/markup/workspace source changes.

### P4-008 Notes

- Created `packages/components/src/footnote.tsx` with `FootnoteReference` and `FootnoteDefinition` components.
- Created `packages/components/src/footnote.css` — superscript markers, muted definitions.
- Created `packages/components/src/comment.tsx` with `Comment` component — visible in editing mode, null in reading mode.
- Created `packages/components/src/comment.css` — muted opacity styling.
- Pure helpers: `getFootnoteDisplay`, `getCommentDisplay`.
- Created tests: `tests/footnote-comment.test.mjs` (8 tests); updated `tests/public-api.test.mjs`.
- Public API consistency: footnote/comment components and helpers exported; no future components leak.
- No footnote panel UI implemented.
- No dependencies added.
- No editor/markup/workspace source changes.

### P4-008A Notes

- Created `packages/components/playground/` with Vite + React setup.
- Includes `playground/index.html`, `playground/vite.config.ts`, `playground/src/main.tsx`.
- `pnpm dev` starts the playground server at `http://127.0.0.1:5173`.
- Displays all 8 accepted components: TaskStateCheckbox (4 states), WikiLink (resolved, unresolved, heading, block), Tag (simple, nested), Highlight (simple, color), Emoji (known, unknown), Footnote (reference, definition), Comment (editing, reading, multiline).
- Imports component CSS and tokens CSS for proper visual styling.
- Not an app — explicitly marked as development playground.
- No app shell, routing, persistence, or editor/workspace integration.
- No new visual components implemented.
- No editor/markup/workspace source changes.
- Dependencies added: `vite`, `@vitejs/plugin-react`, `react-dom`, `@types/react-dom`.

### P4-008B Notes

- Polish pass for the components playground only.
- Added `ExampleRow` component with card-style rows (border, background, padding).
- Added `playground/src/playground.css` for all playground-specific styling.
- Converted inline styles to CSS classes for sections, rows, and layout.
- Labels now sit above components with clear spacing (`margin-bottom` on label, card padding).
- Footnote reference example: added space before reference, and added `margin-left: 0.1em` to `.nabla-footnote-reference` generic CSS.
- Tag pill: increased top/bottom padding from 1px to 2px for better pill shape visibility.
- Highlight default: increased background opacity from 40% (#ffff0066) to 50% (#ffff0080) for better readability.
- Comment: added `font-style: italic` for a more muted, comment-like appearance.
- No new visual components implemented.
- No component behavior or API changed.
- No editor/markup/workspace source changes.
- No app/Phase 5 work started.
- No parser/serializer changes.
- No dependencies added.

### P4-009 Notes

- Created `packages/components/src/callout.tsx` with `Callout` component and `getCalloutDisplay` helper.
- Created `packages/components/src/callout.css` with card-like callout, left accent border by type, fold toggle, and `--nabla-*` token styling.
- Callout renders a header with callout type label and fold toggle button; body is hidden when `foldState` is `"closed"`.
- Callout type label mapping for common types (note, warning, tip, danger, info, abstract, question); unknown types use the raw type string as label.
- Exported `Callout`, `getCalloutDisplay`, and `CalloutDisplay` type from `packages/components/src/index.ts`.
- Updated playground with Callout section showing open note and closed warning examples with fold toggle interaction.
- Added `packages/components/tests/callout.test.mjs` with 4 tests covering `getCalloutDisplay` metadata and component function export.
- Updated `packages/components/tests/public-api.test.mjs` with Callout export test; removed Callout from forbidden-exports test.
- Local `CalloutProps` type used (types.ts `CalloutProps` has `children?: never`); no `types.ts` modifications.
- No new visual components added beyond callout.
- No component API contract rewrite.
- No dependencies added.
- No editor/markup/workspace source changes.
- No app/Phase 5 work started.
- No parser/serializer changes.
- DOM/React rendering tests deferred to component fixture/regression phase.

### P4-010 Notes

- Created `packages/components/src/toggle.tsx` with `Toggle` component and `getToggleDisplay` helper.
- Created `packages/components/src/toggle.css` with compact disclosure row, chevron indicator, and `--nabla-*` token styling.
- Toggle renders a clickable header row with chevron indicator; body is hidden when `foldState` is `"closed"`.
- Header is a full-width button; `aria-expanded` attribute set for accessibility.
- Exported `Toggle`, `getToggleDisplay`, and `ToggleDisplay` type from `packages/components/src/index.ts`.
- Updated playground with Toggle section showing open and closed examples with fold toggle interaction.
- Added `packages/components/tests/toggle.test.mjs` with 3 tests covering `getToggleDisplay` metadata and component function export.
- Updated `packages/components/tests/public-api.test.mjs` with Toggle export test; removed Toggle from forbidden-exports test.
- Local `ToggleProps` type used (types.ts `ToggleProps` has `children?: never`); no `types.ts` modifications.
- No new visual components added beyond toggle.
- No component API contract rewrite.
- No dependencies added.
- No editor/markup/workspace source changes.
- No app/Phase 5 work started.
- No parser/serializer changes.
- DOM/React rendering tests deferred to component fixture/regression phase.

### P4-011 Notes

- Created `packages/components/src/folded-heading.tsx` with `FoldedHeading` component and `getFoldedHeadingDisplay` helper.
- Created `packages/components/src/folded-heading.css` with heading-like disclosure row, fold indicator, body indentation, and `--nabla-*` token styling.
- Folded heading renders a clickable header with fold indicator; heading level drives font size (h1=1.5rem down to h6=0.875rem); body hidden when `foldState` is `"closed"`.
- Exported `FoldedHeading`, `getFoldedHeadingDisplay`, and `FoldedHeadingDisplay` type from `packages/components/src/index.ts`.
- Updated playground with Folded Heading section showing open level-2 and closed level-3 examples with fold toggle interaction.
- Added `packages/components/tests/folded-heading.test.mjs` with 4 tests covering metadata (level, foldState, text) and component function export.
- Updated `packages/components/tests/public-api.test.mjs` with FoldedHeading export test; removed FoldedHeading from forbidden-exports test.
- Local `FoldedHeadingProps` type used (types.ts `FoldedHeadingProps` has `children?: never`); no `types.ts` modifications.
- No new visual components added beyond folded heading.
- No component API contract rewrite.
- No dependencies added.
- No editor/markup/workspace source changes.
- No app/Phase 5 work started.
- No parser/serializer changes.
- DOM/React rendering tests deferred to component fixture/regression phase.

### P4-012 Notes

- Created `packages/components/src/bridge.ts` with pure adapter boundary between editor metadata and component props.
- Defines `BridgeComponentMetadata` discriminated union mirroring all 10 accepted editor node metadata shapes.
- `toComponentKind(metadata)` returns `NablaComponentKind`.
- `toComponentProps(metadata)` returns `NablaComponentProps` with no-op callback placeholders (editor runtime replaces these).
- `createComponentDescriptor(metadata)` returns `{ kind, props }` descriptor.
- `isBridgeKindSupported(kind)` checks against deferred/blocked lists.
- `BRIDGE_DEFERRED_KINDS` includes `transclusion`; `BRIDGE_BLOCKED_KINDS` includes `tooltip`.
- All 10 mappings supported: taskState, wikiLink, tag, highlight, emoji, footnote, comment, callout, toggle, foldedHeading.
- Bridge does not import React, render DOM, mutate Markdown, resolve workspace links, or call parser/serializer.
- Added `packages/components/tests/bridge.test.mjs` with 30 tests covering all kind mappings, prop shapes, descriptor creation, supported/unsupported kinds, and deferred/blocked constants.
- Updated `packages/components/tests/public-api.test.mjs` with bridge export verification.
- No editor source files modified.
- No component API contract rewrite.
- No dependencies added.
- No DOM node views added.
- No editor behavior changed.
- No parser/serializer/workspace changes.
- Transclusion and tooltip remain deferred/blocked.

### P4-013 Notes

- Performed API consistency audit across `@nabla/components`.
- Fixed gap: `FoldedHeadingProps` in `types.ts` was missing `text: string` — added it.
- Fixed bridge: `toComponentProps` for foldedHeading now passes `text: metadata.text`.
- Created `packages/components/tests/api-consistency.test.mjs` with 24 tests covering:
  - Export completeness for all 11 visual components and 10 pure helpers
  - Bridge API exports (6 functions/constants)
  - Forbidden exports (no TooltipRenderer, TransclusionRenderer)
  - Folded heading text preservation through the bridge
  - Source-of-truth invariant (no html, innerHTML, editorState, jsonState, serializedState in any component props)
  - Blocked/deferred scope verified via bridge
- All 103 component tests pass (79 existing + 24 new).
- No new visual components added.
- No component visual behavior changed.
- No dependencies added.
- No editor/markup/workspace source changes.
- No app/Phase 5 work started.

### P4-014 Notes

- Created `packages/components/fixtures/` with 25 fixture cases covering all accepted components and bridge mappings.
- Created `packages/components/tests/component-fixtures.test.mjs` — fixture-driven test runner that loads JSON fixtures, calls declared operations, and compares results.
- Fixture cases cover: 4 task-state cycles, 2 wiki-link displays, 2 tag displays, 2 highlight styles, 2 emoji displays, 2 footnote displays, 2 comment displays, 2 callout displays, 2 toggle displays, 2 folded-heading displays, 3 bridge mappings (task-state props, wiki-link props, folded-heading text preservation through descriptor).
- The `bridge-folded-heading-text` fixture proves folded heading text is preserved through `createComponentDescriptor`.
- All 129 component tests pass (104 existing + 25 new fixture tests).
- No source/component behavior changed.
- No DOM snapshot tests added.
- No dependencies added.
- No editor/markup/workspace source changes.

### P4-015 Notes

- Phase 4 validation report created: `reports/PHASE_4_VALIDATION.md`.
- Documents completion of all 15 Phase 4 core tasks plus P4-008A, P4-008B.
- Components implemented: 11 visual components for all accepted Nabla syntax surfaces.
- Bridge/contracts implemented: rendering contract, theme tokens, bridge descriptor helpers, deferred/blocked constants.
- Test coverage: 129 tests across 12 test files (component helpers, public API, bridge, API consistency, fixture regression).
- Quality gate results: all pass.
- Deferred scope documented: tooltip (BLOCKED), transclusion (DEFERRED), DOM snapshot tests, editor runtime node views, design system polish.
- Phase verdict: PASS WITH DEFERRED SCOPE.
- No source/test/fixture/package changes made.
- No app/Phase 5 work started.

### P5-000 Notes

- Phase 5 kickoff report created: `reports/PHASE_5_KICKOFF.md`.
- Phase 5 task backlog created: `reports/PHASE_5_TASK_BACKLOG.md`.
- New branch created: `phase-5-app-core`.
- Package target: `@nabla/app`.
- Backlog contains 11 tasks (P5-001 through P5-011): app package skeleton, dev server/shell, sample document loading, render pipeline, component integration, editor MVP, workspace integration (conditional), visual polish, fixtures, API consistency, and validation report.
- Deferred scope documented: tooltip (BLOCKED), transclusion (DEFERRED), database persistence, user accounts, collaboration, AI features, production deployment.
- No packages/app created yet.
- No Phase 5 implementation started.
- No dependencies added.
- No source files changed.

### P5-001 Notes

- Created `packages/app/` with `package.json`, `tsconfig.json`, and `src/index.ts`.
- Package exports `NABLA_APP_PACKAGE` constant.
- Root `package.json` build/typecheck scripts updated to include `packages/app/tsconfig.json`.
- Dependency: `@nabla/markup` (workspace).
- No app shell/UI implemented.
- No React/Vite/dev server added.
- No document loading/rendering/editor integration.
- No Phase 1–4 source package changes.

### P5-003 Notes

- Created `packages/app/src/sample-document.ts` with sample Nabla Markdown+ source including headings, task states, wiki links, tags, highlights, emoji shortcodes, footnotes, comments, callout markers, toggle markers, and folded heading markers.
- Updated `packages/app/src/main.tsx` to load `SAMPLE_DOCUMENT_SOURCE` into React state and display it in a read-only `<textarea>`.
- Updated `packages/app/src/app.css` with source view styles.
- Added `packages/app/tests/sample-document.test.mjs` with 12 tests verifying source contains all expected syntax markers.
- No parsing/render pipeline implemented.
- No editor/component/workspace integration.
- No dependencies added.

### P5-004 Notes

- Created `packages/app/src/render-pipeline.ts` with `parseSampleSource`, `canonicalizeSampleSource`, and `getRenderPipelineSummary` helpers.
- Used only public `@nabla/markup` APIs: `parse` and `serialize`.
- App displays: original length, canonical length, diagnostics count, original source textarea, canonical output textarea.
- Created `packages/app/tests/render-pipeline.test.mjs` with 5 tests covering parse, canonicalize, summary fields, full document processing, and source-of-truth invariant (no HTML/JSON/editorState).
- No visual component rendering implemented.
- No editor/workspace integration.
- No dependencies added.

### P5-002 Notes

- Created `packages/app/index.html`, `packages/app/vite.config.ts`, `packages/app/src/main.tsx`, `packages/app/src/app.css`.
- App shell renders: title "Nabla", subtitle "Markdown-first visual editor", status card "Phase 5 app shell running", source-of-truth reminder.
- Updated `packages/app/package.json` with React/Vite dependencies and dev/build scripts.
- Updated root `package.json` with `dev:app` script.
- Dependencies added: `react`, `react-dom`, `@types/react`, `@types/react-dom`, `vite`, `@vitejs/plugin-react`.
- No document loading, render pipeline, editor integration, component integration, or workspace integration.
- No Phase 1–4 source package changes.

## Verification Summary

- `pnpm test` — PASS
- `pnpm test:workspace` — PASS
- `pnpm test:markup` — PASS
- `pnpm typecheck` — PASS
- `pnpm build` — PASS
- `pnpm validate:fixtures` — PASS
- `pnpm validate:spec-version` — PASS
- `pnpm check:boundaries` — PASS
- `pnpm lint` — PASS as documented unavailable placeholder
- `node --test packages/app/tests/**/*.test.mjs` — PASS (89/89)
- `node --test packages/components/tests/**/*.test.mjs` — PASS (129/129)
- `node --test packages/editor/tests/**/*.test.mjs` — PASS (93/93)
- `pnpm --dir packages/components build` — PASS
- `pnpm --dir packages/app build` — PASS

### P5-005 Notes

- Added `packages/app/src/component-rendering.ts` with `createSampleComponentDescriptors()` and `getComponentRenderingSummary()`.
- Uses only public `@nabla/components` APIs: `createComponentDescriptor`, `isBridgeKindSupported`, and all 11 visual React components (TaskStateCheckbox, WikiLink, Tag, Highlight, Emoji, FootnoteReference, FootnoteDefinition, Comment, Callout, Toggle, FoldedHeading).
- Sample metadata is explicit and temporary — derived from the sample document content as an MVP bridge. Automatic parser/editor metadata extraction for component rendering remains deferred; P5-006 focuses only on source editing and canonical export.
- Updated `packages/app/src/main.tsx` with a "Visual Components Preview" section showing all accepted component kinds: task state (4 states), wiki link (resolved, unresolved), tag (simple, nested), highlight (default, color), emoji (known, unknown), footnote (reference, definition), comment (editing, reading), callout (open, closed), toggle (open, closed), folded heading (open, closed).
- Component CSS imported via `@import` in `app.css` from `@nabla/components/src/*.css` paths (Vite-resolved).
- App source-of-truth invariant preserved: original source textarea, canonical source textarea, and render pipeline summary remain untouched.
- Created `packages/app/tests/component-rendering.test.mjs` with 20 tests: non-empty descriptor list, all 10 expected kinds present, no hidden JSON/HTML keys in props, render summary fields, and transclusion/tooltip exclusion.
- No editor integration, no workspace integration, no component source changes.
- No dependencies added to `packages/app/package.json`.
- `@nabla/components` symlinked in `packages/app/node_modules/` for workspace resolution.

### P5-006 Notes

- Added `packages/app/src/editor-integration.ts` with `createSourceEditor()`, `getEditableSource()`, `exportCanonicalSource()`, and `getEditorIntegrationSummary()`.
- Uses only public `@nabla/editor` APIs: `createEditor`, `loadSource`, `getSource`.
- Canonical export reuses existing `canonicalizeSampleSource` from the app render pipeline (which centralizes `@nabla/markup` parse/serialize).
- Updated `packages/app/src/main.tsx`:
  - Added editable source textarea initialized from `SAMPLE_DOCUMENT_SOURCE`.
  - Canonical export textarea now follows the edited source (updates on every change).
  - Editor integration summary displayed: source length, exported length, diagnostics count.
  - Note added: "This is plain source editing MVP. Rich-text editor node views are deferred."
  - Visual components preview, status card, and source-of-truth reminder preserved.
- Source-of-truth rules maintained: edited text source is the working document source; canonical export is derived through the save pipeline; no hidden JSON/HTML/editorState.
- Created `packages/app/tests/editor-integration.test.mjs` with tests: can load sample source, editable source retrieval, canonical export non-empty, deterministic export changes on edit, summary fields (sourceLength, exportedLength, diagnosticsCount, hasExportedSource), no hidden JSON/HTML/editorState/jsonState/serializedState keys, no workspace integration.
- No rich-text ProseMirror node views implemented.
- No workspace integration.
- No automatic component metadata extraction.
- No dependencies added to `packages/app/package.json`.
- `@nabla/editor` symlinked in `packages/app/node_modules/` for workspace resolution.

### P5-006-REPAIR Notes

- App runtime now actually uses the editor integration helper for editable source initialization and canonical export.
- `main.tsx` initializes edited source via `getEditableSource(SAMPLE_DOCUMENT_SOURCE)` instead of raw `SAMPLE_DOCUMENT_SOURCE`.
- `main.tsx` computes canonical export via `exportCanonicalSource(editedSource)` instead of `getRenderPipelineSummary(editedSource).canonicalSource`.
- Unused `createSourceEditor` import removed from main.tsx.
- `exportCanonicalSource` documented as delegating to the existing app save/export pipeline.
- Added test: `getEditableSource` returns sample document content.
- Added test: no workspace integration assertions on the module exports.
- No rich-text node views implemented.
- No workspace integration.
- No editor/markup/components/workspace source changes.

### P5-007 Notes

- Added `packages/app/src/workspace-integration.ts` with `createSampleWorkspaceIndex()` and `getWorkspaceIntegrationSummary()`.
- Uses only public `@nabla/workspace` API: `createWorkspace`.
- Workspace is browser-compatible — all operations are in-memory with no Node filesystem requirements. `FileIndexInput` takes `{ path: string; source: string }` where source is document content.
- Updated `packages/app/src/main.tsx` with a "Workspace" section showing: document count, link count, backlink count, and diagnostics count.
- Workspace computed from the edited source as a single in-memory document (`sample.md`).
- Integration is MVP-level summary only — no transclusion embedded rendering, no tooltip rendering.
- Workspace source (`@nabla/workspace`) not modified.
- No file system loading implemented.
- No transclusion embedded rendering.
- No tooltip rendering.
- Created `packages/app/tests/workspace-integration.test.mjs` with 11 tests: documentCount >= 1, linkCount numeric, backlinkCount numeric, diagnosticCount numeric, hasWorkspaceIndex true, no filesystem paths in summary, no hidden JSON/HTML/editorState/jsonState/serializedState keys.
- `@nabla/workspace` symlinked in `packages/app/node_modules/` for workspace resolution.

### P5-008 Notes

- Visual polish pass for the app MVP layout.
- Updated `packages/app/src/app.css` with:
  - Softer body background (`#f5f5f7`) for improved visual depth.
  - Wider max-width (680px) for better content density.
  - Centered app header with larger title.
  - Unified `.card` component replacing ad-hoc `.status-card` / `.sample-section` for consistent section styling (white background, subtle shadow).
  - `.card__stats` with labeled stat items using `.card__stat` and `.card__stat-label`.
  - Improved editor textarea: larger min-height, blue border with focus ring, transition.
  - Readonly source view with muted gray background and color.
  - Updated preview groups: uppercase section labels, lighter dividers, `.preview-examples--row` variant for inline groups (wiki link, tag, highlight, emoji) to display side-by-side.
  - Removed unused `.status-card__note`, `.status-card__stats`, `.sample-section`, `.section-note` legacy classes.
- Updated `packages/app/src/main.tsx` with structural class migration:
  - Replaced `.status-card` with `.card` for render pipeline, editor, canonical export, and workspace sections.
  - Replaced `.section-title`/`.section-note` with `.card__title`/`.card__note` where appropriate.
  - Added `.preview-examples--row` and `.preview-item--inline` for inline preview groups.
  - Editor section wrapped in `.card` for consistent card styling.
- No app logic or helper function behavior changed.
- No tests modified.
- No component/editor/workspace/markup source changes.
- No tooltip/transclusion rendering.

### P5-009 Notes

- Created `packages/app/fixtures/` with 8 fixture cases covering current MVP behavior.
- Created `packages/app/tests/app-fixtures.test.mjs` — fixture-driven test runner.
- Fixture cases:
  - `sample-source-basic` — sample document source is non-empty.
  - `render-pipeline-summary` — getRenderPipelineSummary returns expected fields.
  - `canonical-export-basic` — canonicalizeSampleSource produces expected output.
  - `editor-edit-roundtrip` — exportCanonicalSource changes deterministically on edit.
  - `component-descriptor-summary` — getComponentRenderingSummary reports correct counts (23 total, 10 unique kinds, 10 supported kinds).
  - `component-descriptor-kinds` — all 10 accepted kinds present; transclusion/tooltip excluded.
  - `workspace-summary-basic` — getWorkspaceIntegrationSummary returns documentCount 1 and numeric fields.
  - `source-of-truth-invariant` — no hidden JSON/HTML/editorState/jsonState/serializedState keys in any pipeline/helper results.
- All 65 app tests pass (including 8 existing test files and the new fixture runner).
- No app source files modified.
- No DOM/browser snapshot tests added.
- No dependencies added.
- No component/editor/workspace/markup source changes.
- Tooltip and transclusion confirmed excluded from component descriptor kinds.

### P5-010 Notes

- Audited public API surface of `@nabla/app`.
- Added app-level re-exports to `packages/app/src/index.ts`:
  - `NABLA_APP_PACKAGE`, `SAMPLE_DOCUMENT_SOURCE`
  - `canonicalizeSampleSource`, `getRenderPipelineSummary`
  - `createSampleComponentDescriptors`, `getComponentRenderingSummary`
  - `createSourceEditor`, `getEditableSource`, `exportCanonicalSource`, `getEditorIntegrationSummary`
  - `createSampleWorkspaceIndex`, `getWorkspaceIntegrationSummary`
  - Type exports: `RenderPipelineSummary`, `ComponentRenderingSummary`, `EditorIntegrationSummary`, `WorkspaceIntegrationSummary`
- No forbidden low-level internals re-exported: no `parse`, `serialize`, `createWorkspace`, `createEditor`, `loadSource`, `getSource`, no React component classes, no bridge internals.
- Created `packages/app/tests/api-consistency.test.mjs` with 22 tests covering:
  - All intended exports present and functional
  - No forbidden parser/serializer/workspace/editor/component/bridge internals leaked
  - No source-of-truth violation keys (html, innerHTML, editorState, jsonState, serializedState) in summary objects or component props
  - Tooltip/transclusion renderers not exported
  - Node-safe import verification from built `dist/index.js`
- No app runtime behavior changed.
- No app UI changed.
- No app helper implementations modified.
- No Phase 1–4 source package changes.
- No dependencies added.
- No final validation report created (P5-011 deferred).

### P5-011 Notes

- Created `reports/PHASE_5_VALIDATION.md` — official Phase 5 validation report.
- Documents completion of all 11 core Phase 5 tasks plus kickoff and repairs.
- All quality gates pass.
- MVP capabilities verified: browser dev server, app shell, sample document loading, render pipeline, component previews, source editing, canonical export, workspace index, bounded public API.
- Deferred scope documented: rich-text node views, automatic metadata extraction, tooltip (BLOCKED), transclusion (DEFERRED), DOM tests, file system loading, production deployment.
- Explicit confirmations: no Phase 1–4 source changes, no new phase started, source-of-truth invariant preserved.
- Phase verdict: PASS WITH DEFERRED SCOPE.
- No source files, tests, fixtures, or package metadata modified.
- No dependencies added.

## Active Blockers

None.

## Next Recommended Task

External audit/approval for Phase 5 closure, then P5-CLOSE — Phase 5 closure merge. Do not start a new phase until P5-011 and P5-CLOSE are externally accepted.
