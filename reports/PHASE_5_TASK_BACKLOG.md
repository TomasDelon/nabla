# Phase 5 Task Backlog — `@nabla/app`

## Ordered Tasks

### P5-001 — App Package Skeleton

| Field | Value |
|---|---|
| **Title** | App package skeleton |
| **Goal** | Create `packages/app/` with `package.json`, `tsconfig.json`, minimal `src/index.ts` entry, and verify it builds in the monorepo. Do not implement any app shell or UI yet. |
| **Allowed files** | `packages/app/`, `root package.json` or `tsconfig.json` if workspace config is needed |
| **Forbidden files** | `packages/markup/**`, `packages/workspace/**`, `packages/editor/**`, `packages/components/**`, `specs/**`, `reports/PHASE_5_KICKOFF.md`, `reports/PHASE_5_TASK_BACKLOG.md` |
| **Acceptance criteria** | `pnpm build` includes `packages/app`; `packages/app/package.json` declares `@nabla/markup` as dependency; `pnpm typecheck` passes with app tsconfig included |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm validate:fixtures`, `pnpm check:boundaries` |
| **Hard stops** | Do not implement React node views or app shell in this task. Do not modify Phase 1–4 source. |

---

### P5-002 — App Dev Server and Minimal Shell

| Field | Value |
|---|---|
| **Title** | App dev server and minimal shell |
| **Goal** | Set up a Vite dev server for the app and create a minimal HTML/React shell. The shell should display a placeholder page to confirm the server works. Use `packages/components/playground/` as a reference. |
| **Allowed files** | `packages/app/` (excluding module source), `packages/components/playground/vite.config.ts` (read-only reference) |
| **Forbidden files** | `packages/markup/**`, `packages/workspace/**`, `packages/editor/**`, `packages/components/src/**`, `specs/**` |
| **Acceptance criteria** | `pnpm dev:app` (or equivalent) starts a dev server; browser shows a page; no errors in console |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test` |
| **Hard stops** | Do not implement document loading or component rendering yet. Shell only. |

---

### P5-003 — Sample Document Source Loading

| Field | Value |
|---|---|
| **Title** | Sample document source loading |
| **Goal** | Implement a mechanism to load a sample Markdown/Nabla document string into the app. The document can be a hardcoded string or loaded from a local file via import. The loaded source is available to the app state. |
| **Allowed files** | `packages/app/src/` |
| **Forbidden files** | `packages/markup/**`, `packages/workspace/**`, `packages/editor/**`, `packages/components/src/**`, `specs/**` |
| **Acceptance criteria** | App can load a sample Nabla document source as a string; tests verify the source is accessible |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test` |
| **Hard stops** | Do not implement file system loading yet. Use hardcoded or imported sample content. |

---

### P5-004 — Markdown/Nabla Render Pipeline Integration

| Field | Value |
|---|---|
| **Title** | Markdown/Nabla render pipeline integration |
| **Goal** | Wire the loaded Markdown source through `@nabla/markup` parser and serialize the result to verify the roundtrip. Display the parsed AST or a simple text rendering of the document to confirm the pipeline works. |
| **Allowed files** | `packages/app/src/` |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/**`, `packages/editor/**`, `packages/components/src/**`, `specs/**` |
| **Acceptance criteria** | App can parse sample source via `@nabla/markup`; roundtrip (parse → serialize) produces stable output |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm validate:fixtures` |
| **Hard stops** | Do not modify parser/serializer. Consume `@nabla/markup` APIs only. |

---

### P5-005 — Component Rendering Integration

| Field | Value |
|---|---|
| **Title** | Component rendering integration |
| **Goal** | Wire the `@nabla/components` bridge to render visual components in the app for at least one syntax surface (e.g., task states). Use `toComponentKind` and `toComponentProps` to map editor metadata to component props, then render using the component registry or direct component imports. |
| **Allowed files** | `packages/app/src/`, `packages/components/tests/bridge.test.mjs` (read-only reference) |
| **Forbidden files** | `packages/markup/**`, `packages/workspace/**`, `packages/editor/**`, `packages/components/src/**` (read-only), `specs/**` |
| **Acceptance criteria** | App renders at least one visual component correctly from parsed document metadata |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `node --test packages/components/tests/**/*.test.mjs` |
| **Hard stops** | Do not modify components source or bridge. Consume bridge APIs only. |

---

### P5-006 — Editor Source Editing MVP

| Field | Value |
|---|---|
| **Title** | Editor source editing MVP |
| **Goal** | Integrate `@nabla/editor` to allow editing the loaded document source. Use `createEditor()` and `loadSource()` to create an editor instance, display the source in a text area or simple editor view, and allow the user to modify it. Wire the save pipeline (`getSource()` → parser → serializer) for export. |
| **Allowed files** | `packages/app/src/` |
| **Forbidden files** | `packages/markup/src/**`, `packages/workspace/**`, `packages/editor/src/**` (read-only), `packages/components/src/**` (read-only), `specs/**` |
| **Acceptance criteria** | App loads source into editor; user can modify source; app can export canonical Markdown through the save pipeline |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm validate:fixtures` |
| **Hard stops** | Do not modify editor source. Consume `@nabla/editor` APIs only. Do not implement rich-text ProseMirror editing yet — plain text or simple editing view is acceptable for MVP. |

---

### P5-007 — Workspace Document Index Integration (Conditional)

| Field | Value |
|---|---|
| **Title** | Workspace document index integration |
| **Goal** | Integrate `@nabla/workspace` to index the loaded document(s) and display basic workspace metadata (wiki link resolution, backlinks). This task is conditional on browser-compatible workspace APIs. If `@nabla/workspace` requires Node.js file system and is not browser-compatible, defer to a later phase. |
| **Allowed files** | `packages/app/src/`, `packages/workspace/src/` (read-only reference) |
| **Forbidden files** | `packages/markup/**`, `packages/editor/**`, `packages/components/src/**`, `specs/**` |
| **Acceptance criteria** | Workspace indexes the loaded document; resolved links and backlinks are displayed or logged; or a clear incompatibility report is written |
| **Gates** | `pnpm build`, `pnpm typecheck`, `pnpm test:workspace`, `pnpm validate:fixtures` |
| **Hard stops** | Do not modify workspace source. Consume `@nabla/workspace` APIs only. If browser-incompatible, document and defer. |

---

### P5-008 — App Visual Polish Pass

| Field | Value |
|---|---|
| **Title** | App visual polish pass |
| **Goal** | Improve the app shell visual presentation: layout, typography, spacing, component integration polish. Keep the app minimal but product-like. Reference the Phase 4 playground polish (P4-008B) style. |
| **Allowed files** | `packages/app/src/` |
| **Forbidden files** | `packages/markup/**`, `packages/workspace/**`, `packages/editor/**`, `packages/components/src/**`, `specs/**` |
| **Acceptance criteria** | App shell looks clean and readable; components render with consistent spacing and alignment |
| **Gates** | `pnpm build`, `pnpm typecheck` |
| **Hard stops** | Do not modify components CSS or TSX. Do not modify parser/serializer/workspace/editor. |

---

### P5-009 — App Fixture/Regression Coverage

| Field | Value |
|---|---|
| **Title** | App fixture/regression coverage |
| **Goal** | Create app-level fixtures and regression tests. Tests should verify that the app correctly loads, parses, renders, and saves documents without producing hidden JSON or HTML. Fixtures are plain JSON files in `packages/app/fixtures/`. |
| **Allowed files** | `packages/app/fixtures/`, `packages/app/tests/` |
| **Forbidden files** | `packages/markup/**`, `packages/workspace/**`, `packages/editor/**`, `packages/components/**`, `specs/**` |
| **Acceptance criteria** | App fixture tests pass, covering document load → render → save roundtrip |
| **Gates** | `pnpm test`, `pnpm build`, `pnpm typecheck`, `pnpm validate:fixtures` |
| **Hard stops** | Do not modify component/editor/workspace source. App-level fixtures only. |

---

### P5-010 — App API/Boundary Consistency

| Field | Value |
|---|---|
| **Title** | App API/boundary consistency |
| **Goal** | Audit the public API surface of `@nabla/app` and verify boundary compliance. No Phase 1–4 package internals should be exposed through the app public API. |
| **Allowed files** | `packages/app/src/index.ts`, `packages/app/tests/` |
| **Forbidden files** | `packages/markup/**`, `packages/workspace/**`, `packages/editor/**`, `packages/components/**`, `specs/**` |
| **Acceptance criteria** | App public API exports only intended app-level functions/components; no parser/serializer/workspace/editor internals leak |
| **Gates** | `pnpm typecheck`, `pnpm check:boundaries`, `pnpm build` |
| **Hard stops** | Do not modify Phase 1–4 packages. |

---

### P5-011 — Phase 5 Validation Report

| Field | Value |
|---|---|
| **Title** | Phase 5 validation report |
| **Goal** | Write `reports/PHASE_5_VALIDATION.md` documenting the completion status of all Phase 5 tasks, quality gate results, deferred scope, and a phase verdict. |
| **Allowed files** | `reports/PHASE_5_VALIDATION.md`, `reports/IMPLEMENTATION_PROGRESS.md` |
| **Forbidden files** | All source files; all spec files |
| **Acceptance criteria** | Report exists, all gates pass, deferred scope is documented, verdict is stated |
| **Gates** | Full gate suite (`pnpm test`, `pnpm test:markup`, `pnpm test:workspace`, `pnpm typecheck`, `pnpm build`, `pnpm validate:fixtures`, `pnpm validate:spec-version`, `pnpm check:boundaries`, `pnpm lint`, `git status --short`) |
| **Hard stops** | Do not modify any source or spec files. Documentation only. |

---

## Blocked/Deferred Tasks

The following areas are identified as blocked or deferred from Phase 5 scope:

| Area | Reason | Would-be task |
|---|---|---|
| Tooltip rendering | Tooltip extension (`packages/markup/src/extensions/tooltips.ts`) not implemented | Post-P5 or Phase 6 |
| Transclusion embedded rendering | Requires stable tooltip extension and workspace/editor bridge integration | Post-P5 or Phase 6 |
| Database persistence | Not scoped for MVP | Post-Phase 5 |
| User accounts / auth | Not scoped for MVP | Post-Phase 5 |
| Collaboration | Not scoped for MVP | Post-Phase 5 |
| AI features | Not scoped for MVP | Post-Phase 5 |
| Production deployment | Not scoped for MVP | Post-Phase 5 |

## Non-Negotiable Rules

1. Plain text Markdown/Nabla Markdown+ is the only persistent source of truth.
2. No hidden JSON, no stored HTML, no serialized editor/app state as source of truth.
3. No parser/serializer modifications unless explicitly scoped.
4. No workspace modifications unless explicitly scoped.
5. No component modifications unless explicitly scoped.
6. No editor modifications unless explicitly scoped.
7. If behavior is missing or contradictory, stop and write a missing-spec report.
8. Each task must produce an implementation commit and a separate audit-bundle commit.
