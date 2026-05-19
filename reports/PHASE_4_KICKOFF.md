# Phase 4 Kickoff — `@nabla/components`

## Phase 4 Objective

Implement reusable DOM-renderable visual components for all Nabla Markdown+ inline and block features. These components will be consumed by `@nabla/editor` (Phase 3) to render browser DOM node views, replacing the Node-safe adapter stubs (`node-safe-adapter` constants) with actual visual rendering.

Components are the rendering/view layer only. They must not define grammar, modify parser/serializer behavior, or store persistent state.

## Package Target

`@nabla/components` — a new package under `packages/components/`.

Dependency direction:

- `@nabla/components` MAY depend on `@nabla/markup` for type/marker constants.
- `@nabla/components` MAY depend on React and DOM APIs for visual rendering.
- `@nabla/components` MUST NOT depend on `@nabla/editor`, `@nabla/workspace`, or `@nabla/app`.
- `@nabla/components` MUST NOT define grammar that belongs in `@nabla/markup`.

## Dependency Assumptions from Phase 1, Phase 2, and Phase 3

- `@nabla/markup` (Phase 1) is stable and accepted. The parser produces `NablaDocument` AST, the serializer emits canonical Markdown source, and diagnostic codes are defined.
- `@nabla/workspace` (Phase 2) is stable and accepted. Workspace indexing, wiki link resolution, transclusion resolution, backlinks, and workspace diagnostics are available.
- `@nabla/editor` (Phase 3) is stable and accepted. The editor provides `createEditor()`, `loadSource()`, `getSource()`, source preservation, fold commands, and Node-safe adapter stubs for all node view types. The editor currently uses `"node-safe-adapter"` constants instead of real DOM node views.
- The save pipeline (`editor export → @nabla/markup parser → @nabla/markup serializer → saved source`) is the canonical write path. Components must not bypass this pipeline.
- The `07_EDITOR_BEHAVIOR.md` spec defines visual rendering expectations for all features, but does not specify pixel-level UI. Phase 4 implements spec-compliant visual behavior with reasonable default styling.

## Source-of-Truth Rule

**Plain text Markdown/Nabla Markdown+ is the only persistent document truth.**

- Components are the rendering/view layer only.
- No hidden JSON embedded in saved files.
- No stored HTML as document format.
- No serialized component state as persistent source of truth.
- Component state (e.g., open/closed toggle, expanded fold) is ephemeral and not persisted; fold states persist through source markers (`[!type]>` / `[!type]v`, `]>` / `]v`, `#>` / `#v`) managed by the editor, not by components.

All derived layers (AST, editor document, rendered UI, workspace indexes) are ephemeral and MUST NOT be stored as the canonical document format.

## What Phase 4 May Implement

- Browser DOM visual node views as React components.
- Reusable NablaMark+ component primitives (inline and block).
- Visual callouts with fold state rendering.
- Visual toggles with fold state rendering.
- Visual folded headings with fold state rendering.
- Visual task state checkboxes (unchecked, checked, cancelled, important).
- Visual wiki link rendering (internal links, missing state, aliases).
- Visual tag pills.
- Visual highlight rendering (simple and color).
- Visual emoji shortcode rendering (known shortcodes as emoji glyphs).
- Visual footnote reference markers and definition rendering.
- Visual comment rendering (muted in edit mode, hidden in reading mode).
- Minimal styling/token system for consistent visual appearance.
- Editor-to-components bridge that maps editor adapter node view types to component implementations.

## What Phase 4 Must Not Implement

- Parser/serializer changes (`packages/markup/src/` MUST NOT be modified).
- Workspace resolver changes (`packages/workspace/src/` MUST NOT be modified).
- Editor source changes unless an explicit bridge task allows it.
- App shell, routing, or full UI layout.
- Persistence layer or storage.
- Full `@nabla/app` integration (Phase 5).
- Tooltip rendering if `packages/markup/src/extensions/tooltips.ts` is still absent (blocked).
- Inline transclusion rendering (parser-blocked, always emits `NABLA_TRANSCLUSION_INLINE_UNSUPPORTED`).
- Block ID editing or clipboard copy-reference action.
- Color picker, emoji picker, tag suggestion UI.
- Footnote panel UI (deferred to future Phase).

## Deferred/Blocked Scope from Phase 3

The following areas remain deferred from Phase 3 and are candidates for Phase 4:

| Area | Status for Phase 4 |
|---|---|
| Visual callout rendering | IMPLEMENT in Phase 4 (fold state commands exist from P3-012) |
| Visual toggle rendering | IMPLEMENT in Phase 4 (fold state commands exist from P3-012) |
| Visual folded-heading rendering | IMPLEMENT in Phase 4 (fold state commands exist from P3-012) |
| Visual task state rendering | IMPLEMENT in Phase 4 (task state helpers exist from P3-007) |
| Visual wiki link rendering | IMPLEMENT in Phase 4 (wiki link helpers exist from P3-008) |
| Visual tag/highlight rendering | IMPLEMENT in Phase 4 (helpers exist from P3-009) |
| Visual emoji rendering | IMPLEMENT in Phase 4 (helpers exist from P3-010) |
| Visual footnote/comment rendering | IMPLEMENT in Phase 4 (helpers exist from P3-011) |
| Transclusion embedded rendering | BLOCKED — requires stable editor-to-components bridge and workspace resolver integration |
| Tooltip rendering | BLOCKED — tooltip markup extension (`packages/markup/src/extensions/tooltips.ts`) not implemented |
| `@nabla/app` integration | Phase 5 — not started |
| Browser DOM visual node views | IMPLEMENT in Phase 4 |
| Block ID copy-reference action | DEFERRED — low priority, requires clipboard API |

## Phase Gate Rules

1. P4-000 (this task) must be committed and audit-bundled before P4-001 can start.
2. Each task must produce an implementation commit and a separate audit-bundle commit.
3. Tasks MUST be executed in backlog order unless a task is explicitly marked as blocked/deferred.
4. A task may not modify files that another active task owns (single-writer rule per Phase 3 kickoff `29_PARALLELISM_POLICY.md`).
5. Phase 4 is done when all accepted tasks pass their gates and a final validation report (P4-015) is accepted.
6. Phase 4 exit criteria:
   - Components package exists and builds.
   - Visual components exist for all accepted Nabla syntax surfaces.
   - Editor can consume components via bridge.
   - All existing Phase 1/2/3 tests remain passing.
   - No parser/serializer modifications.
   - No workspace modifications.
   - Final review approved.
   - Git tree clean.

## Validation Expectations

- `pnpm test` — all existing Phase 1 and Phase 2 tests must remain passing.
- `pnpm test:markup` — Phase 1 tests must remain passing.
- `pnpm test:workspace` — Phase 2 tests must remain passing.
- `node --test packages/editor/tests/**/*.test.mjs` — all Phase 3 editor tests must remain passing.
- `pnpm typecheck` — no type errors across all packages.
- `pnpm build` — all packages (markup, workspace, editor, components) must build.
- `pnpm validate:fixtures` — fixture validation must pass.
- `pnpm validate:spec-version` — spec version validation must pass.
- `pnpm check:boundaries` — no boundary violations.
- `pnpm lint` — no lint errors (once linter is available).
- Git tree clean.

## Risk List

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R4.1 | **Component-editor bridge complexity** — mapping editor node view types to components may require TypeScript gymnastics | Medium | Define a clear `ComponentAdapter` interface; stub before implementing full features |
| R4.2 | **Visual style ambiguity** — `07_EDITOR_BEHAVIOR.md` describes intent but not pixel-level UI | Low | Implement spec-compliant behavior with reasonable defaults; defer design polish |
| R4.3 | **React version conflicts** — editor may use a different React version than components | Medium | Lock React version in monorepo root or peer dependency |
| R4.4 | **Scope creep into editor/workspace** — implementing components may reveal gaps that tempt editor/workspace changes | Medium | Strict allowed/forbidden file lists per task; any gap must be filed as a separate task |
| R4.5 | **Tooltip dependency** — Phase 4 cannot implement tooltip rendering without the markup extension | Low | Document as blocked; proceed with other features |
| R4.6 | **Transclusion rendering dependency** — requires both workspace resolver and editor integration | Low | Document as deferred; implement after core component set |
| R4.7 | **Browser-only runtime** — components require DOM; testing requires jsdom or browser environment | Medium | Adopt a test strategy (e.g., Vitest with jsdom) that supports DOM rendering tests |

## Recommendation

**Phase 4 can start after P4-000.**

The spec pack and implementation control pack provide sufficient guidance for component architecture. The deferred scope from Phase 3 is well-documented and actionable for Phase 4. All risks are manageable with clear task boundaries and strict gate enforcement.

Proceed to P4-001 (components package skeleton) after this kickoff and backlog are committed and audit-bundled.
