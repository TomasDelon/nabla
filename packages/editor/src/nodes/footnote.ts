import { findProtectedRegions, isOffsetProtected } from "@nabla/markup";

export const NABLA_FOOTNOTE_NODE_VIEW = "node-safe-adapter";

export interface EditorFootnote {
  readonly index: number;
  readonly kind: "reference" | "definition";
  readonly id: string;
  readonly raw: string;
  readonly text?: string;
}

const FOOTNOTE_REFERENCE_PATTERN = /\[\^([^\s\]]+)\]/g;
const FOOTNOTE_DEFINITION_PATTERN = /^\[\^([^\s\]]+)\]:\s*(.*)$/;

export function getFootnotesFromMarkdown(markdown: string): readonly EditorFootnote[] {
  const protectedRegions = findProtectedRegions(markdown);
  const footnotes: EditorFootnote[] = [];
  const lines = markdown.split("\n");
  let offset = 0;

  for (const line of lines) {
    const definitionMatch = line.match(FOOTNOTE_DEFINITION_PATTERN);
    if (definitionMatch && !isOffsetProtected(protectedRegions, offset)) {
      footnotes.push({
        index: footnotes.length,
        kind: "definition",
        id: definitionMatch[1],
        raw: line,
        text: definitionMatch[2],
      });
    }

    offset += line.length + 1;
  }

  for (const match of markdown.matchAll(FOOTNOTE_REFERENCE_PATTERN)) {
    const raw = match[0];
    const id = match[1];
    const start = match.index ?? -1;
    if (start < 0 || isOffsetProtected(protectedRegions, start)) {
      continue;
    }

    const lineStart = markdown.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = markdown.indexOf("\n", start);
    const line = markdown.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    if (FOOTNOTE_DEFINITION_PATTERN.test(line) && line.startsWith(raw)) {
      continue;
    }

    footnotes.push({
      index: footnotes.length,
      kind: "reference",
      id,
      raw,
    });
  }

  return footnotes;
}

export function getFootnoteNodeViews() {
  return Object.freeze({
    footnote: NABLA_FOOTNOTE_NODE_VIEW,
  });
}
