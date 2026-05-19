import { findProtectedRegions, isOffsetProtected } from "@nabla/markup";

export const NABLA_HIGHLIGHT_NODE_VIEW = "node-safe-adapter";

export interface EditorHighlight {
  readonly index: number;
  readonly raw: string;
  readonly text: string;
  readonly color?: string;
  readonly kind: "highlight" | "colorHighlight";
}

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function getHighlightsFromMarkdown(markdown: string): readonly EditorHighlight[] {
  const protectedRegions = findProtectedRegions(markdown);
  const highlights: EditorHighlight[] = [];

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
        const color = markdown.slice(index + 3, closeBrace);
        const closeHighlight = markdown.indexOf("==", closeBrace + 1);
        if (closeHighlight !== -1 && HEX_COLOR.test(color)) {
          const raw = markdown.slice(index, closeHighlight + 2);
          highlights.push({
            index: highlights.length,
            raw,
            text: markdown.slice(closeBrace + 1, closeHighlight),
            color,
            kind: "colorHighlight",
          });
          index = closeHighlight + 1;
          continue;
        }
      }
    }

    const closeHighlight = markdown.indexOf("==", index + 2);
    if (closeHighlight !== -1) {
      const raw = markdown.slice(index, closeHighlight + 2);
      highlights.push({
        index: highlights.length,
        raw,
        text: markdown.slice(index + 2, closeHighlight),
        kind: "highlight",
      });
      index = closeHighlight + 1;
    }
  }

  return highlights;
}

export function getHighlightNodeViews() {
  return Object.freeze({
    highlight: NABLA_HIGHLIGHT_NODE_VIEW,
  });
}
