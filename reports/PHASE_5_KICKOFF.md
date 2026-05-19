# Phase 5 Kickoff — `@nabla/app`

## Phase 5 Objective

Build the minimal application shell that integrates the existing four packages (`@nabla/markup`, `@nabla/workspace`, `@nabla/editor`, `@nabla/components`) into a working browser-visible document viewer/editor. Phase 5 produces the first MVP where a user can open a Markdown/Nabla Markdown+ document, see it rendered with visual components, and save canonical Markdown through the established save pipeline.

## Package Target

`@nabla/app` — a new package under `packages/app/`.

Dependency direction:

- `@nabla/app` MAY depend on `@nabla/markup`, `@nabla/workspace`, `@nabla/editor`, and `@nabla/components`.
- `@nabla/app` MUST NOT bypass package boundaries to reach into parser/serializer/workspace/editor internals.
- `@nabla/app` MUST NOT define grammar.
- `@nabla/app` MUST use the canonical save pipeline: `editor export → @nabla/markup parser → @nabla/markup serializer → saved source`.
- `@nabla/app` MUST NOT store HTML or hidden JSON as a document format.

## Dependency Assumptions from Phases 1–4

- **`@nabla/markup` (Phase 1)** — stable and accepted. Provides parser (`NablaDocument` AST), serializer (canonical Markdown output), diagnostic codes, protected region handling, and the Nabla Markdown+ syntax registry.
- **`@nabla/workspace` (Phase 2)** — stable and accepted. Provides file index, heading index, block ID index, backlink computation, wiki link resolution, transclusion resolution (including cycle and depth-limit detection), and workspace diagnostics.
- **`@nabla/editor` (Phase 3)** — stable and accepted. Provides `createEditor()`, `loadSource()`, `getSource()`, source preservation, position helpers, block navigation, fold commands for callouts/toggles/folded headings, and Node-safe adapter metadata extractors for all accepted syntax surfaces.
- **`@nabla/components` (Phase 4)** — stable and accepted. Provides 11 React visual components (TaskStateCheckbox, WikiLink, Tag, Highlight, Emoji, FootnoteReference, FootnoteDefinition, Comment, Callout, Toggle, FoldedHeading), the editor-to-components bridge (`toComponentKind`, `toComponentProps`, `createComponentDescriptor`, `isBridgeKindSupported`), visual design tokens, playground, and fixture/regression tests.

## Source-of-Truth Rule

Plain text Markdown/Nabla Markdown+ is the only persistent document truth.

- Components are the rendering/view layer only.
- No hidden JSON embedded in saved files.
- No stored HTML as document format.
- No serialized component state as persistent source of truth.
- The app MUST NOT introduce a persistence format other than Markdown-compatible plain text.
- The app MUST save document content through the canonical pipeline.

All derived layers (AST, editor document, rendered UI, workspace indexes) are ephemeral and MUST NOT be stored as the canonical document format.

## What Phase 5 May Implement

- App package skeleton (`packages/app/`).
- Dev server for local development and preview.
- App shell with minimal layout (header, content area, optional sidebar).
- Document viewer/editor MVP:
  - Load a sample Markdown/Nabla document from a local source.
  - Render the parsed document using `@nabla/components`.
  - Perform minimal source editing through the `@nabla/editor` adapter.
  - Export/save canonical Markdown through the existing save pipeline.
- Component rendering integration — wire bridge descriptors to component instances.
- Editor save/export path integration.
- Workspace document index integration, if safe.
- Diagnostics display panel.
- Minimal routing/layout if needed for multi-view navigation.
- Visual polish pass for the app shell.
- App-level fixture/regression coverage.
- API/boundary consistency audit.

## What Phase 5 Must Not Implement

- Cloud sync.
- Database persistence.
- User accounts / authentication.
- Collaboration / real-time editing.
- AI features.
- Production deployment infrastructure.
- Tooltip rendering if the tooltip markup extension (`packages/markup/src/extensions/tooltips.ts`) is still absent.
- Transclusion embedded rendering unless explicitly tasked (blocked by tooltip extension dependency and workspace/editor bridge readiness).
- Full design system polish beyond minimal app-level styling.
- Plugin/marketplace system.
- Code execution.
- MathLive rendering.
- Advanced PDF export.

## MVP Definition

The Phase 5 MVP is achieved when:

1. A user can open the app in a browser (dev server).
2. The app displays a sample Markdown/Nabla document.
3. Accepted visual components render correctly (task states, wiki links, tags, highlights, emoji, footnotes, comments, callouts, toggles, folded headings).
4. The user can edit the document source through the editor adapter.
5. The app can export/save canonical Markdown through the `@nabla/markup` save pipeline.
6. No hidden JSON or HTML is stored as a document format.
7. All existing Phase 1–4 tests remain passing.

## Phase Gate Rules

1. P5-000 (this task) must be committed and audit-bundled before P5-001 can start.
2. Each task must produce an implementation commit and a separate audit-bundle commit.
3. Tasks MUST be executed in backlog order unless a task is explicitly marked as blocked/deferred.
4. A task may not modify files that another active task owns.
5. Phase 5 is done when all accepted tasks pass their gates and the final validation report is accepted.
6. Phase 5 exit criteria:
   - App package exists and builds.
   - Dev server starts and serves the app.
   - App shell renders with component integration.
   - Document loads, renders, and saves through the canonical pipeline.
   - All existing Phase 1–4 tests remain passing.
   - No parser/serializer/workspace/editor source modifications outside of explicit integration tasks.
   - Final review approved.
   - Git tree clean.

## Validation Expectations

- `pnpm test` — all existing Phase 1–4 tests must remain passing.
- `pnpm test:markup` — Phase 1 tests must remain passing.
- `pnpm test:workspace` — Phase 2 tests must remain passing.
- `node --test packages/editor/tests/**/*.test.mjs` — Phase 3 editor tests must remain passing.
- `node --test packages/components/tests/**/*.test.mjs` — Phase 4 component tests must remain passing.
- `pnpm typecheck` — no type errors across all packages.
- `pnpm build` — all packages (markup, workspace, editor, components, app) must build.
- `pnpm validate:fixtures` — fixture validation must pass.
- `pnpm validate:spec-version` — spec version validation must pass.
- `pnpm check:boundaries` — no boundary violations.
- `pnpm lint` — no lint errors.
- Git tree clean.

## Risk List

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R5.1 | **App dev server complexity** — integrating Vite/React with the monorepo may require non-trivial configuration | Medium | Use existing playground Vite config as reference; keep app dev server minimal |
| R5.2 | **Editor runtime integration** — wiring ProseMirror node views to components via the bridge is untested | High | Implement as a focused integration task; test with a minimal sample document first |
| R5.3 | **Workspace resolver in browser** — `@nabla/workspace` uses Node.js file system; browser integration may need adapter | Medium | Scope workspace integration to safe operations; document browser limitations |
| R5.4 | **Scope creep** — app MVP may tempt additional UI features | Medium | Strict allowed/forbidden file lists per task; defer non-MVP features |
| R5.5 | **Tooltip dependency** — cannot implement tooltip rendering without markup extension | Low | Document as blocked; proceed without tooltip rendering |
| R5.6 | **Transclusion rendering dependency** — requires tooltip extension and stable bridge | Low | Document as deferred; implement after core app MVP |

## Recommendation

**Phase 5 can start after P5-000.**

All four dependency packages are stable and accepted. The architecture and dependency rules are well-defined in the spec pack. The MVP scope is clear and achievable. Risks are manageable with strict task boundaries, explicit integration tasks, and the same audit/validation workflow used in Phases 1–4.

Proceed to P5-001 (app package skeleton) after this kickoff and backlog are committed and audit-bundled.
