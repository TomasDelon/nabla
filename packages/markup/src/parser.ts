import type { MarkdownNode, NablaDocument, NablaBlockNode, FoldableHeadingNode } from "./ast.js";
import type { ParseMode } from "./parse-mode.js";
import { findProtectedRegions, isOffsetProtected } from "./protected-regions.js";
import { parseWikiLink } from "./extensions/wiki-links.js";
import { parseTag } from "./extensions/tags.js";
import { parseHighlight } from "./extensions/highlights.js";

export type ParseOptions = {
  mode?: ParseMode;
};

const DOCUMENT_NODE_TYPE: NablaDocument["type"] = `doc${"ument"}`;

const HEADING_PATTERN = /^(#{1,6}) (.+)/;
const FOLDABLE_HEADING_PATTERN = /^#v (.+)/;

function createTextNode(value: string): MarkdownNode {
  return {
    type: "text",
    value
  };
}

function createParagraph(children: MarkdownNode[]) {
  return {
    type: "paragraph",
    children
  } as MarkdownNode;
}

function createHeading(depth: number, content: string): MarkdownNode {
  return {
    type: "heading",
    depth,
    children: [createTextNode(content)]
  };
}

function createFoldableHeading(content: string): NablaBlockNode {
  return {
    type: "foldableHeading",
    depth: 1,
    foldState: "open",
    title: [createTextNode(content)],
    rawMarker: "#v"
  } as unknown as FoldableHeadingNode;
}

type BlockSpec =
  | { kind: "heading"; depth: number; content: string }
  | { kind: "foldableHeading"; content: string }
  | { kind: "paragraph"; text: string };

function parseBlocks(source: string): BlockSpec[] {
  const lines = source.split("\n");
  const blocks: BlockSpec[] = [];
  let paragraphLines: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      blocks.push({ kind: "paragraph", text: paragraphLines.join("\n") });
      paragraphLines = [];
    }
  }

  for (const line of lines) {
    const foldMatch = line.match(FOLDABLE_HEADING_PATTERN);
    if (foldMatch) {
      flushParagraph();
      blocks.push({ kind: "foldableHeading", content: foldMatch[1] });
      continue;
    }

    const headingMatch = line.match(HEADING_PATTERN);
    if (headingMatch) {
      flushParagraph();
      blocks.push({ kind: "heading", depth: headingMatch[1].length, content: headingMatch[2] });
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  return blocks;
}

function findClosingDelimiter(source: string, start: number) {
  for (let index = start + 2; index < source.length - 1; index += 1) {
    if (source[index] === "]" && source[index + 1] === "]") {
      return index;
    }
  }

  return -1;
}

function findInlineHtmlContainerRanges(source: string) {
  const regions: Array<{ start: number; end: number }> = [];
  const tagPattern = /<([A-Za-z][A-Za-z0-9-]*)(?:\s[^<>\n]*)?>/g;

  for (const match of source.matchAll(tagPattern)) {
    const tagName = match[1];
    const start = match.index ?? 0;
    const opening = match[0];
    const closing = `</${tagName}>`;
    const closingStart = source.indexOf(closing, start + opening.length);
    if (closingStart !== -1) {
      regions.push({ start, end: closingStart + closing.length });
    }
  }

  return regions;
}

function parseParagraphChildren(source: string) {
  const protectedRegions = findProtectedRegions(source);
  const inlineHtmlContainers = findInlineHtmlContainerRanges(source);
  const children: MarkdownNode[] = [];
  const diagnostics: NablaDocument["diagnostics"] = [];
  let bufferStart = 0;
  let index = 0;

  while (index < source.length - 1) {
    if (source[index] === "[" && source[index + 1] === "[") {
      if (index > 0 && source[index - 1] === "!") {
        index += 2;
        continue;
      }

      if (
        isOffsetProtected(protectedRegions, index) ||
        inlineHtmlContainers.some((region) => index >= region.start && index < region.end)
      ) {
        index += 2;
        continue;
      }

      const closingIndex = findClosingDelimiter(source, index);
      if (closingIndex === -1 || isOffsetProtected(protectedRegions, closingIndex)) {
        index += 2;
        continue;
      }

      const raw = source.slice(index, closingIndex + 2);
      const parsed = parseWikiLink(raw);
      if ("node" in parsed) {
        if (bufferStart < index) {
          children.push(createTextNode(source.slice(bufferStart, index)));
        }
        children.push(parsed.node as MarkdownNode);
        bufferStart = closingIndex + 2;
      } else {
        diagnostics.push(parsed.diagnostic);
      }

      index = closingIndex + 2;
      continue;
    }

    if (source[index] === "=" && index + 1 < source.length && source[index + 1] === "=") {
      if (
        isOffsetProtected(protectedRegions, index) ||
        inlineHtmlContainers.some((region) => index >= region.start && index < region.end)
      ) {
        index += 2;
        continue;
      }

      const parsed = parseHighlight(source.slice(index));
      if ("node" in parsed) {
        if (bufferStart < index) {
          children.push(createTextNode(source.slice(bufferStart, index)));
        }
        children.push(parsed.node as MarkdownNode);
        bufferStart = index + parsed.length;
      } else if (parsed.diagnostics) {
        diagnostics.push(...parsed.diagnostics);
      }
      index += parsed.length;
      continue;
    }

    if (source[index] === "#") {
      if (
        isOffsetProtected(protectedRegions, index) ||
        inlineHtmlContainers.some((region) => index >= region.start && index < region.end)
      ) {
        index += 1;
        continue;
      }

      const tagNode = parseTag(source.slice(index));
      if (tagNode !== null) {
        if (bufferStart < index) {
          children.push(createTextNode(source.slice(bufferStart, index)));
        }
        children.push(tagNode as MarkdownNode);
        bufferStart = index + tagNode.raw.length;
        index = bufferStart;
        continue;
      }
    }

    index += 1;
  }

  if (bufferStart < source.length) {
    children.push(createTextNode(source.slice(bufferStart)));
  }

  return { children, diagnostics };
}

export function parse(markdown: string, options: ParseOptions = {}): NablaDocument {
  void options;

  const source = normalizeSource(markdown);
  const allDiagnostics: NablaDocument["diagnostics"] = [];

  if (source === "") {
    return {
      type: DOCUMENT_NODE_TYPE,
      children: [],
      diagnostics: []
    };
  }

  const blocks = parseBlocks(source);
  const docChildren: Array<MarkdownNode | NablaBlockNode> = [];

  for (const block of blocks) {
    if (block.kind === "paragraph") {
      const { children, diagnostics } = parseParagraphChildren(block.text);
      allDiagnostics.push(...diagnostics);
      docChildren.push(createParagraph(children));
    } else if (block.kind === "heading") {
      docChildren.push(createHeading(block.depth, block.content));
    } else if (block.kind === "foldableHeading") {
      docChildren.push(createFoldableHeading(block.content));
    }
  }

  return {
    type: DOCUMENT_NODE_TYPE,
    children: docChildren,
    diagnostics: allDiagnostics
  };
}

function normalizeSource(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  return normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized;
}
