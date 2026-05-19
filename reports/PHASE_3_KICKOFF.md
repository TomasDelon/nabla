# Phase 3 Kickoff — `@nabla/editor`

## Phase 3 Objective

Integrate Nabla Markdown+ with a visual editing environment via Milkdown/ProseMirror. The editor is an adapter layer — it is not a source of truth, not a parser, and not a serializer. Its job is to load Markdown source into an editable ProseMirror document, render Nabla extensions as visual nodes, capture user edits, and funnel saved content through the `@nabla/markup` parser + serializer pipeline for canonical storage.

## Package Target

`@nabla/editor` — a new package under `packages/editor/`.

Dependency direction:

- `@nabla/editor` MAY depend on `@nabla/markup`.
- `@nabla/editor` MAY depend on Milkdown, ProseMirror, and React.
- `@nabla/editor` MAY depend on `@nabla/components` (Phase 4, not available yet — defer node views that would live in components).
- `@nabla/editor` MUST NOT depend on `@nabla/app`.
- `@nabla/editor` MUST NOT define grammar that belongs in `@nabla/markup`.

## Dependency Assumptions from Phase 1 and Phase 2

- `@nabla/markup` (Phase 1) is stable and accepted. The parser produces `NablaDocument` AST, the serializer emits canonical Markdown source, and diagnostic codes are defined.
- `@nabla/workspace` (Phase 2) is stable and accepted. Workspace indexing, wiki link resolution, transclusion resolution, backlinks, and workspace diagnostics are available.
- The `packages/markup/src/` and `packages/workspace/src/` public API surfaces are frozen for Phase 3 consumption.
- Parser modes (`strict` / `tolerant`) exist. The editor should operate in strict mode by default.
- The save pipeline (`editor export → @nabla/markup parser → @nabla/markup serializer → saved source`) is the canonical write path.

## Source-of-Truth Rule

**Plain text Markdown/Nabla Markdown+ is the only persistent document truth.**

All derived layers (AST, editor document, rendered UI, workspace indexes) are ephemeral and MUST NOT be stored as the canonical document format.

## Explicit Forbidden Sources of Truth

- **Hidden JSON**: MUST NOT embed JSON in the saved Markdown file (e.g., no frontmatter-based editor state, no base64-encoded node attributes).
- **Stored HTML**: MUST NOT save rendered HTML as the document format. The editor export goes through parser → serializer.
- **Editor state**: ProseMirror state (selection, decorations, meta) MUST NOT be serialized into the persistent document. Fold states are the exception — they update source markers (`[!type]` fold, `#>`/`#v` fold, `<details>` open/close) but do NOT store state as separate metadata.

## Editor Constraints Extracted from Specs

### From `07_EDITOR_BEHAVIOR.md`

- Task states render as distinct checkbox states; changing state updates the source marker.
- Wiki links render as internal links; missing links show missing state.
- Transclusions are block-only, read-only, embedded blocks; errors (missing target, cycle, depth limit) are visible.
- Tags render as pills.
- Block IDs render as subtle anchors; copy block reference action is supported.
- Callouts render as visual blocks; unknown type uses generic style; fold state changes update source.
- Toggles: closed hides children, open shows children; fold changes update source.
- Folded headings: closed hides section content to next heading of same/higher depth; parent closed hides all nested children.
- Tooltips: subtle affordance; hover/click reveals tooltip.
- Highlights: simple uses default style; color highlight uses specified hex.
- Emoji shortcodes: known → emoji; unknown → source text.
- Comments: private comments hidden in reading mode, muted in edit mode.
- Footnotes: references render as markers; definitions render at source position.
- No kbd rendering, no generic components, no MathLive, no code execution.

### From `02_ARCHITECTURE.md`

- Editor adapter contract: `editor document → Markdown string → Nabla parser → Nabla serializer → saved source`.
- Editor MUST NOT save rendered HTML.
- Unsupported Markdown MUST be preserved when possible.
- Protected regions MUST remain literal.
- Editor export is intermediate, not trusted final source.
- Before saving, exported Markdown MUST be parsed by `@nabla/markup` and serialized by canonical serializer.
- If export loses a construct, adapter MUST emit `NABLA_EDITOR_EXPORT_LOSS` diagnostic.
- SHOULD keep original-source snapshot while file is open for source-preservation tests.

### From `05_PARSER_SERIALIZER.md`

- Default parser mode is `strict`.
- Tolerant mode is for import/migration, not canonical writing.

### From `14_DIAGNOSTICS.md`

- `NABLA_EDITOR_EXPORT_LOSS` (severity: error) — emitted when editor Markdown export lost a source construct before save.

## Known Deferred Scope from Previous Phases

Phase 3 MUST NOT silently solve these unless explicitly tasked:

1. **`sourcePositionPolicy`** — deferred from Phase 2. Not needed for editor adapter skeleton.
2. **Transclusion cycle path array** — deferred from Phase 2. Editor only needs to show cycle error, not the path.
3. **Transclusion depth-limit metadata** (`maxDepth` / `stoppedAt`) — deferred from Phase 2. Editor only needs depth-limit error signal.
4. **Inline transclusion resolution** — parser-blocked (inline `![[...]]` emits `NABLA_TRANSCLUSION_INLINE_UNSUPPORTED`). Editor MUST NOT implement inline transclusion rendering.
5. **Exact diagnostic message text** — deferred from Phase 2. Editor uses diagnostic codes, not exact message text, for display.
6. **Tooltip extension** (`packages/markup/src/extensions/tooltips.ts`) — not implemented in Phase 1. Editor SHOULD render tooltips via generic means only when the extension exists.
7. **conflicts/inline-html fixture** — deferred from Phase 1. Editor SHOULD handle loss diagnostics when inline HTML is not roundtripped.
8. **Phase 4 `@nabla/components`** — not available. Editor MUST implement inline node views/marks directly in `packages/editor/src/` without delegating to a components package that does not exist yet.

## Phase Gate Rules

1. P3-000 (this task) must be committed and audit-bundled before P3-001 can start.
2. Each task must produce an implementation commit and a separate audit-bundle commit.
3. Tasks MUST be executed in backlog order unless a task is explicitly marked as blocked/deferred.
4. A task may not modify files that another active task owns (single-writer rule per `29_PARALLELISM_POLICY.md`).
5. Phase 3 is done when all accepted tasks pass their gates and a final validation report (P3-010) is accepted.
6. Phase 3 exit criteria (from `27_PHASE_ACCEPTANCE_CRITERIA.md`):
   - Editor loads source.
   - Editor saves through parser + serializer.
   - Source preservation tests pass.
   - Fold commands update source.
   - `NABLA_EDITOR_EXPORT_LOSS` tested.
   - Final review approved.
   - Git tree clean.

## Validation Expectations

- `pnpm test` — all existing Phase 1 and Phase 2 tests must remain passing.
- `pnpm test:markup` — Phase 1 tests must remain passing.
- `pnpm test:workspace` — Phase 2 tests must remain passing.
- `pnpm typecheck` — no type errors across all packages.
- `pnpm build` — all packages (markup, workspace, editor) must build.
- `pnpm validate:fixtures` — fixture validation must pass.
- `pnpm validate:spec-version` — spec version validation must pass.
- `pnpm check:boundaries` — no boundary violations (editor MUST NOT import components/app, MUST NOT define grammar).
- `pnpm lint` — no lint errors (once linter is available).
- Editor-specific tests (source preservation, export loss, fold commands) must pass.

## Risk List

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R3.1 | **Milkdown/Crepe version incompatibility** — chosen editor framework may not support all required ProseMirror plugin hookups | High | Start with minimal Milkdown setup; test basic load/save before adding Nabla features |
| R3.2 | **Source fidelity loss on save** — Milkdown Markdown export normalizes or drops Nabla constructs | High | Save pipeline through parser+serializer; `NABLA_EDITOR_EXPORT_LOSS` diagnostic; original-source snapshot |
| R3.3 | **Fold state sync bugs** — editor fold state and source fold markers desynchronize | Medium | Test fold → save → reload → verify fold state in serialized source |
| R3.4 | **Protected region leakage** — editor exposes Nabla syntax inside code/HTML blocks | Medium | Protected region tests in editor context; verify roundtrip preserves literal content |
| R3.5 | **Scope creep into components/app** — implementing node views that belong in Phase 4 | Medium | Strict allowed/forbidden file lists per task; boundary checks |
| R3.6 | **No existing Milkdown Nabla plugin ecosystem** — all Nabla node views must be custom | High | Budget time for ProseMirror node view development; start with simple text-based nodes |
| R3.7 | **Ambiguous spec for visual rendering** — `07_EDITOR_BEHAVIOR.md` describes intent but not pixel-level UI | Low | Implement spec-compliant behavior; open issues for design refinement |
| R3.8 | **Parser/serializer changes needed** — editor work may reveal parser gaps that require changes to `@nabla/markup` | Medium | If a parser/serializer bug is found, file a separate task; do not fix outside task scope |

## Recommendation

**Phase 3 can start after P3-000.**

The spec pack and implementation control pack provide sufficient guidance for the editor adapter architecture. The deferred scope from Phase 1 and Phase 2 is well-documented and does not block editor skeleton work. All risks are manageable with clear task boundaries, the save-pipeline pattern, and strict gate enforcement.

Proceed to P3-001 (editor package skeleton) after this kickoff is committed and audit-bundled.
