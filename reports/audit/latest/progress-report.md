# Implementation Progress Report

## Phase

Phase 1 - `@nabla/markup`

## Task ID

`P1-017 callouts`

## Branch

`phase-1-markup-core`

## Status

Callout parsing and serialization implemented against checked-in fixture contracts (P1-017).

All 6 callout fixture groups pass:
- `callouts/canonical` — standard `[!type] title` syntax with tab-indented children
- `callouts/compatible` — compatible `> **type** title` syntax
- `callouts/fold-states` — `[!type +/-]` folded/unfolded callouts
- `callouts/empty` — callout with no title text or children
- `callouts/blank-child` — callout with an empty child (blank child line preserved)
- `callouts/fenced-child` — fenced code block as a child inside a callout

Note: `callouts/nested-child` is deferred to P1-018 (toggle implementation) since it tests callout+toggle nesting.

## Scope Guardrails

- No workspace/editor/components/app
- No spec changes
- No fixture changes

## Files Created

- `packages/markup/src/extensions/callouts.ts`

## Files Modified

- `packages/markup/src/parser.ts` — `callout` BlockSpec kind, `parseCalloutMarker` detection in `parseBlocks`, recursive `parse()` for child content, `CalloutNode` construction
- `packages/markup/src/serializer.ts` — `serializeCallout` dispatch, leading `\n` strip in `serialize()` to normalize first-block separator
- `packages/markup/tests/wiki-links.test.mjs` — 6 callout fixture IDs and fixture-driven test (nested-child deferred to P1-018)

## Verification Summary

- `node --test packages/markup/tests/**/*.test.mjs` — 60 tests pass (6 callout fixture tests)
- `tsc -b --pretty false packages/markup/tsconfig.json` — typecheck passed

## Active Blockers

None.

## Next Recommended Task

P1-013 comments
