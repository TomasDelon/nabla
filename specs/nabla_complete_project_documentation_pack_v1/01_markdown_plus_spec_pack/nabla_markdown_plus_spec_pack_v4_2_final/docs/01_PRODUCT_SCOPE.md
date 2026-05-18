
# Product Scope

## Purpose

This document defines the exact boundary of Nabla Markdown+ v0.

## Included

Nabla v0 MUST include:

- Markdown standard syntax;
- GFM syntax;
- GFM table alignment;
- GFM tasks;
- cancelled task state `[-]`;
- important task state `[!]`;
- frontmatter;
- footnotes;
- tags;
- wiki links;
- links to headings;
- links to blocks;
- block-only transclusions;
- block ids;
- HTML comments;
- private comments;
- callouts;
- foldable callouts;
- toggles;
- folded headings;
- tooltips;
- simple highlights;
- hex color highlights;
- emoji shortcodes.

## Explicitly Out of Scope

Nabla v0 MUST NOT include:

- keyboard-key syntax;
- double-backtick keyboard syntax;
- `++key++`;
- superscript syntax;
- subscript syntax;
- generic attributes `{#id .class k=v}`;
- generic component syntax `[component args]`;
- inline transclusions;
- editable transclusions;
- MathLive;
- code execution;
- AI;
- semantic LaTeX export;
- advanced PDF export;
- collaboration;
- sync backend.

## Source Format

Nabla v0 MUST support `.md`.

Nabla v0 MAY accept `.mp`, but `.mp` MUST use the same parser in v0.

## Implementation Policy

A feature is in v0 only when it has:
- syntax entry;
- feature spec;
- AST contract when it creates semantic nodes;
- parser and serializer rules;
- fixtures;
- diagnostics when needed.

Implementation agents MUST NOT add features based on external app behavior unless explicitly specified here.
