import type { Diagnostic, FootnoteReferenceNode, FootnoteDefinitionNode, MarkdownNode, NablaDocument, NablaBlockNode } from "../ast.js";
import { DIAGNOSTIC_CODES } from "../diagnostics.js";

export function parseFootnoteReference(raw: string): FootnoteReferenceNode | null {
  if (!raw.startsWith("[^")) return null;

  const closeBracket = raw.indexOf("]");
  if (closeBracket === -1 || closeBracket < 3) return null;

  const id = raw.slice(2, closeBracket);
  if (id.length === 0 || /\s/.test(id)) return null;

  return {
    type: "footnoteReference",
    id,
    raw: raw.slice(0, closeBracket + 1)
  };
}

export function parseFootnoteDefinitionLine(line: string): { id: string; content: string; raw: string } | null {
  const match = line.match(/^\[\^([^\s\]]+)\]:\s*(.*)$/);
  if (!match) return null;

  return {
    id: match[1],
    content: match[2],
    raw: line
  };
}

export function buildFootnoteDefinition(id: string, content: string, raw: string): FootnoteDefinitionNode {
  return {
    type: "footnoteDefinition",
    id,
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: content }]
      }
    ],
    raw
  };
}

export function serializeFootnoteReference(node: FootnoteReferenceNode): string {
  return node.raw;
}

export function serializeFootnoteDefinition(node: FootnoteDefinitionNode): string {
  return `\n${node.raw}`;
}

export function collectFootnoteIds(
  doc: NablaDocument
): { referenceIds: string[]; definitionIds: string[] } {
  const referenceIds: string[] = [];
  const definitionIds: string[] = [];

  function walkChildren(children: Array<MarkdownNode | NablaBlockNode>) {
    for (const child of children) {
      if (child.type === "footnoteReference") {
        referenceIds.push((child as FootnoteReferenceNode).id);
      } else if (child.type === "footnoteDefinition") {
        definitionIds.push((child as FootnoteDefinitionNode).id);
      }
      if ("children" in child && Array.isArray(child.children)) {
        walkChildren(child.children as Array<MarkdownNode | NablaBlockNode>);
      }
    }
  }

  walkChildren(doc.children);

  return { referenceIds, definitionIds };
}

export function collectFootnoteDiagnostics(
  referenceIds: string[],
  definitionIds: string[]
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const refSet = new Set(referenceIds);
  const defSet = new Set(definitionIds);

  for (const id of referenceIds) {
    if (!defSet.has(id)) {
      diagnostics.push({
        severity: "warning",
        code: DIAGNOSTIC_CODES.FOOTNOTE_MISSING_DEFINITION,
        message: "Footnote reference has no matching definition."
      });
    }
  }

  for (const id of definitionIds) {
    if (!refSet.has(id)) {
      diagnostics.push({
        severity: "info",
        code: DIAGNOSTIC_CODES.FOOTNOTE_UNUSED_DEFINITION,
        message: "Footnote definition is not referenced."
      });
    }
  }

  return diagnostics;
}
