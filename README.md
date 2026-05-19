# Nabla

Nabla is a Markdown-first visual note-taking/editor project for mathematics, computer science, and advanced study documents.

Current implementation focus:

- Phase: Phase 1 — `@nabla/markup`
- Branch: `phase-1-markup-core`
- Current source of truth: the frozen documentation pack under `specs/`
- Current package under active implementation: `packages/markup`

## Source of Truth

The frozen specification and fixture pack under `specs/` is the implementation contract.

Do not modify:

- `specs/**`
- fixture files under the frozen spec pack
- generated audit bundle files by hand

The implementation must conform to the accepted specs and checked-in fixtures.

## Current Workflow

Each implementation task must produce two separate commits:

1. An implementation commit.
2. An audit bundle commit.

The audit bundle must be generated with explicit base/head commits:

```bash
pnpm audit:bundle -- --task <TASK_ID> --base <BASE_COMMIT> --head <IMPLEMENTATION_COMMIT>
```

Do not generate audit bundles using an implicit `HEAD`.

## Review Policy

External review is performed from the audit bundle and exact commit hashes.

Review source of truth:

- `reports/audit/latest/audit.json`
- `reports/audit/latest/git-show-name-only.txt`
- `reports/audit/latest/git-show.patch`
- the implementation commit referenced by `audit.json`

Do not rely on branch raw URLs as the source of truth for review. Branches move. Commit hashes are stable.

## Common Commands

```bash
pnpm test
pnpm test:markup
pnpm typecheck
pnpm build
pnpm validate:fixtures
pnpm validate:spec-version
pnpm check:boundaries
pnpm lint
```

If `pnpm` is not available on PATH in the local environment, use the configured Corepack/cached pnpm entrypoint consistently and report that fact.

## Guardrails

Implementation agents must not:

- modify `specs/**`;
- modify fixture expectations;
- start another task without explicit instruction;
- implement unrelated features;
- skip the audit bundle;
- use implicit audit ranges;
- generate audit bundles against branch names as source of truth;
- proceed when behavior is ambiguous.

If a behavior is missing, contradictory, or would require guessing, stop and report the blocker before editing further.

## Phase Advancement

Do not start Phase 2 until Phase 1 has passed its final validation and a full phase mega-audit.

Phase final audit requires a complete ZIP with `.git` included, excluding heavy generated folders such as `node_modules`, `dist`, and `coverage`.
