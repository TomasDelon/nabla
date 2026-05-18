# Implementation Progress Report

## Phase

Phase 1 - `@nabla/markup`

## Task ID

`P1-004 diagnostic constants`

## Branch

`phase-1-markup-core`

## Status

P1-004 diagnostic constants implemented.

## Scope Guardrails

- No parser implementation
- No serializer implementation
- No fixture loader implementation
- No spec changes
- No fixture changes
- No Phase 2+ package work

## Files Created

- `.gitignore`
- `README.md`
- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `packages/markup/package.json`
- `packages/markup/tsconfig.json`
- `packages/markup/src/ast.ts`
- `packages/markup/src/index.ts`
- `packages/markup/src/diagnostics.ts`
- `packages/markup/src/parse-mode.ts`
- `packages/markup/tests/diagnostics.test.mjs`
- `packages/markup/tests/ast-surface.test.mjs`
- `packages/markup/tests/bootstrap.test.mjs`
- `scripts/check-boundaries.mjs`
- `scripts/report-unavailable.mjs`
- `scripts/validate-fixtures.mjs`
- `scripts/validate-spec-version.mjs`
- `pnpm-lock.yaml`

## Files Verified

- `@nabla/markup` package metadata and exports remain coherent
- AST types follow `04_AST_MODEL.md`
- `MarkdownNode` remains mdast-compatible via structural shape and index signature
- `data.nablaTaskState` and `data.nablaBlockId` are represented
- `ParseMode` is represented without adding parser runtime behavior
- Diagnostic codes and severities follow `14_DIAGNOSTICS.md`

## Verification Summary

- `pnpm test` passed (3 tests)
- `pnpm test:markup` passed (3 tests)
- `pnpm typecheck` passed
- `pnpm build` passed
- `pnpm validate:fixtures` passed
- `pnpm validate:spec-version` passed
- `pnpm check:boundaries` passed
- `pnpm lint` passed via bootstrap placeholder

## Active Blockers

None.

## Next Recommended Task

P1-005 fixture loader
