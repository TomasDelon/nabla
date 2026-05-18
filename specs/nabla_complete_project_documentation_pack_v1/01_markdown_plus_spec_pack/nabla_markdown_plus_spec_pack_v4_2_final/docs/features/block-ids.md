
# Block IDs

## Purpose

Defines stable block anchors.

## Syntax

`^id`

## Grammar

```regex
[A-Za-z][A-Za-z0-9_-]*
```

## Parsing Rules

Block id parsing is a post-Markdown extraction pass.

Valid positions:
- at the end of an attachable block line after whitespace;
- on its own line immediately after an attachable block.

Attachable block types:
- paragraph;
- heading;
- folded heading;
- list item;
- blockquote;
- table;
- callout;
- toggle;
- transclusion.

Non-attachable block types:
- fenced code block;
- indented code block;
- raw HTML block;
- inline HTML;
- frontmatter;
- footnote definition;
- private comment.

## AST

Block ids are stored on the attachable node:

```ts
node.data.nablaBlockId = "id"
```

There is no persisted standalone `BlockIdNode` in v0.

## Serialization

If the original source used end-of-line form and the attached node still serializes as a single block line, serializer MUST preserve end-of-line form.

If preservation is not safe, serializer MUST emit own-line form immediately after the attached block.

## Editor Behavior

Block ids render as subtle anchors.

## Workspace Behavior

Workspace indexes `data.nablaBlockId` on attachable nodes.

Duplicates emit `NABLA_BLOCK_ID_DUPLICATE`.

## Conflicts

`^id` inside normal text is not a block id unless it appears in a valid position.

## Diagnostics

- `NABLA_BLOCK_ID_INVALID`
- `NABLA_BLOCK_ID_INVALID_POSITION`
- `NABLA_BLOCK_ID_DUPLICATE`

## Fixtures

Must include:
- paragraph end-of-line;
- heading end-of-line;
- list item;
- table;
- own-line;
- invalid grammar;
- invalid position;
- duplicate block id;
- callout/toggle/transclusion attachment.

## Acceptance Criteria

- parser fixture passes;
- serializer fixture passes;
- workspace duplicate detection passes.
