import type { MarkdownNode, NablaDocument, NablaBlockNode, FoldableHeadingNode, PrivateCommentNode, TaskState, FrontmatterNode, Diagnostic, FootnoteDefinitionNode, CalloutNode, FoldState, SyntaxStatus } from "./ast.js";
import type { ParseMode } from "./parse-mode.js";
import { findProtectedRegions, isOffsetProtected } from "./protected-regions.js";
import { parseWikiLink } from "./extensions/wiki-links.js";
import { parseTag } from "./extensions/tags.js";
import { parseHighlight } from "./extensions/highlights.js";
import { parsePrivateCommentBlock } from "./extensions/comments.js";
import { parseTaskStateMarker, parseListMarkerPrefix, hasBracketMarker } from "./extensions/task-states.js";
import { parseFrontmatterBlock } from "./extensions/frontmatter.js";
import { parseFootnoteReference, parseFootnoteDefinitionLine, buildFootnoteDefinition, collectFootnoteIds, collectFootnoteDiagnostics } from "./extensions/footnotes.js";
import { parseCalloutMarker, collectTabIndentedChildren, collectCompatibleChildren } from "./extensions/callouts.js";

export type ParseOptions = {
  mode?: ParseMode;
};

const DOCUMENT_NODE_TYPE: NablaDocument["type"] = `doc${"ument"}`;

const HEADING_PATTERN = /^(#{1,6}) (.+)/;
const FOLDABLE_HEADING_PATTERN = /^#v (.+)/;
const FENCE_PATTERN = /^( {0,3})(`{3,}|~{3,})(.*)$/;
const FENCE_CLOSE_PATTERN = /^( {0,3})(`{3,}|~{3,})[ \t]*$/;

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
  | { kind: "code"; lang: string; value: string }
  | { kind: "paragraph"; text: string }
  | { kind: "privateComment"; value: string; raw: string }
  | { kind: "html"; value: string }
  | { kind: "listItem"; taskState?: TaskState; text: string }
  | { kind: "frontmatter"; raw: string; data: Record<string, unknown> | null; diagnostic?: Diagnostic }
  | { kind: "thematicBreak" }
  | { kind: "footnoteDefinition"; id: string; content: string; raw: string }
  | { kind: "callout"; calloutType: string; foldState?: FoldState; title: string; syntax: SyntaxStatus; rawMarker: string; childContent: string };

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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i === 0 && line === "---") {
      const fmResult = parseFrontmatterBlock(lines, 0);
      if (fmResult !== null) {
        const isInvalid = fmResult.data === null;
        blocks.push({
          kind: "frontmatter",
          raw: fmResult.raw,
          data: fmResult.data,
          ...(isInvalid
            ? {
                diagnostic: {
                  severity: "warning" as const,
                  code: "NABLA_FRONTMATTER_INVALID",
                  message: "Frontmatter could not be parsed."
                }
              }
            : {})
        });
        i = fmResult.endIndex;
        continue;
      }
    }

    const fenceMatch = line.match(FENCE_PATTERN);
    if (fenceMatch) {
      flushParagraph();
      const fence = fenceMatch[2];
      const marker = fence[0];
      const minLength = fence.length;
      const lang = fenceMatch[3].trim();
      const valueLines: string[] = [];

      i += 1;
      while (i < lines.length) {
        const innerLine = lines[i];
        const closeMatch = innerLine.match(FENCE_CLOSE_PATTERN);
        if (closeMatch && closeMatch[2][0] === marker && closeMatch[2].length >= minLength) {
          break;
        }
        valueLines.push(innerLine);
        i += 1;
      }

      blocks.push({ kind: "code", lang, value: valueLines.join("\n") });
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      continue;
    }

    if (line === "---" && i !== 0) {
      flushParagraph();
      blocks.push({ kind: "thematicBreak" });
      continue;
    }

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

    const privateMatch = parsePrivateCommentBlock(lines, i);
    if (privateMatch !== null) {
      flushParagraph();
      blocks.push({ kind: "privateComment", value: privateMatch.value, raw: privateMatch.raw });
      i = privateMatch.endIndex;
      continue;
    }

    const listPrefix = parseListMarkerPrefix(line);
    if (listPrefix !== null) {
      flushParagraph();
      const taskState = parseTaskStateMarker(line);
      if (taskState !== null) {
        blocks.push({ kind: "listItem", taskState: taskState.state, text: taskState.text });
      } else if (hasBracketMarker(listPrefix.rest)) {
        blocks.push({ kind: "listItem", text: listPrefix.rest });
      } else {
        paragraphLines.push(line);
        continue;
      }
      continue;
    }

    if (line.startsWith("<!--")) {
      flushParagraph();
      const closingIndex = line.indexOf("-->");
      if (closingIndex !== -1) {
        blocks.push({ kind: "html", value: line.slice(0, closingIndex + 3) });
        continue;
      }

      const htmlLines: string[] = [line];
      i += 1;
      while (i < lines.length) {
        const nextLine = lines[i];
        htmlLines.push(nextLine);
        const closeIdx = nextLine.indexOf("-->");
        if (closeIdx !== -1) break;
        i += 1;
      }
      blocks.push({ kind: "html", value: htmlLines.join("\n") });
      continue;
    }

    const fnDefMatch = parseFootnoteDefinitionLine(line);
    if (fnDefMatch !== null) {
      flushParagraph();
      blocks.push({ kind: "footnoteDefinition", id: fnDefMatch.id, content: fnDefMatch.content, raw: fnDefMatch.raw });
      continue;
    }

    const calloutMarker = parseCalloutMarker(line);
    if (calloutMarker !== null) {
      flushParagraph();

      if (calloutMarker.syntax === "compatible") {
        const { childLines, endIndex } = collectCompatibleChildren(lines, i + 1);
        blocks.push({
          kind: "callout",
          calloutType: calloutMarker.calloutType,
          foldState: calloutMarker.foldState,
          title: calloutMarker.title,
          syntax: calloutMarker.syntax,
          rawMarker: calloutMarker.rawMarker,
          childContent: childLines.join("\n")
        });
        i = endIndex;
      } else {
        const { childLines, endIndex } = collectTabIndentedChildren(lines, i + 1);
        blocks.push({
          kind: "callout",
          calloutType: calloutMarker.calloutType,
          foldState: calloutMarker.foldState,
          title: calloutMarker.title,
          syntax: calloutMarker.syntax,
          rawMarker: calloutMarker.rawMarker,
          childContent: childLines.join("\n")
        });
        i = endIndex;
      }

      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  return blocks;
}

function extractInlineCodeValue(text: string): string {
  let backtickLen = 0;
  while (backtickLen < text.length && text[backtickLen] === "`") {
    backtickLen += 1;
  }
  return text.slice(backtickLen, text.length - backtickLen);
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
  const inlineCodeRegions = protectedRegions.filter((r) => r.kind === "inlineCode");
  const children: MarkdownNode[] = [];
  const diagnostics: NablaDocument["diagnostics"] = [];
  let bufferStart = 0;
  let index = 0;

  while (index < source.length - 1) {
    const codeRegion = inlineCodeRegions.find((r) => r.start === index);
    if (codeRegion) {
      if (!inlineHtmlContainers.some((region) => index >= region.start && index < region.end)) {
        if (bufferStart < index) {
          children.push(createTextNode(source.slice(bufferStart, index)));
        }
        children.push({ type: "inlineCode", value: extractInlineCodeValue(codeRegion.text) } as MarkdownNode);
        bufferStart = codeRegion.end;
        index = codeRegion.end;
        continue;
      }
    }

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

    if (source[index] === "[" && source[index + 1] === "^") {
      if (
        isOffsetProtected(protectedRegions, index) ||
        inlineHtmlContainers.some((region) => index >= region.start && index < region.end)
      ) {
        index += 2;
        continue;
      }

      const fnRef = parseFootnoteReference(source.slice(index));
      if (fnRef !== null) {
        if (bufferStart < index) {
          children.push(createTextNode(source.slice(bufferStart, index)));
        }
        children.push(fnRef as MarkdownNode);
        bufferStart = index + fnRef.raw.length;
        index = bufferStart;
        continue;
      }

      index += 2;
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

  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
    const block = blocks[blockIndex];
    if (block.kind === "paragraph") {
      const { children, diagnostics } = parseParagraphChildren(block.text);
      allDiagnostics.push(...diagnostics);
      docChildren.push(createParagraph(children));
    } else if (block.kind === "code") {
      docChildren.push({
        type: "code",
        lang: block.lang,
        value: block.value
      } as MarkdownNode);
    } else if (block.kind === "heading") {
      docChildren.push(createHeading(block.depth, block.content));
    } else if (block.kind === "foldableHeading") {
      docChildren.push(createFoldableHeading(block.content));
    } else if (block.kind === "privateComment") {
      docChildren.push({
        type: "privateComment",
        value: block.value,
        raw: block.raw
      } as PrivateCommentNode);
    } else if (block.kind === "html") {
      docChildren.push({
        type: "html",
        value: block.value
      } as MarkdownNode);
    } else if (block.kind === "frontmatter") {
      if (block.diagnostic) {
        allDiagnostics.push(block.diagnostic);
      }
      docChildren.push({
        type: "frontmatter",
        raw: block.raw,
        data: block.data
      } as FrontmatterNode);
    } else if (block.kind === "thematicBreak") {
      docChildren.push({
        type: "thematicBreak"
      } as MarkdownNode);
    } else if (block.kind === "footnoteDefinition") {
      docChildren.push(buildFootnoteDefinition(block.id, block.content, block.raw) as unknown as NablaBlockNode);
    } else if (block.kind === "listItem") {
      const items: Array<{ taskState?: TaskState; text: string }> = [
        { taskState: block.taskState, text: block.text }
      ];
      while (blockIndex + 1 < blocks.length && blocks[blockIndex + 1].kind === "listItem") {
        blockIndex++;
        const nextBlock = blocks[blockIndex] as BlockSpec & { kind: "listItem" };
        items.push({ taskState: nextBlock.taskState, text: nextBlock.text });
      }
      docChildren.push({
        type: "list",
        ordered: false,
        children: items.map((item) => ({
          type: "listItem",
          ...(item.taskState ? { data: { nablaTaskState: item.taskState } } : {}),
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", value: item.text }]
            }
          ]
        }))
      } as MarkdownNode);
    } else if (block.kind === "callout") {
      const titleDoc = parse(block.title);
      const titleChildren = titleDoc.children.length === 1 && titleDoc.children[0].type === "paragraph"
        ? (titleDoc.children[0] as MarkdownNode).children ?? []
        : [];
      const childDoc = block.childContent !== "" ? parse(block.childContent) : null;
      allDiagnostics.push(...titleDoc.diagnostics);
      if (childDoc) {
        allDiagnostics.push(...childDoc.diagnostics);
      }

      const calloutNode: CalloutNode = {
        type: "callout",
        calloutType: block.calloutType,
        title: titleChildren as import("./ast.js").NablaInlineNode[],
        ...(block.foldState ? { foldState: block.foldState } : {}),
        children: childDoc ? (childDoc.children as Array<MarkdownNode | NablaBlockNode>) : [],
        syntax: block.syntax,
        rawMarker: block.rawMarker
      };

      docChildren.push(calloutNode as unknown as NablaBlockNode);
    }
  }

  const doc: NablaDocument = {
    type: DOCUMENT_NODE_TYPE,
    children: docChildren,
    diagnostics: allDiagnostics
  };

  const { referenceIds, definitionIds } = collectFootnoteIds(doc);
  const footnoteDiagnostics = collectFootnoteDiagnostics(referenceIds, definitionIds);
  doc.diagnostics.push(...footnoteDiagnostics);

  return doc;
}

function normalizeSource(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  return normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized;
}
