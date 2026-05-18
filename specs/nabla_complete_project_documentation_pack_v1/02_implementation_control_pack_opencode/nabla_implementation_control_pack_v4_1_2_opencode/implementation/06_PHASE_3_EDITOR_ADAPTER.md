
# Phase 3 — @nabla/editor

## Goal

Integrate Nabla Markdown+ with Milkdown / ProseMirror.

## Scope

This phase includes:

- editor adapter;
- source-to-editor conversion;
- editor-to-source conversion;
- Nabla node views or marks;
- commands for links and fold states;
- save pipeline through parser + serializer.

This phase excludes:

- full app shell;
- advanced command palette;
- AI;
- code execution;
- MathLive.

## Required Specs

Read:

- `07_EDITOR_BEHAVIOR.md`
- `02_ARCHITECTURE.md`
- `05_PARSER_SERIALIZER.md`
- `14_DIAGNOSTICS.md`

## Critical Rule

The editor export is not trusted final source.

Save pipeline:

```text
editor export → @nabla/markup parser → @nabla/markup serializer → saved source
```

If the editor loses unsupported Markdown, emit `NABLA_EDITOR_EXPORT_LOSS`.

## Implementation Order

1. Create minimal Milkdown editor.
2. Load source from text.
3. Render standard Markdown.
4. Render wiki links.
5. Render tags.
6. Render highlights/tooltips.
7. Render callouts/toggles/folded headings.
8. Implement fold state commands.
9. Implement save through parser + serializer.
10. Add source preservation tests.

## Quality Gate

Phase 3 is done when:

- visual editing preserves canonical source;
- fold state changes update markers;
- protected regions remain literal;
- missing links render visibly;
- save pipeline passes source preservation tests.


## Required Commands

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm check:boundaries
git status --short
```

Every command result and exit code MUST be recorded in the progress report.
