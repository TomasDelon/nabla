import type { ParseMode } from "./parse-mode.js";

export type SourcePoint = {
  line: number;
  column: number;
  offset: number;
};

export type SourcePosition = {
  start: SourcePoint;
  end: SourcePoint;
};

export type FoldState = "open" | "closed";
export type SyntaxStatus = "canonical" | "compatible";
export type TaskState = "unchecked" | "checked" | "cancelled" | "important";
export type DiagnosticSeverity = "info" | "warning" | "error";

export type MarkdownData = {
  nablaTaskState?: TaskState;
  nablaBlockId?: string;
  [key: string]: unknown;
};

export type BlockNodeData = {
  nablaBlockId?: string;
};

export type Diagnostic = {
  severity: DiagnosticSeverity;
  code: string;
  message: string;
  position?: SourcePosition;
};

export type DocumentNodeType = `doc${"ument"}`;

export type MarkdownNode = {
  type: string;
  value?: string;
  children?: Array<MarkdownNode | NablaInlineNode | NablaBlockNode>;
  data?: MarkdownData;
  position?: SourcePosition;
  [key: string]: unknown;
};

export type TextNode = {
  type: "text";
  value: string;
  position?: SourcePosition;
};

export type FrontmatterNode = {
  type: "frontmatter";
  raw: string;
  data: Record<string, unknown> | null;
  position?: SourcePosition;
};

export type WikiLinkNode = {
  type: "wikiLink";
  target: string;
  alias?: string;
  heading?: string;
  blockId?: string;
  syntax: SyntaxStatus;
  raw: string;
  position?: SourcePosition;
};

export type TransclusionNode = {
  type: "transclusion";
  target: string;
  heading?: string;
  blockId?: string;
  syntax: SyntaxStatus;
  raw: string;
  data?: BlockNodeData;
  position?: SourcePosition;
};

export type TagNode = {
  type: "tag";
  value: string;
  segments: string[];
  raw: string;
  position?: SourcePosition;
};

export type TooltipNode = {
  type: "tooltip";
  target: NablaInlineNode[];
  tooltip: string;
  raw: string;
  position?: SourcePosition;
};

export type HighlightNode = {
  type: "highlight";
  children: NablaInlineNode[];
  raw: string;
  position?: SourcePosition;
};

export type ColorHighlightNode = {
  type: "colorHighlight";
  color: string;
  children: NablaInlineNode[];
  raw: string;
  position?: SourcePosition;
};

export type EmojiShortcodeNode = {
  type: "emojiShortcode";
  name: string;
  raw: string;
  position?: SourcePosition;
};

export type FootnoteReferenceNode = {
  type: "footnoteReference";
  id: string;
  raw: string;
  position?: SourcePosition;
};

export type FootnoteDefinitionNode = {
  type: "footnoteDefinition";
  id: string;
  children: Array<MarkdownNode | NablaBlockNode>;
  raw: string;
  position?: SourcePosition;
};

export type CalloutNode = {
  type: "callout";
  calloutType: string;
  title: NablaInlineNode[];
  foldState?: FoldState;
  children: Array<MarkdownNode | NablaBlockNode>;
  syntax: SyntaxStatus;
  rawMarker: string;
  data?: BlockNodeData;
  position?: SourcePosition;
};

export type ToggleNode = {
  type: "toggle";
  title: NablaInlineNode[];
  foldState: FoldState;
  children: Array<MarkdownNode | NablaBlockNode>;
  rawMarker: "]>" | "]v";
  data?: BlockNodeData;
  position?: SourcePosition;
};

export type FoldableHeadingNode = {
  type: "foldableHeading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  foldState: FoldState;
  title: NablaInlineNode[];
  rawMarker: string;
  data?: BlockNodeData;
  position?: SourcePosition;
};

export type PrivateCommentNode = {
  type: "privateComment";
  value: string;
  raw: string;
  position?: SourcePosition;
};

export type NablaInlineNode =
  | TextNode
  | WikiLinkNode
  | TagNode
  | TooltipNode
  | HighlightNode
  | ColorHighlightNode
  | EmojiShortcodeNode
  | FootnoteReferenceNode;

export type NablaBlockNode =
  | FrontmatterNode
  | TransclusionNode
  | CalloutNode
  | ToggleNode
  | FoldableHeadingNode
  | PrivateCommentNode
  | FootnoteDefinitionNode;

export type NablaDocument = {
  type: DocumentNodeType;
  children: Array<MarkdownNode | NablaBlockNode>;
  diagnostics: Diagnostic[];
};

export type { ParseMode };
