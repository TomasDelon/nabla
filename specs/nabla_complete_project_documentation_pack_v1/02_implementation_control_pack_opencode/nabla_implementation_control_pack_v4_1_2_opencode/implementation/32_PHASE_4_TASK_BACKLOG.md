
# Phase 4 Task Backlog — @nabla/components

## Ordered Tasks

| Task | Objective |
|---|---|
| P4-001 | components package setup |
| P4-002 | renderer input contract |
| P4-003 | callout component |
| P4-004 | toggle component |
| P4-005 | folded heading component |
| P4-006 | highlight component |
| P4-007 | tooltip component |
| P4-008 | transclusion read-only component |
| P4-009 | diagnostics display component |
| P4-010 | visual smoke tests |

## Rules

- components cannot parse Markdown;
- components cannot define syntax;
- components receive already-parsed nodes or view models;
- no generic components in v0.

## Required Commands

```bash
pnpm test
pnpm typecheck
pnpm check:boundaries
```
