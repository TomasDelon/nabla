# Implementation Progress Report

## Phase

Phase 1 - `@nabla/markup`

## Task ID

`P1-018 toggles`

## Branch

`phase-1-markup-core`

## Status

Toggle parsing and serialization implemented against checked-in fixture contracts (P1-018).

All 5 toggle fixture groups pass:
- `toggles/basic` — `]>` closed and `]v` open toggles with tab-indented children
- `toggles/empty` — toggle with no title text or children
- `toggles/blank-child` — toggle with blank-line-separated children
- `toggles/fenced-child` — fenced code block as a child inside a toggle
- `toggles/nested-child` — callout as a child inside a toggle

Callout fixtures (P1-017) remain passing. `callouts/nested-child` now also passes since it depends on toggle child nesting.

## Scope Guardrails

- No workspace/editor/components/app
- No spec changes
- No fixture changes

## Files Created

- `packages/markup/src/extensions/toggles.ts`

## Files Modified

- `packages/markup/src/extensions/callouts.ts` — added `serializeToggle` and toggle child handling in `serializeChildBlock`
- `packages/markup/src/parser.ts` — `ToggleNode` import, `parseToggleMarker` import, `kind: "toggle"` BlockSpec, toggle detection in `parseBlocks`, `block.kind === "toggle"` handling in `parse()`
- `packages/markup/src/serializer.ts` — `ToggleNode` import, `serializeToggle` import, `node.type === "toggle"` dispatch in `serializeBlockNode`
- `packages/markup/tests/wiki-links.test.mjs` — 5 toggle fixture IDs and fixture-driven test; re-added `callouts/nested-child` to callout fixture IDs
- `reports/IMPLEMENTATION_PROGRESS.md` — this update

## Verification Summary

- `node --test packages/markup/tests/**/*.test.mjs` — 62 tests pass (5 toggle + 7 callout fixture tests)
- `tsc -b --pretty false packages/markup/tsconfig.json` — typecheck passed
- `node scripts/validate-fixtures.mjs` — fixture validation passed
- `node scripts/validate-spec-version.mjs` — spec version validation passed
- `node scripts/check-boundaries.mjs` — boundary check passed
- `node scripts/report-unavailable.mjs lint` — lint unavailable (bootstrap placeholder)
- `tsc -b packages/markup/tsconfig.json` — build passed

## Active Blockers

None.

## Next Recommended Task

P1-019 folded headings
