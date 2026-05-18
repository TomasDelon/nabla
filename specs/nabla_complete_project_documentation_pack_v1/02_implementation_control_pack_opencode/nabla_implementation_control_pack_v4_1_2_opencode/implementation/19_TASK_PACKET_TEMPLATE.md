
# Task Packet Template

## Blank Template

```md
# Task Packet — <TASK_ID>

## Phase

## Objective

## Scope

## Out of Scope

## Source of Truth

## Files Allowed to Read

## Files Allowed to Modify

## Files Forbidden to Modify

## Fixtures Required

## Commands Required

## Acceptance Criteria

## Stop Conditions

## Required Progress Report

## Reviewer Instructions

## Commit Requirement
```

---

# Example — TASK-P1-001

## Phase

Phase 1 — `@nabla/markup`

## Objective

Bootstrap the `packages/markup` package.

## Scope

Create package skeleton, TypeScript config, public exports, and empty parser/serializer entry points.

## Out of Scope

- parser feature implementation;
- workspace package;
- editor;
- React;
- Milkdown;
- app shell.

## Source of Truth

- `implementation/04_PHASE_1_MARKUP_CORE.md`
- `implementation/03_REPO_STRUCTURE.md`
- `implementation/16_GIT_AND_VERSION_CONTROL.md`

## Files Allowed to Read

- `implementation/**`
- `specs/nabla_markdown_plus_spec_pack_v4_2_final/docs/04_AST_MODEL.md`

## Files Allowed to Modify

- `packages/markup/**`
- root `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `reports/IMPLEMENTATION_PROGRESS.md`

## Files Forbidden to Modify

- `specs/**`
- `implementation/**`
- `AGENTS.md`

## Fixtures Required

None for package skeleton.

## Commands Required

```bash
pnpm typecheck
pnpm test
git status --short
```

If commands cannot run yet, explain why and add the missing scripts.

## Acceptance Criteria

- package exists;
- package exports placeholder public API;
- TypeScript compiles or the report explains why not yet;
- Git commit created.

## Stop Conditions

Stop if package structure conflicts with control docs.

## Required Progress Report

Update `reports/IMPLEMENTATION_PROGRESS.md`.

## Reviewer Instructions

Check package boundaries and scope control.

## Commit Requirement

```text
chore(markup): bootstrap markup package
```

---

# Example — TASK-P1-010

## Phase

Phase 1 — `@nabla/markup`

## Objective

Implement wiki-link parser fixtures.

## Source of Truth

- `docs/features/wiki-links.md`
- `docs/05_PARSER_SERIALIZER.md`
- `docs/06_SYNTAX_CONFLICTS.md`
- `docs/04_AST_MODEL.md`

## Fixtures Required

- `fixtures/wiki-links/basic`
- `fixtures/wiki-links/alias`
- `fixtures/wiki-links/block-canonical`
- `fixtures/wiki-links/block-compatible`
- `fixtures/wiki-links/combined-alias-heading`
- `fixtures/wiki-links/combined-alias-block-compatible`
- `fixtures/wiki-links/escaped`
- `fixtures/wiki-links/invalid-combined`

## Files Allowed to Modify

- `packages/markup/src/extensions/wiki-links.ts`
- `packages/markup/src/parser.ts`
- `packages/markup/src/serializer.ts`
- `packages/markup/tests/**`
- `reports/IMPLEMENTATION_PROGRESS.md`

## Acceptance Criteria

- listed wiki fixtures pass;
- protected region behavior remains passing;
- no non-wiki feature is added.

## Commit Requirement

```text
feat(markup): implement wiki link fixtures
```
