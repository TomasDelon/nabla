
# Phase Acceptance Criteria

## Purpose

Defines final acceptance criteria for every phase.

## Phase 1 — @nabla/markup

Required:
- parser fixtures pass;
- serializer fixtures pass;
- diagnostics fixtures pass;
- protected-region fixtures pass;
- boundary check passes;
- no UI dependency;
- progress report updated;
- validation report exists;
- final review approved;
- Git tree clean.

Forbidden:
- UI;
- workspace behavior not needed for parsing;
- editor;
- React;
- Milkdown;
- hidden JSON source;
- stored HTML source.

## Phase 2 — @nabla/workspace

Required:
- workspace fixtures pass;
- path resolution works;
- heading slugs work;
- block id index works;
- backlinks work;
- transclusion cycles detected;
- depth limit enforced;
- boundary check passes;
- final review approved;
- Git tree clean.

Forbidden:
- editor state as source;
- React;
- app shell.

## Phase 3 — @nabla/editor

Required:
- editor loads source;
- editor saves through parser + serializer;
- source preservation tests pass;
- fold commands update source;
- `NABLA_EDITOR_EXPORT_LOSS` tested;
- final review approved;
- Git tree clean.

Forbidden:
- app shell;
- AI;
- MathLive;
- code execution.

## Phase 4 — @nabla/components

Required:
- components render semantic props;
- components do not define grammar;
- component tests pass;
- final review approved;
- Git tree clean.

Forbidden:
- app shell;
- source parser logic;
- workspace resolution.

## Phase 5 — @nabla/app

Required:
- app opens Markdown text;
- app renders Nabla features through prior packages;
- app saves Markdown text only;
- diagnostics visible;
- no alternate document persistence format;
- full validation report exists;
- Git tree clean.

Forbidden:
- AI;
- sync;
- collaboration;
- code execution;
- MathLive;
- advanced export;
- hidden JSON source;
- stored HTML source.
