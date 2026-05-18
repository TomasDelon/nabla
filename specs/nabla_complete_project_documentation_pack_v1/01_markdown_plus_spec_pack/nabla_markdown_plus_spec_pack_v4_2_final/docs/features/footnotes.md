# Footnotes

## Purpose

Defines footnote references and definitions.

## Syntax

`text[^id]`, `[^id]: text`.

## Parsing Rules

References are inline. Definitions are block-level.

## AST

Produces `FootnoteReferenceNode` and `FootnoteDefinitionNode`.

## Serialization

Preserve id and definition content.

## Editor Behavior

References render as markers. Definitions render at source location or panel.

## Workspace Behavior

No workspace behavior.

## Conflicts

`^[tip]` is tooltip, `[^id]` is footnote.

## Diagnostics

`NABLA_FOOTNOTE_MISSING_DEFINITION`, `NABLA_FOOTNOTE_UNUSED_DEFINITION`.

## Fixtures

Must include valid, missing definition, unused definition, tooltip conflict.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable
