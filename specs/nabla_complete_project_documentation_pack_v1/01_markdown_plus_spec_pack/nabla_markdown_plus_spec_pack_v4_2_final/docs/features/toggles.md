
# Toggles

## Purpose

Defines simple foldable blocks.

## Syntax

- `]> title`
- `]v title`

## Parsing Rules

Toggles are valid only at block start.

`]>` means closed.
`]v` means open.

Child ownership:
- a child line MUST start with at least one tab beyond parent indentation in strict mode;
- four spaces MAY be accepted only in tolerant mode and serialized as one tab;
- lazy continuation is forbidden in v0;
- blank lines are allowed only inside an already established child block;
- multiple blank lines canonicalize to one blank line;
- fenced code inside children is protected;
- nested callouts/toggles are allowed at child indentation.

## AST

Produces `ToggleNode`.

## Serialization

Serializer emits canonical tab indentation.
Serializer preserves `]>` or `]v`.

## Editor Behavior

Closed toggles hide children.
Open toggles show children.
Fold state changes update source markers.

## Workspace Behavior

No required workspace behavior.

## Conflicts

Markers inside paragraphs remain text.
Markers inside code remain literal.

## Diagnostics

`NABLA_TOGGLE_MISSING_TITLE` for empty title.

## Fixtures

Must include:
- open;
- closed;
- empty child;
- blank line child;
- fenced code child;
- nested block child.

## Acceptance Criteria

- parser fixture passes;
- serializer fixture passes;
- child ownership fixtures pass;
- protected-region fixtures pass.
