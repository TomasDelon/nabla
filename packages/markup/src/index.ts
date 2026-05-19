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
export { parse } from "./parser.js";
export { findProtectedRegions, isOffsetProtected } from "./protected-regions.js";
export { serialize } from "./serializer.js";
export {
  compareFixtureAst,
  compareFixtureDiagnostics,
  compareFixtureInput,
  compareFixtureOutput,
  compareParserFixtureExpectation,
  listParserFixtureIds,
  loadAllParserFixtures,
  loadMarkupFixture,
  loadParserFixture,
  resolveSpecFixturesRoot
} from "./fixtures.js";
export type {
  DiagnosticCatalog,
  DiagnosticCatalogEntry,
  DiagnosticCode
} from "./diagnostics.js";
export type { ParseOptions } from "./parser.js";
export {
  parseTransclusionLine,
  serializeTransclusion
} from "./extensions/transclusions.js";
export type {
  ProtectedRegion,
  ProtectedRegionKind
} from "./protected-regions.js";
export type { SerializeOptions } from "./serializer.js";
export type {
  ExpectedDiagnostic,
  FixtureLoaderOptions,
  FixturePaths,
  MarkupFixture,
  ParserFixtureExpectation,
  ParserFixture,
  WorkspaceFixtureMetadata
} from "./fixtures.js";
