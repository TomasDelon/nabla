# Highlights

## Purpose

Defines simple and color highlights.

## Syntax

`==text==`, `=={#hex}text==`.

## Parsing Rules

Color form wins when hex marker is valid.

## AST

Produces `HighlightNode` or `ColorHighlightNode`.

## Serialization

Preserve simple or color form.

## Editor Behavior

Simple highlight uses default style. Color highlight uses hex color.

## Workspace Behavior

No workspace behavior.

## Conflicts

Unclosed highlights produce diagnostics. Syntax inside code is literal.

## Diagnostics

`NABLA_HIGHLIGHT_UNCLOSED`, `NABLA_HIGHLIGHT_INVALID_COLOR`.

## Fixtures

Must include simple, color 3/6/8 digits, invalid color, unclosed, protected region.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable


## Protected Region Fixture

`highlights/protected-region` proves highlight syntax remains literal inside inline code and fenced code.
