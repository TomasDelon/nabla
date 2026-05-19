# Implementation Progress Report

## Phase

Phase 2 — `@nabla/workspace`

## Task ID

`P2-012` — workspace fixture shape alignment

## Branch

`p2-012-workspace-shape-alignment`

## Status

P2-012 completed: fixture-facing workspace shape alignment.

### Fixture Shape Alignment

Added `toWorkspaceFixtureShape(result)` in `packages/workspace/src/workspace.ts`
and exported it from `packages/workspace/src/index.ts`. The transformer preserves
the existing flat `workspace.index` API and adds a fixture-facing grouped shape for
comparisons.

Also added `ownerType` to block index entries so grouped block output can match the
fixture shape without changing parser behavior.

Updated `packages/workspace/tests/workspace-fixtures.test.mjs` and added
`packages/workspace/tests/workspace-shape.test.mjs` to cover grouped output.

| Fixture | Status | What is tested | Deferred |
|---|---|---|---|
| `resolution-basic` | PASSABLE | grouped `documents[]`, resolved `links`, resolved `transclusions`, headings, blocks with `ownerType`, backlinks | none for covered fields |
| `missing-target` | PASSABLE (partial) | grouped `missingLinks[]` from unresolved wiki links | `missingTransclusions[]` for this fixture because inline transclusion is parser-blocked; exact diagnostic message text |
| `backlink-position-optional` | PASSABLE | grouped `documents[]`, resolved note link, headings, backlinks | `sourcePositionPolicy` |
| `transclusion-cycle` | PASSABLE | existing cycle diagnostic emission, preserved resolutions | cycle path array (`["a.md", "b.md", "a.md"]`) |
| `transclusion-depth-limit` | PASSABLE | existing depth-limit diagnostic, resolution count (5 of 6 edges) | `maxDepth` output, `stoppedAt` |

### Focused Transformer Coverage

- `toWorkspaceFixtureShape` groups output per document.
- Resolved heading/block targets are mapped back from normalized workspace paths to
  original fixture file paths (for example `analyse` -> `analyse.md`).
- `missingLinks[]` is extracted from unresolved wiki link resolutions.
- `missingTransclusions[]` is extracted from unresolved transclusion resolutions when
  the resolver sees a transclusion node.

### Path Convention Note

Flat heading/block index entries still store normalized `filePath` values (no `.md`
extension). The fixture transformer bridges that by mapping normalized paths back to
original file paths in grouped fixture output.

### Deferred Behaviours (Exact Reasons)

1. **sourcePositionPolicy**: Not present in any output type or options interface.
2. **cycle path array**: Cycle detection emits a diagnostic but does not record the
   cycle path (`["a.md", "b.md", "a.md"]`).
3. **maxDepth output / stoppedAt**: maxDepth is configurable as input but not exposed
   as output; the file stopped at is not tracked.
4. **inline transclusion resolution**: The parser emits `TRANSCLUSION_INLINE_UNSUPPORTED`
   for inline transclusions and never produces a transclusion node, so the resolver
   cannot process them.
5. **diagnostic message text**: Actual messages include the target name
   ("Note target not found: missing") while fixture messages are generic
   ("Wiki link target does not exist.").

### Scope Guardrails

- No `@nabla/markup` behavior changes
- No spec or fixture modifications
- No new feature implementation beyond fixture coverage
- No broad refactor

## Verification Summary

- `pnpm test` — PASS
- `pnpm test:workspace` — PASS
- `pnpm test:markup` — PASS
- `pnpm typecheck` — PASS
- `pnpm build` — PASS
- `pnpm validate:fixtures` — PASS
- `pnpm validate:spec-version` — PASS
- `pnpm check:boundaries` — PASS
- `pnpm lint` — unavailable (expected)

## Active Blockers

None.

## Next Recommended Task

Next Phase 2 workspace task per project roadmap.
