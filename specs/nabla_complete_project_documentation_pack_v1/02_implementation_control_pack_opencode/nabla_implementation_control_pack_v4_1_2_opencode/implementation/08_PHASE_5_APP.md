
# Phase 5 — @nabla/app

## Goal

Build the minimal app shell after components and editor adapter are stable.

## Scope

This phase includes:

- app layout;
- file open/save flow;
- minimal sidebar;
- editor page;
- source/visual mode switch only if already specified and supported by previous packages;
- diagnostics panel;
- parse-mode settings only if already specified and supported by previous packages.

This phase excludes:

- AI;
- MathLive;
- code execution;
- collaboration;
- sync backend;
- advanced PDF export;
- generic component marketplace.

## Required Packages

Before Phase 5 starts:

- `@nabla/markup` must pass tests;
- `@nabla/workspace` must pass tests;
- `@nabla/editor` must pass source preservation tests;
- `@nabla/components` must render core views.

## Quality Gate

Phase 5 is done when:

- app opens a Markdown file;
- app renders Nabla features;
- app saves canonical source through parser + serializer;
- app does not bypass package boundaries;
- Git working tree is clean after commit.


## App Persistence Rule

The app MUST NOT introduce a persistence format other than Markdown-compatible plain text.

The app MUST save document content through:

```text
editor/app state → @nabla/markup parser → @nabla/markup serializer → Markdown source
```

No app-local JSON document format may become the source of truth.


## Required Commands

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm check:boundaries
pnpm validate:fixtures
pnpm validate:spec-version
git status --short
```

Every command result and exit code MUST be recorded in the validation report.
