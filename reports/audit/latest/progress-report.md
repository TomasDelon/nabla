# Implementation Progress Report

## Phase

Phase 2 - `@nabla/workspace`

## Task ID

`P2-003 heading slug index`

## Branch

`p2-003-heading-slug-index`

## Status

P2-003 heading slug index complete.

## Implemented

- `packages/workspace/src/slug.ts` — `createSlug` slug algorithm per spec (NFC, lowercase, trim, NFD accent removal, whitespace→`-`, punctuation removal, collapse `-`, trim `-`); `deduplicateSlugs` for `slug`, `slug-2`, `slug-3` dedup
- `packages/workspace/src/heading-index.ts` — `buildHeadingIndex` extracts standard `heading` and `foldableHeading` nodes from `NablaDocument`, generates slugged entries with dedup
- `packages/workspace/tests/heading-slugs.test.mjs` — 15 tests covering slug creation, dedup, and heading index extraction

## Scope Guardrails

- No workspace file index touched
- No backlink or transclusion code
- No specs or fixtures modified
- No `@nabla/markup` behavior changes
- No other Phase 2 packages touched

## Verification Summary

- `pnpm test:workspace` — 15/15 tests pass
- `pnpm test:markup` — 69/69 tests pass
- `pnpm test` — 84/84 tests pass
- `pnpm typecheck` — passed
- `pnpm build` — passed
- `pnpm validate:fixtures` — passed
- `pnpm validate:spec-version` — passed
- `pnpm check:boundaries` — passed
- `pnpm lint` — reported as unavailable (expected)
- `git status --short` — clean

## Active Blockers

None.

## Next Recommended Task

P2-004 — block ID index
