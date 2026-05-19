# Implementation Progress Report

## Phase

Phase 2 — `@nabla/workspace`

## Task ID

`P2-002 / P2-003 / P2-004` — parallel sprint merged

## Branch

`phase-2-workspace-core`

## Status

Three parallel P2 tasks implemented and merged:

### P2-002 — Path normalization

- `packages/workspace/src/path-utils.ts` — `normalizeWorkspacePath`: NFC, preserve case, `.md`/`.mp` stripping, candidate matching (target, target.md, target.mp, target/index.md, target/index.mp)
- `packages/workspace/tests/path-utils.test.mjs` — path normalization tests

### P2-003 — Heading slug index

- `packages/workspace/src/slug.ts` — `createSlug` algorithm (NFC, lowercase, trim, accent removal, whitespace→`-`, punctuation removal, collapse `-`, trim `-`); `deduplicateSlugs` for slug/slug-2/slug-3 dedup
- `packages/workspace/src/heading-index.ts` — `buildHeadingIndex` extracts `heading` and `foldableHeading` nodes from `NablaDocument`
- `packages/workspace/tests/heading-slugs.test.mjs` — 15 tests

### P2-004 — Block ID index

- `packages/workspace/src/block-index.ts` — `buildBlockIndex` extracts `data.nablaBlockId` from block-level AST nodes with recursive nested traversal and duplicate detection
- `packages/workspace/tests/block-id.test.mjs` — 13 tests

## Files Created

- `packages/workspace/src/path-utils.ts`
- `packages/workspace/src/slug.ts`
- `packages/workspace/src/heading-index.ts`
- `packages/workspace/src/block-index.ts`
- `packages/workspace/tests/path-utils.test.mjs`
- `packages/workspace/tests/heading-slugs.test.mjs`
- `packages/workspace/tests/block-id.test.mjs`

## Files Modified

- `packages/workspace/src/index.ts` — exports for all new modules
- `reports/IMPLEMENTATION_PROGRESS.md` — this report

## Scope Guardrails

- No `@nabla/markup` behavior changes
- No spec or fixture modifications
- No backlink or transclusion code started

## Verification Summary

- `pnpm test` — all markup (69) + workspace tests pass
- `pnpm typecheck` — passed
- `pnpm build` — passed
- `pnpm validate:fixtures` — passed
- `pnpm validate:spec-version` — passed
- `pnpm check:boundaries` — passed
- `pnpm lint` — unavailable (expected)
- `git status --short` — clean

## Active Blockers

None.

## Next Recommended Task

P2-005 — file index and wiki link resolver
