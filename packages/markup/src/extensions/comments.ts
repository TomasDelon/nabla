import type { PrivateCommentNode } from "../ast.js";

export function parsePrivateCommentBlock(
  lines: string[],
  startIndex: number
): { value: string; raw: string; endIndex: number } | null {
  const firstLine = lines[startIndex];
  if (!firstLine.startsWith("%%")) return null;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const closeIdx = line.lastIndexOf("%%");
    if (closeIdx > 0) {
      const afterClose = line.slice(closeIdx + 2);
      if (afterClose.trim() !== "") continue;

      const commentLines = lines.slice(startIndex, i + 1);
      const raw = commentLines.join("\n");
      const value = raw.slice(2, -2).trim();
      return { value, raw, endIndex: i };
    }
  }

  return null;
}

export function serializePrivateComment(node: PrivateCommentNode): string {
  return node.raw;
}
