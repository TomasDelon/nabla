
# Phase 4 — @nabla/components

## Goal

Build reusable React visual components after core packages are stable.

## Scope

This phase includes:

- WikiLinkView;
- TagPill;
- HighlightView;
- TooltipView;
- CalloutView;
- ToggleView;
- FoldedHeadingControl;
- TransclusionBlock;
- diagnostics display components.

This phase excludes:

- app shell;
- file sidebar;
- routing;
- persistence;
- AI;
- MathLive;
- code execution;
- generic components.

## Required Specs

Read:

- `docs/07_EDITOR_BEHAVIOR.md`
- feature specs for each rendered component
- `docs/15_REGISTRIES.md`

## Rules

Components MUST NOT define grammar.

Components receive semantic props from `@nabla/editor` or `@nabla/markup`.

Components MUST NOT parse source strings directly except for display-only fallback.

## Files to Create

```text
packages/components/
├─ package.json
├─ src/
│  ├─ WikiLinkView.tsx
│  ├─ TagPill.tsx
│  ├─ CalloutView.tsx
│  ├─ ToggleView.tsx
│  ├─ FoldedHeadingControl.tsx
│  ├─ TransclusionBlock.tsx
│  ├─ TooltipView.tsx
│  ├─ HighlightView.tsx
│  ├─ DiagnosticBadge.tsx
│  └─ index.ts
└─ tests/
```

## Quality Gate

Phase 4 is done when:

- components render semantic props;
- components have basic tests;
- no grammar lives in components;
- no app shell is implemented yet;
- changes are committed.


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
