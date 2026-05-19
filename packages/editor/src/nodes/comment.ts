import { findProtectedRegions, isOffsetProtected } from "@nabla/markup";

export const NABLA_COMMENT_NODE_VIEW = "node-safe-adapter";

export interface EditorComment {
  readonly index: number;
  readonly raw: string;
  readonly text: string;
  readonly multiline: boolean;
}

export function getCommentsFromMarkdown(markdown: string): readonly EditorComment[] {
  const protectedRegions = findProtectedRegions(markdown);
  const comments: EditorComment[] = [];
  const lines = markdown.split("\n");

  for (let startIndex = 0; startIndex < lines.length; startIndex += 1) {
    const startOffset = lines.slice(0, startIndex).join("\n").length + (startIndex > 0 ? 1 : 0);
    if (isOffsetProtected(protectedRegions, startOffset)) {
      continue;
    }

    const firstLine = lines[startIndex];
    if (!firstLine.startsWith("%%")) {
      continue;
    }

    for (let endIndex = startIndex; endIndex < lines.length; endIndex += 1) {
      const line = lines[endIndex];
      const closeIndex = line.lastIndexOf("%%");
      if (closeIndex <= 0) {
        continue;
      }

      const afterClose = line.slice(closeIndex + 2);
      if (afterClose.trim() !== "") {
        continue;
      }

      const raw = lines.slice(startIndex, endIndex + 1).join("\n");
      comments.push({
        index: comments.length,
        raw,
        text: raw.slice(2, -2).trim(),
        multiline: endIndex > startIndex,
      });
      startIndex = endIndex;
      break;
    }
  }

  return comments;
}

export function getCommentNodeViews() {
  return Object.freeze({
    comment: NABLA_COMMENT_NODE_VIEW,
  });
}
