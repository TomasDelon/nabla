# Folded Headings

## Purpose

Defines persisted heading fold state.

## Syntax

`#> text`, `#v text`, and levels 2 through 6.

## Parsing Rules

Valid at heading position. Marker determines fold state.

## AST

Produces `FoldableHeadingNode`.

## Serialization

Preserve marker and heading depth.

## Editor Behavior

Closed heading hides section. Parent closed state overrides child state.

## Workspace Behavior

Workspace heading index includes folded headings.

## Conflicts

`#vocabulary` is a tag, not folded heading.

## Diagnostics

No specific diagnostics required for valid folded headings.

## Fixtures

Must include levels 1-6, tag conflict, parent/child fold precedence.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable
