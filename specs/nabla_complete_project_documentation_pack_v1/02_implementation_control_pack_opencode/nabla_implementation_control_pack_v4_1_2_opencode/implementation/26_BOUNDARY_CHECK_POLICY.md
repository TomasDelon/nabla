
# Boundary Check Policy

## Purpose

Defines what `pnpm check:boundaries` must verify.

## @nabla/markup

MUST NOT import:
- react
- react-dom
- @milkdown/*
- prosemirror-*
- DOM APIs
- @nabla/editor
- @nabla/components
- @nabla/app
- @nabla/workspace

MAY import:
- unified
- remark-parse
- remark-gfm
- yaml
- unist utilities
- internal markup modules

## @nabla/workspace

MAY import:
- @nabla/markup

MUST NOT import:
- React
- Milkdown
- ProseMirror
- @nabla/editor
- @nabla/components
- @nabla/app

## @nabla/editor

MAY import:
- @nabla/markup
- @nabla/components
- Milkdown
- ProseMirror

MUST NOT define grammar that belongs in `@nabla/markup`.

## @nabla/components

MAY import React.

MUST NOT:
- define grammar;
- parse Markdown source;
- serialize documents;
- perform workspace resolution.

## Suggested Implementation

Boundary check may be implemented using:

- static import scanner;
- package.json dependency allowlist;
- dependency graph tool;
- custom script under `scripts/check-boundaries.ts`.

## Failure Rule

If boundary check fails, phase handoff is forbidden.
