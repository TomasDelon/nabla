
# Phase 1 Task Backlog — @nabla/markup

## Purpose

This backlog breaks Phase 1 into small OpenCode-safe tasks.

The builder MUST NOT implement multiple backlog items at once unless the task packet explicitly combines them.

## Phase 1 Rules

- No workspace implementation.
- No editor implementation.
- No React.
- No Milkdown.
- No app shell.
- No out-of-scope syntax.
- No spec/fixture edits without human approval.
- Commit after each task.

## Ordered Backlog

| Task | Name | Objective | Primary Files | Commit Type |
|---|---|---|---|---|
| P1-001 | repo bootstrap | Initialize repo, pnpm workspace, root scripts | root config | chore |
| P1-002 | @nabla/markup setup | Create markup package skeleton | packages/markup/** | chore |
| P1-003 | AST type definitions | Implement AST types from spec | packages/markup/src/ast.ts | feat |
| P1-004 | diagnostic constants | Implement diagnostic catalog | packages/markup/src/diagnostics.ts | feat |
| P1-005 | fixture loader | Load parser fixtures | packages/markup/src/fixtures.ts | test |
| P1-006 | fixture runner | Compare AST/output/diagnostics | packages/markup/tests/** | test |
| P1-007 | serializer skeleton | Create canonical serializer entry point | packages/markup/src/serializer.ts | feat |
| P1-008 | parser skeleton | Create parser entry point using remark | packages/markup/src/parser.ts | feat |
| P1-009 | protected regions | Protect code/html from Nabla parsing | packages/markup/src/protected-regions.ts | feat |
| P1-010 | wiki-links | Implement wiki link packages/markup/src/parser.ts and packages/markup/src/serializer.ts fixtures | packages/markup/src/extensions/wiki-links.ts | feat |
| P1-011 | tags | Implement tags | packages/markup/src/extensions/tags.ts | feat |
| P1-012 | highlights | Implement highlights | packages/markup/src/extensions/highlights.ts | feat |
| P1-013 | comments | Implement comments | packages/markup/src/extensions/comments.ts | feat |
| P1-014 | task states | Implement task state mapping | packages/markup/src/extensions/task-states.ts | feat |
| P1-015 | frontmatter | Implement YAML frontmatter | packages/markup/src/extensions/frontmatter.ts | feat |
| P1-016 | footnotes | Implement footnotes | packages/markup/src/extensions/footnotes.ts | feat |
| P1-017 | callouts | Implement callouts | packages/markup/src/extensions/callouts.ts | feat |
| P1-018 | toggles | Implement toggles | packages/markup/src/extensions/toggles.ts | feat |
| P1-019 | folded headings | Implement folded headings | packages/markup/src/extensions/folded-headings.ts | feat |
| P1-020 | block IDs | Implement block id post-processing | packages/markup/src/extensions/block-ids.ts | feat |
| P1-021 | transclusions | Implement block-only transclusions | packages/markup/src/extensions/transclusions.ts | feat |
| P1-022 | emoji shortcodes | Implement emoji registry parser | packages/markup/src/extensions/emoji-shortcodes.ts | feat |
| P1-023 | GFM table alignment | Verify GFM table alignment AST | packages/markup/src/parser.ts and packages/markup/src/serializer.ts | test |
| P1-024 | full fixture regression | Run all markup fixtures | tests | test |
| P1-025 | Phase 1 validation | Write validation report | reports/VALIDATION_REPORT.md | docs |

## Default Required Commands Per Task

```bash
pnpm test:markup
pnpm typecheck
pnpm check:boundaries
git status --short
```

If a command cannot run yet, report why.

## Default Reviewer Focus

For every Phase 1 task, reviewer checks:

- no UI dependency;
- no workspace dependency;
- fixtures are used as contracts;
- protected regions remain literal;
- no specs/fixtures modified without approval;
- commit is coherent.

## Phase 1 Completion

Phase 1 is complete only after P1-025 final validation passes.
