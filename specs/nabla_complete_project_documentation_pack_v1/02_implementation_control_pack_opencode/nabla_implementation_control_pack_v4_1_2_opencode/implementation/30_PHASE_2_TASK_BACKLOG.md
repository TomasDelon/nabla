
# Phase 2 Task Backlog — @nabla/workspace

## Ordered Tasks

| Task | Objective |
|---|---|
| P2-001 | workspace package setup |
| P2-002 | file path normalization |
| P2-003 | heading slug index |
| P2-004 | block ID index |
| P2-005 | wiki link resolver |
| P2-006 | backlink index |
| P2-007 | transclusion resolver |
| P2-008 | missing target diagnostics |
| P2-009 | cycle detection |
| P2-010 | depth limit |
| P2-011 | workspace fixture regression |
| P2-012 | phase validation report |

## Required Specs

- `docs/08_WORKSPACE_MODEL.md`
- `docs/features/wiki-links.md`
- `docs/features/transclusions.md`
- `docs/features/block-ids.md`
- `docs/14_DIAGNOSTICS.md`

## Required Commands

```bash
pnpm test:workspace
pnpm typecheck
pnpm check:boundaries
```

## Stop Conditions

Stop if resolution behavior is not specified.
