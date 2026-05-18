
# AST Model

## Shared Types

```ts
type SourcePosition = {
  start: { line: number; column: number; offset: number };
  end: { line: number; column: number; offset: number };
};

type FoldState = "open" | "closed";
type SyntaxStatus = "canonical" | "compatible";
type ParseMode = "strict" | "tolerant";
```

## NablaDocument

```ts
type NablaDocument = {
  type: "document";
  children: Array<MarkdownNode | NablaBlockNode>;
  diagnostics: Diagnostic[];
};
```

## MarkdownNode

Markdown and GFM nodes use an mdast-compatible shape.

```ts
type MarkdownNode = {
  type: string;
  value?: string;
  children?: Array<MarkdownNode | NablaInlineNode | NablaBlockNode>;
  data?: {
    nablaTaskState?: TaskState;
    nablaBlockId?: string;
    [key: string]: unknown;
  };
  position?: SourcePosition;

  // mdast / remark-gfm compatibility:
  // allows fields such as depth, ordered, start, spread, align, lang, meta, url, title, alt, checked, etc.
  [key: string]: unknown;
};
```

## Structural Constraints

Paragraph children MUST contain only phrasing nodes:
- standard mdast inline nodes;
- NablaInlineNode.

List children MUST be listItem nodes.

Table children MUST be tableRow nodes.
TableRow children MUST be tableCell nodes.
TableCell children MUST contain phrasing nodes.

NablaBlockNode MUST NOT appear inside inline-only contexts.

## Inline Nodes

```ts
type NablaInlineNode =
  | TextNode
  | WikiLinkNode
  | TagNode
  | TooltipNode
  | HighlightNode
  | ColorHighlightNode
  | EmojiShortcodeNode
  | FootnoteReferenceNode;
```

## Block Nodes

```ts
type NablaBlockNode =
  | FrontmatterNode
  | TransclusionNode
  | CalloutNode
  | ToggleNode
  | FoldableHeadingNode
  | PrivateCommentNode
  | FootnoteDefinitionNode;
```

Block IDs are not persisted as standalone AST nodes in v0.
They are stored on the owning attachable node as `data.nablaBlockId`.

## TextNode

```ts
type TextNode = {
  type: "text";
  value: string;
  position?: SourcePosition;
};
```

## FrontmatterNode

```ts
type FrontmatterNode = {
  type: "frontmatter";
  raw: string;
  data: Record<string, unknown> | null;
  position?: SourcePosition;
};
```

## WikiLinkNode

```ts
type WikiLinkNode = {
  type: "wikiLink";
  target: string;
  alias?: string;
  heading?: string;
  blockId?: string;
  syntax: SyntaxStatus;
  raw: string;
  position?: SourcePosition;
};
```

## TransclusionNode

```ts
type TransclusionNode = {
  type: "transclusion";
  target: string;
  heading?: string;
  blockId?: string;
  syntax: SyntaxStatus;
  raw: string;
  data?: {
    nablaBlockId?: string;
  };
  position?: SourcePosition;
};
```

TransclusionNode is block-only in v0.

## TagNode

```ts
type TagNode = {
  type: "tag";
  value: string;
  segments: string[];
  raw: string;
  position?: SourcePosition;
};
```

## TooltipNode

```ts
type TooltipNode = {
  type: "tooltip";
  target: NablaInlineNode[];
  tooltip: string;
  raw: string;
  position?: SourcePosition;
};
```

## HighlightNode

```ts
type HighlightNode = {
  type: "highlight";
  children: NablaInlineNode[];
  raw: string;
  position?: SourcePosition;
};
```

## ColorHighlightNode

```ts
type ColorHighlightNode = {
  type: "colorHighlight";
  color: string;
  children: NablaInlineNode[];
  raw: string;
  position?: SourcePosition;
};
```

## EmojiShortcodeNode

```ts
type EmojiShortcodeNode = {
  type: "emojiShortcode";
  name: string;
  raw: string;
  position?: SourcePosition;
};
```

## FootnoteReferenceNode

```ts
type FootnoteReferenceNode = {
  type: "footnoteReference";
  id: string;
  raw: string;
  position?: SourcePosition;
};
```

## FootnoteDefinitionNode

```ts
type FootnoteDefinitionNode = {
  type: "footnoteDefinition";
  id: string;
  children: Array<MarkdownNode | NablaBlockNode>;
  raw: string;
  position?: SourcePosition;
};
```

## CalloutNode

```ts
type CalloutNode = {
  type: "callout";
  calloutType: string;
  title: NablaInlineNode[];
  foldState?: FoldState;
  children: Array<MarkdownNode | NablaBlockNode>;
  syntax: SyntaxStatus;
  rawMarker: string;
  data?: {
    nablaBlockId?: string;
  };
  position?: SourcePosition;
};
```

## ToggleNode

```ts
type ToggleNode = {
  type: "toggle";
  title: NablaInlineNode[];
  foldState: FoldState;
  children: Array<MarkdownNode | NablaBlockNode>;
  rawMarker: "]>" | "]v";
  data?: {
    nablaBlockId?: string;
  };
  position?: SourcePosition;
};
```

## FoldableHeadingNode

```ts
type FoldableHeadingNode = {
  type: "foldableHeading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  foldState: FoldState;
  title: NablaInlineNode[];
  rawMarker: string;
  data?: {
    nablaBlockId?: string;
  };
  position?: SourcePosition;
};
```

FoldableHeadingNode does not contain section children in persisted AST.
Section boundaries are computed by the editor/workspace.

## PrivateCommentNode

```ts
type PrivateCommentNode = {
  type: "privateComment";
  value: string;
  raw: string;
  position?: SourcePosition;
};
```

## TaskState

Task states are stored on Markdown list item nodes.

```ts
type TaskState = "unchecked" | "checked" | "cancelled" | "important";
```

Mapping:
- `[ ]` → `unchecked`
- `[x]` → `checked`
- `[-]` → `cancelled`
- `[!]` → `important`

The value MUST be stored as `MarkdownNode.data.nablaTaskState`.

## Block ID Ownership

Block IDs are stored on the attached block:

```ts
node.data.nablaBlockId = "id"
```

There is no standalone persisted `BlockIdNode` in v0.

This model applies to:
- paragraphs;
- headings;
- folded headings;
- list items;
- blockquotes;
- tables;
- callouts;
- toggles;
- transclusions.

## Diagnostic

```ts
type Diagnostic = {
  severity: "info" | "warning" | "error";
  code: string;
  message: string;
  position?: SourcePosition;
};
```

## Out of Scope

The AST MUST NOT contain:
- KbdNode;
- generic component node;
- generic attribute node;
- superscript node;
- subscript node.


## mdast Compatibility Rule

Implementation MAY import mdast and remark-gfm types directly.

If native mdast types are used, Nabla metadata MUST be stored in `node.data`:
- `data.nablaTaskState`
- `data.nablaBlockId`

Fixtures use mdast-compatible shapes.
