# Comments

## Purpose

Defines preserved comments.

## Syntax

`<!-- text -->`, `%% text %%`.

## Parsing Rules

HTML comments remain Markdown HTML comments. Private comments create `PrivateCommentNode`.

## AST

Private comments produce `PrivateCommentNode`. HTML comments use MarkdownNode.

## Serialization

Preserve comments.

## Editor Behavior

Private comments hidden in reading mode and muted in edit mode.

## Workspace Behavior

No workspace behavior.

## Conflicts

Nested private comments are not supported. Multiline private comments require closing delimiter.

## Diagnostics

No required diagnostics unless parser chooses to warn for unclosed private comment.

## Fixtures

Must include HTML comment, private comment, multiline private comment, protected region.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable


## Fixture Coverage Clarification

The required v0 fixture set includes:
- `comments/basic`;
- `comments/multiline-private`;
- `comments/protected-region`.

HTML comments are represented as mdast-compatible `html` nodes.
Private comments are represented as `PrivateCommentNode`.
