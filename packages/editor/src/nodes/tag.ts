import { findProtectedRegions, isOffsetProtected } from "@nabla/markup";

export const NABLA_TAG_NODE_VIEW = "node-safe-adapter";

export interface EditorTag {
  readonly index: number;
  readonly value: string;
  readonly segments: readonly string[];
  readonly raw: string;
}

const TAG_PATTERN = /#([A-Za-z0-9_][A-Za-z0-9_/-]*)/g;

type Range = {
  readonly start: number;
  readonly end: number;
};

function isHeadingMarker(markdown: string, offset: number): boolean {
  const lineStart = markdown.lastIndexOf("\n", offset - 1) + 1;
  return offset === lineStart && markdown[offset + 1] === " ";
}

function getHighlightRanges(markdown: string, protectedRegions: ReturnType<typeof findProtectedRegions>): readonly Range[] {
  const ranges: Range[] = [];

  for (let index = 0; index < markdown.length; index += 1) {
    if (markdown[index] !== "=" || markdown[index + 1] !== "=") {
      continue;
    }

    if (isOffsetProtected(protectedRegions, index)) {
      continue;
    }

    if (markdown[index + 2] === "{" && markdown[index + 3] === "#") {
      const closeBrace = markdown.indexOf("}", index + 4);
      if (closeBrace !== -1) {
        const closeHighlight = markdown.indexOf("==", closeBrace + 1);
        if (closeHighlight !== -1) {
          ranges.push({ start: index, end: closeHighlight + 2 });
          index = closeHighlight + 1;
          continue;
        }
      }
    }

    const closeHighlight = markdown.indexOf("==", index + 2);
    if (closeHighlight !== -1) {
      ranges.push({ start: index, end: closeHighlight + 2 });
      index = closeHighlight + 1;
    }
  }

  return ranges;
}

function isInRanges(offset: number, ranges: readonly Range[]): boolean {
  return ranges.some((range) => offset >= range.start && offset < range.end);
}

export function getTagsFromMarkdown(markdown: string): readonly EditorTag[] {
  const protectedRegions = findProtectedRegions(markdown);
  const highlightRanges = getHighlightRanges(markdown, protectedRegions);
  const tags: EditorTag[] = [];

  for (const match of markdown.matchAll(TAG_PATTERN)) {
    const raw = match[0];
    const value = match[1];
    const offset = match.index ?? -1;

    if (offset < 0) {
      continue;
    }

    if (isHeadingMarker(markdown, offset)) {
      continue;
    }

    if (isOffsetProtected(protectedRegions, offset)) {
      continue;
    }

    if (isInRanges(offset, highlightRanges)) {
      continue;
    }

    tags.push({
      index: tags.length,
      value,
      segments: value.split("/"),
      raw,
    });
  }

  return tags;
}

export function getTagNodeViews() {
  return Object.freeze({
    tag: NABLA_TAG_NODE_VIEW,
  });
}
