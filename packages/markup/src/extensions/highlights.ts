import type { HighlightNode, ColorHighlightNode, Diagnostic } from "../ast.js";
import { DIAGNOSTIC_CODES } from "../diagnostics.js";

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function isValidHexColor(color: string): boolean {
  return HEX_COLOR.test(color);
}

export function parseHighlight(source: string): {
  node?: HighlightNode | ColorHighlightNode;
  diagnostics?: Diagnostic[];
  length: number;
} {
  if (source.length >= 5 && source[2] === "{" && source[3] === "#") {
    const closeBrace = source.indexOf("}", 4);
    if (closeBrace !== -1) {
      const color = source.slice(3, closeBrace);
      const contentStart = closeBrace + 1;
      const closingIndex = source.indexOf("==", contentStart);

      if (closingIndex !== -1) {
        if (isValidHexColor(color)) {
          const content = source.slice(contentStart, closingIndex);
          return {
            node: {
              type: "colorHighlight",
              color,
              children: [{ type: "text", value: content }],
              raw: source.slice(0, closingIndex + 2)
            } as ColorHighlightNode,
            length: closingIndex + 2
          };
        }

        return {
          diagnostics: [
            {
              severity: "warning",
              code: DIAGNOSTIC_CODES.HIGHLIGHT_INVALID_COLOR,
              message: "Invalid highlight color."
            }
          ],
          length: closingIndex + 2
        };
      }
    }
  }

  const closingIndex = source.indexOf("==", 2);
  if (closingIndex !== -1) {
    const content = source.slice(2, closingIndex);
    return {
      node: {
        type: "highlight",
        children: [{ type: "text", value: content }],
        raw: source.slice(0, closingIndex + 2)
      } as HighlightNode,
      length: closingIndex + 2
    };
  }

  return {
    diagnostics: [
      {
        severity: "warning",
        code: DIAGNOSTIC_CODES.HIGHLIGHT_UNCLOSED,
        message: "Highlight is not closed."
      }
    ],
    length: 2
  };
}

export function serializeHighlight(node: HighlightNode): string {
  const content = node.children.map((child) => (child as { value?: string }).value ?? "").join("");
  return `==${content}==`;
}

export function serializeColorHighlight(node: ColorHighlightNode): string {
  const content = node.children.map((child) => (child as { value?: string }).value ?? "").join("");
  return `=={${node.color}}${content}==`;
}
