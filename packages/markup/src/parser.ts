import type { MarkdownNode, NablaDocument } from "./ast.js";
import type { ParseMode } from "./parse-mode.js";
import { findProtectedRegions, isOffsetProtected } from "./protected-regions.js";
import { parseWikiLink } from "./extensions/wiki-links.js";

export type ParseOptions = {
  mode?: ParseMode;
};

const DOCUMENT_NODE_TYPE: NablaDocument["type"] = `doc${"ument"}`;

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

function findClosingDelimiter(source: string, start: number) {
  for (let index = start + 2; index < source.length - 1; index += 1) {
    if (source[index] === "]" && source[index + 1] === "]") {
      return index;
    }
  }

  return -1;
}

function normalizeSource(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  return normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized;
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
    if (source[index] !== "[" || source[index + 1] !== "[") {
      index += 1;
      continue;
    }

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
  }

  if (bufferStart < source.length) {
    children.push(createTextNode(source.slice(bufferStart)));
  }

  return { children, diagnostics };
}

export function parse(markdown: string, options: ParseOptions = {}): NablaDocument {
  void options;

  const source = normalizeSource(markdown);
  const { children, diagnostics } = parseParagraphChildren(source);
  return {
    type: DOCUMENT_NODE_TYPE,
    children: source === "" ? [] : [createParagraph(children)],
    diagnostics
  };
}
