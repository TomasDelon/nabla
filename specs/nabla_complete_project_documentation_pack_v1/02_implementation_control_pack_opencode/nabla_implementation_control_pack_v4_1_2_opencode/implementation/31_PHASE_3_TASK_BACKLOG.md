
# Phase 3 Task Backlog — @nabla/editor

## Ordered Tasks

| Task | Objective |
|---|---|
| P3-001 | editor package setup |
| P3-002 | editor adapter interface |
| P3-003 | source-to-editor load path |
| P3-004 | editor-to-source save path |
| P3-005 | source preservation tests |
| P3-006 | protected region behavior |
| P3-007 | fold state commands |
| P3-008 | export loss diagnostic |
| P3-009 | editor fixture tests |
| P3-010 | phase validation report |

## Non-Negotiable Rule

The editor is an adapter.
The editor is not the source of truth.

Saved document state must pass through:

```text
editor export → @nabla/markup parser → @nabla/markup serializer → Markdown source
```

## Required Commands

```bash
pnpm test
pnpm typecheck
pnpm check:boundaries
```
