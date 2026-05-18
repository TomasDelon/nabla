
# Parser and Serializer

## Purpose

Defines parse, serialize, canonicalize, and roundtrip behavior.

## Parse Mode

```ts
type ParseMode = "strict" | "tolerant";
```

Default mode is `strict`.

Strict mode:
- canonical indentation for Nabla child blocks MUST use tabs;
- four-space indentation is not accepted as Nabla child indentation;
- malformed Nabla syntax remains literal or emits diagnostics.

Tolerant mode:
- four spaces MAY be accepted as one indentation level;
- serializer MUST normalize accepted four-space child indentation to tabs;
- tolerant mode is for import and migration, not canonical writing.

## Pipeline

```text
source → CommonMark/GFM parse → Nabla block post-processing → Nabla inline parsing → NablaDocument → serialize → canonical source
```

## Protected Regions

The parser MUST identify protected regions before Nabla parsing.

Protected regions:
- inline code;
- fenced code blocks;
- indented code blocks;
- raw HTML blocks;
- inline HTML.

Nabla syntax inside protected regions remains literal.

## Transclusions Are Block-Only

`![[note]]`, `![[note#heading]]`, and `![[note^id]]` are valid only as block-level constructs.

If transclusion syntax appears inside a paragraph, it MUST remain text and MAY emit `NABLA_TRANSCLUSION_INLINE_UNSUPPORTED`.

## Block ID Parsing

Block id parsing is a post-Markdown extraction pass.

The parser first creates normal Markdown/Nabla block nodes.
Then the block-id extraction pass scans allowed positions:
- end of attachable block line;
- own line immediately after an attachable block.

Block IDs are stored on the attachable node as:

```ts
node.data.nablaBlockId = "id"
```

If a paragraph contains only a valid own-line block id, the paragraph is removed and the block id is attached to the previous attachable block.

If a paragraph ends with whitespace followed by a valid block id, the trailing block id is extracted, the paragraph text is updated without the block id, and `data.nablaBlockId` is set on that paragraph.

## Attachable Block Types

Block ids MAY attach to:
- paragraph;
- heading;
- folded heading;
- list item;
- blockquote;
- table;
- callout;
- toggle;
- transclusion.

Block ids MUST NOT attach to:
- fenced code block;
- indented code block;
- inline code;
- raw HTML block;
- inline HTML;
- frontmatter;
- footnote definition;
- private comment.

## Parsing Priority

Block pipeline:
1. frontmatter;
2. fenced code;
3. indented code;
4. raw HTML block;
5. CommonMark/GFM blocks;
6. Nabla block reinterpretation for callouts, toggles, folded headings, block transclusions;
7. block-id post-processing.

Inline priority:
1. inline code;
2. inline HTML;
3. Markdown links/images;
4. wiki links;
5. footnote references;
6. tooltips;
7. color highlights;
8. simple highlights;
9. tags;
10. emoji shortcodes;
11. emphasis.

## Tooltip Grammar

Valid forms:
- `word^[tooltip]`
- `[visible text]^[tooltip]`

Single-token target regex:

```regex
[\p{L}\p{N}_-]+
```

No valid target emits `NABLA_TOOLTIP_EMPTY_TARGET`.

Unclosed tooltip emits `NABLA_TOOLTIP_UNCLOSED`.

## Wiki Link Grammar

The parser reads wiki link content from inside `[[` and `]]`.

Parsing order:
1. split alias at the first unescaped `|`;
2. in target side, parse block id when unescaped `#^` or `^` appears at the end;
3. parse heading when unescaped `#` appears and no block id was found;
4. remaining text is target.

Escapes:
- `\|` is literal pipe;
- `\#` is literal hash;
- `\^` is literal caret;
- `\]` is literal closing bracket.

Valid combined cases:
- `[[note#heading|alias]]`;
- `[[note^block|alias]]`;
- `[[note#^block|alias]]`.

Invalid combined case:
- `[[note#heading^block]]`

Invalid combined targets MUST remain text and emit `NABLA_WIKI_LINK_INVALID_TARGET`.

## Callout and Toggle Child Grammar

Canonical child blocks are tab-indented.

A child line belongs to the parent when it starts with at least one tab beyond the parent indentation.

In strict mode, spaces do not create Nabla child indentation.

In tolerant mode, four spaces MAY be accepted as one indentation level and serialized as one tab.

Lazy continuation is forbidden in v0 inside callouts and toggles.
A paragraph continuation inside a callout/toggle child MUST be indented.

Blank lines inside children are allowed only if followed by another child line at child indentation.

Multiple blank lines are preserved as a single blank line in canonical serialization.

Fenced code blocks inside children keep their internal content protected.

Nested callouts and toggles are allowed when their marker appears at child indentation.

## Serialization

Serializer MUST emit canonical syntax:
- `[[note#^id]]` → `[[note^id]]`
- `![[note#^id]]` → `![[note^id]]`
- `> [!type] title` → `[!type] title`
- compatible callout body lines → tab-indented child lines
- accepted four-space child indentation → tabs

Serializer MUST NOT emit:
- kbd syntax;
- generic component syntax;
- generic attributes;
- rendered HTML for Nabla nodes.

## Roundtrip

Canonical input SHOULD serialize to itself.
Compatible input SHOULD serialize to canonical output.


## Frontmatter YAML

Frontmatter MUST be parsed with a YAML 1.2-compatible parser.

If parsing succeeds, `FrontmatterNode.data` contains the parsed object.
If parsing fails, `FrontmatterNode.data` is `null`, raw content is preserved, and `NABLA_FRONTMATTER_INVALID` is emitted.
