# Tags

## Purpose

Defines inline tags.

## Syntax

`#tag`, `#a/b`.

## Parsing Rules

Tag grammar is `[A-Za-z0-9_][A-Za-z0-9_/-]*`. `# text` is not a tag.

## AST

Produces `TagNode`.

## Serialization

Emit `#` plus tag value.

## Editor Behavior

Render as tag pills.

## Workspace Behavior

Workspace indexes tags by full value and segments.

## Conflicts

`#v text` is folded heading. `#vocabulary` is tag.

## Diagnostics

No specific diagnostics required for valid tags.

## Fixtures

Must include simple, nested, heading conflict, folded-heading conflict.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable
