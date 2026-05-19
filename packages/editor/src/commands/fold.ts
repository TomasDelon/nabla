import { loadSource } from "../editor.js";

import type { Editor } from "../editor.js";

type FoldMatch = {
  readonly lineIndex: number;
};

const CALLOUT_RE = /^(\[![A-Za-z][A-Za-z0-9_-]*])(>|v)([ \t]*.*)$/;
const TOGGLE_RE = /^(])(>|v)([ \t]*.*)$/;
const FOLDED_HEADING_RE = /^(#{1,6})(>|v)( .+)$/;

function toggleMarker(marker: string): ">" | "v" {
  return marker === ">" ? "v" : ">";
}

function toggleMatchedLine(
  markdown: string,
  matches: readonly FoldMatch[],
  index: number,
  rewriter: (line: string) => string,
): string {
  const match = matches[index];
  if (!match) {
    throw new RangeError(`Fold index out of range: ${index}`);
  }

  const lines = markdown.split("\n");
  lines[match.lineIndex] = rewriter(lines[match.lineIndex]);
  return lines.join("\n");
}

function getCalloutFoldMatches(markdown: string): readonly FoldMatch[] {
  return markdown
    .split("\n")
    .flatMap((line, lineIndex) => (CALLOUT_RE.test(line) ? [{ lineIndex }] : []));
}

function getToggleFoldMatches(markdown: string): readonly FoldMatch[] {
  return markdown
    .split("\n")
    .flatMap((line, lineIndex) => (TOGGLE_RE.test(line) ? [{ lineIndex }] : []));
}

function getFoldedHeadingMatches(markdown: string): readonly FoldMatch[] {
  return markdown
    .split("\n")
    .flatMap((line, lineIndex) => (FOLDED_HEADING_RE.test(line) ? [{ lineIndex }] : []));
}

export function toggleCalloutFoldInMarkdown(markdown: string, index: number): string {
  return toggleMatchedLine(markdown, getCalloutFoldMatches(markdown), index, (line) =>
    line.replace(CALLOUT_RE, (_, prefix: string, marker: string, suffix: string) => `${prefix}${toggleMarker(marker)}${suffix}`),
  );
}

export function toggleToggleFoldInMarkdown(markdown: string, index: number): string {
  return toggleMatchedLine(markdown, getToggleFoldMatches(markdown), index, (line) =>
    line.replace(TOGGLE_RE, (_, prefix: string, marker: string, suffix: string) => `${prefix}${toggleMarker(marker)}${suffix}`),
  );
}

export function toggleFoldedHeadingFoldInMarkdown(markdown: string, index: number): string {
  return toggleMatchedLine(markdown, getFoldedHeadingMatches(markdown), index, (line) =>
    line.replace(FOLDED_HEADING_RE, (_, hashes: string, marker: string, suffix: string) => `${hashes}${toggleMarker(marker)}${suffix}`),
  );
}

export function toggleCalloutFold(editor: Editor, index: number): Editor {
  return loadSource(editor, toggleCalloutFoldInMarkdown(editor.source, index));
}

export function toggleToggleFold(editor: Editor, index: number): Editor {
  return loadSource(editor, toggleToggleFoldInMarkdown(editor.source, index));
}

export function toggleFoldedHeadingFold(editor: Editor, index: number): Editor {
  return loadSource(editor, toggleFoldedHeadingFoldInMarkdown(editor.source, index));
}
