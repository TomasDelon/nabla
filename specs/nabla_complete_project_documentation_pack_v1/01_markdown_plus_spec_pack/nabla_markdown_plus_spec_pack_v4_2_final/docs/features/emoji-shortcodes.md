# Emoji Shortcodes

## Purpose

Defines registry-based emoji aliases.

## Syntax

`:name:`.

## Parsing Rules

Name grammar `[a-z0-9_+-]+`. Create node only if registry contains name.

## AST

Produces `EmojiShortcodeNode` for known shortcodes.

## Serialization

Preserve shortcode form.

## Editor Behavior

Known shortcodes render as emoji. Unknown remain text.

## Workspace Behavior

No workspace behavior.

## Conflicts

Colon text is not emoji unless registry contains the name.

## Diagnostics

`NABLA_EMOJI_UNKNOWN` MAY be emitted for unknown shortcode.

## Fixtures

Must include known, unknown, punctuation conflict, protected region.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable
