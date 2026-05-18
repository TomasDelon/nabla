# Frontmatter

## Purpose

Defines document metadata at the beginning of a file.

## Syntax

`--- ... ---` only at document start.

## Parsing Rules

Recognize only at document start. Preserve raw content. Parse frontmatter using a YAML 1.2-compatible parser. If parsing fails, preserve raw content and set `data: null`.

## AST

Produces `FrontmatterNode`.

## Serialization

Emit raw frontmatter unless metadata was explicitly edited.

## Editor Behavior

May render as a property panel. Source mode shows raw block.

## Workspace Behavior

No workspace behavior required in v0.

## Conflicts

At document start, valid frontmatter wins over horizontal rule. Else `---` is a separator.

## Diagnostics

`NABLA_FRONTMATTER_INVALID` for invalid metadata.

## Fixtures

Must include valid frontmatter, invalid frontmatter, and horizontal rule ambiguity.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable


## Frontmatter Parser

Nabla v0 MUST use a YAML 1.2-compatible parser for frontmatter.

The parser MUST preserve the raw frontmatter string.
If YAML parsing fails, the parser MUST:
- keep the raw string;
- set `data` to `null`;
- emit `NABLA_FRONTMATTER_INVALID`.
