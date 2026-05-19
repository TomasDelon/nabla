# Implementation Progress Report

## Phase

Phase 2 — `@nabla/workspace`

## Task ID

`P2-004` — block ID index

## Branch

`p2-004-block-id-index`

## Status

Block ID index extraction implemented.

### What was done

- Created `packages/workspace/src/block-index.ts` — `buildBlockIndex()` function that:
  - Walks parsed AST children to extract `data.nablaBlockId` from block-level nodes
  - Supports paragraphs, headings, foldable headings, list items, callouts, toggles, transclusions, tables
  - Recursively traverses nested structures (callouts > toggles > paragraphs, etc.)
  - Detects duplicate block IDs within the input and emits `NABLA_BLOCK_ID_DUPLICATE` diagnostics
- Updated `packages/workspace/src/index.ts` — re-exports `buildBlockIndex` and `BlockIndexResult`
- Created `packages/workspace/tests/block-id.test.mjs` — 13 tests covering:
  - All supported block-level node types
  - Nested traversal
  - Duplicate detection (single and multiple)
  - Edge cases (empty input, non-attachable types, nodes without IDs)

## Files Created

- `packages/workspace/src/block-index.ts` — block ID index implementation
- `packages/workspace/tests/block-id.test.mjs` — block ID index tests
- `packages/workspace/tests/helpers/load-ts-module.mjs` — test helper (copied from markup)

## Files Modified

- `packages/workspace/src/index.ts` — added exports for block index
- `reports/IMPLEMENTATION_PROGRESS.md` — this report

## Scope Guardrails

- No `@nabla/markup` behavior changes
- No spec or fixture modifications
- No changes to forbidden files

## Verification

- `pnpm test` — markup tests pass
- `pnpm test:workspace` — workspace tests pass
- `pnpm test:markup` — markup tests pass
- `pnpm typecheck` — type check passes
- `pnpm build` — build passes
- `pnpm validate:fixtures` — fixture validation passes
- `pnpm validate:spec-version` — spec version validation passes
- `pnpm check:boundaries` — boundary check passes
- `pnpm lint` — lint passes

## Audit Bundle

See `audit-bundles/P2-004/` for the full audit bundle.

## Next Recommended Task

P2-005 — heading index
