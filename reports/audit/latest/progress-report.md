# Implementation Progress Report

## Phase

Phase 1 - `@nabla/markup`

## Task ID

`P1-023 GFM table alignment`

## Branch

`phase-1-markup-core`

## Status

GFM table alignment AST verified against the checked-in fixture contract (P1-023).

The `gfm-tables/alignment` fixture covers left (`:---`), center (`:---:`), and right (`---:`) alignment in a single 3-column table. The `align` property on the table AST node correctly stores `["left", "center", "right"]`. Serialization round-trips the alignment separators correctly.

Additionally, a table block ID bug was fixed: `buildTableNode` was missing the `nablaBlockIdOwnLine` propagation, and the serializer silently dropped block IDs on tables when `isOwnLine` was falsy.

All 68 tests pass (66 for P1-022 + 1 GFM table alignment fixture + 1 table block ID fixture).

## Scope Guardrails

- No workspace/editor/components/app
- No workspace-level file resolution
- No actual embedded rendering
- No fixture changes
- No spec changes

## Files Modified

- `packages/markup/src/parser.ts` — passed `nablaBlockIdOwnLine` 5th argument to `buildTableNode`
- `packages/markup/src/serializer.ts` — fixed fallthrough to append block ID inline when `isOwnLine` is falsy on tables

## Verification Summary

- `node --test packages/markup/tests/**/*.test.mjs` — 68 tests pass
- `tsc -b --pretty false packages/markup/tsconfig.json` — typecheck passed
- `tsc -b packages/markup/tsconfig.json` — build passed
- `node scripts/create-audit-bundle.mjs --task P1-023 --base 47a9236 --head HEAD` — audit bundle written

## Active Blockers

None.

## Next Recommended Task

P1-024 full fixture regression
