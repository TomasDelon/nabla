# Wiki Links

## Purpose

Defines internal links to notes, headings, and blocks.

## Syntax

`[[note]]`, `[[note|alias]]`, `[[note#heading]]`, `[[note^id]]`, compatible `[[note#^id]]`.

## Parsing Rules

Parse target, alias, heading, and blockId using the grammar in `05_PARSER_SERIALIZER.md`.

## AST

Produces `WikiLinkNode`.

## Serialization

Serialize compatible block links to `[[note^id]]`.

## Editor Behavior

Render as internal links. Missing targets use missing state.

## Workspace Behavior

Workspace resolves note, heading, and block targets.

## Conflicts

Escaped `\|`, `\#`, `\^`, and `\]` are literal. Syntax inside code is literal.

## Diagnostics

`NABLA_LINK_MISSING_TARGET`, `NABLA_LINK_AMBIGUOUS_TARGET`, `NABLA_HEADING_MISSING_TARGET`, `NABLA_BLOCK_MISSING_TARGET`.

## Fixtures

Must include basic, alias, heading, block canonical, block compatible, escaped chars, protected region.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable


## Alias Fixture

`wiki-links/alias` proves the simple alias form `[[note|alias]]`.
