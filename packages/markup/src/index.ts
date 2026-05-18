export const NABLA_MARKUP_PACKAGE = "@nabla/markup";

export type {
  BlockNodeData,
  CalloutNode,
  ColorHighlightNode,
  Diagnostic,
  DiagnosticSeverity,
  FoldState,
  FoldableHeadingNode,
  FootnoteDefinitionNode,
  FootnoteReferenceNode,
  FrontmatterNode,
  HighlightNode,
  MarkdownData,
  MarkdownNode,
  NablaBlockNode,
  NablaDocument,
  NablaInlineNode,
  PrivateCommentNode,
  SourcePoint,
  SourcePosition,
  SyntaxStatus,
  TagNode,
  TaskState,
  TextNode,
  ToggleNode,
  TooltipNode,
  TransclusionNode,
  WikiLinkNode,
  EmojiShortcodeNode,
} from "./ast.js";
export type { ParseMode } from "./parse-mode.js";
export {
  DIAGNOSTIC_CATALOG,
  DIAGNOSTIC_CODES
} from "./diagnostics.js";
export {
  loadMarkupFixture,
  loadParserFixture,
  resolveSpecFixturesRoot
} from "./fixtures.js";
export type {
  DiagnosticCatalog,
  DiagnosticCatalogEntry,
  DiagnosticCode
} from "./diagnostics.js";
export type {
  FixtureLoaderOptions,
  FixturePaths,
  MarkupFixture,
  ParserFixture,
  WorkspaceFixtureMetadata
} from "./fixtures.js";
