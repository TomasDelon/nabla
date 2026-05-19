import type { Diagnostic, MarkdownNode, NablaBlockNode, SourcePosition } from "@nabla/markup";
import { DIAGNOSTIC_CODES } from "@nabla/markup";
import type { BlockIndexEntry } from "./index.js";

export type BlockIndexResult = {
  entries: BlockIndexEntry[];
  diagnostics: Diagnostic[];
};

const BLOCK_TYPES = new Set([
  "paragraph",
  "heading",
  "foldableHeading",
  "callout",
  "toggle",
  "transclusion",
  "table",
  "listItem",
]);

type IndexableNode = Record<string, unknown>;

function getNablaBlockId(node: IndexableNode): string | undefined {
  if (!BLOCK_TYPES.has(node.type as string)) return undefined;
  const data = node.data as Record<string, unknown> | undefined;
  if (data == null) return undefined;
  const id = data.nablaBlockId;
  return typeof id === "string" && id.length > 0 ? id : undefined;
}

function getChildren(node: IndexableNode): Array<IndexableNode> | undefined {
  return node.children as Array<IndexableNode> | undefined;
}

function getPosition(node: IndexableNode): SourcePosition | undefined {
  return node.position as SourcePosition | undefined;
}

export function buildBlockIndex(
  children: Array<MarkdownNode | NablaBlockNode>,
  filePath: string
): BlockIndexResult {
  const entries: BlockIndexEntry[] = [];
  const diagnostics: Diagnostic[] = [];
  const seenIds = new Map<string, SourcePosition>();

  function walk(nodes: Array<IndexableNode>) {
    for (const node of nodes) {
      const blockId = getNablaBlockId(node);
      if (blockId) {
        const position = getPosition(node);
        entries.push({ filePath, blockId, position });

        const existingPos = seenIds.get(blockId);
        if (existingPos) {
          diagnostics.push({
            severity: "warning",
            code: DIAGNOSTIC_CODES.BLOCK_ID_DUPLICATE,
            message: "Duplicate block id in document.",
            position,
          });
        } else {
          seenIds.set(blockId, position!);
        }
      }

      const childNodes = getChildren(node);
      if (childNodes) {
        walk(childNodes);
      }
    }
  }

  walk(children as Array<IndexableNode>);

  return { entries, diagnostics };
}
