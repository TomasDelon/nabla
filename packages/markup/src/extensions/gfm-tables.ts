import type { MarkdownNode } from "../ast.js";

const TABLE_SEPARATOR_PATTERN = /^[ \t]*:?-{3,}:?(?:[ \t]*\|[ \t]*:?-{3,}:?)*[ \t]*$/;

export function isTableSeparatorLine(line: string): boolean {
  return TABLE_SEPARATOR_PATTERN.test(line.trim());
}

export function detectTableStart(lines: string[], index: number): boolean {
  if (index + 1 >= lines.length) return false;
  if (!lines[index].includes("|")) return false;
  return isTableSeparatorLine(lines[index + 1]);
}

export function parseTableAlignment(separator: string): Array<"left" | "center" | "right" | null> {
  let trimmed = separator.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1).trimStart();
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1).trimEnd();

  const cells = trimmed.split("|").map((s) => s.trim());

  return cells.map((cell) => {
    const startsWithColon = cell.startsWith(":");
    const endsWithColon = cell.endsWith(":");
    if (startsWithColon && endsWithColon) return "center";
    if (endsWithColon) return "right";
    if (startsWithColon) return "left";
    return null;
  });
}

export function splitTableRow(row: string): string[] {
  let trimmed = row.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1).trimStart();
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1).trimEnd();

  return trimmed.split("|").map((cell) => cell.trim());
}

export type TableBlockSpec = {
  kind: "table";
  headerRow: string;
  separator: string;
  bodyRows: string[];
  endIndex: number;
};

export function parseTable(lines: string[], startIndex: number): TableBlockSpec | null {
  if (!detectTableStart(lines, startIndex)) return null;

  const headerRow = lines[startIndex];
  const separator = lines[startIndex + 1];

  const bodyRows: string[] = [];
  let i = startIndex + 2;
  while (i < lines.length && lines[i].includes("|")) {
    bodyRows.push(lines[i]);
    i++;
  }

  return {
    kind: "table",
    headerRow,
    separator,
    bodyRows,
    endIndex: i - 1
  };
}

export function buildTableNode(
  headerRow: string,
  separator: string,
  bodyRows: string[],
  nablaBlockId?: string,
  nablaBlockIdOwnLine?: boolean
): MarkdownNode {
  const align = parseTableAlignment(separator);
  const headerCells = splitTableRow(headerRow);
  const numCols = headerCells.length;

  const headerRowNode: MarkdownNode = {
    type: "tableRow",
    children: headerCells.map((cell) => ({
      type: "tableCell",
      children: [{ type: "text", value: cell }]
    }))
  };

  const bodyRowNodes = bodyRows.map((row) => {
    const cells = splitTableRow(row);
    while (cells.length < numCols) cells.push("");
    return {
      type: "tableRow" as const,
      children: cells.slice(0, numCols).map((cell) => ({
        type: "tableCell" as const,
        children: [{ type: "text" as const, value: cell }]
      }))
    };
  });

  const nodeChildren = [headerRowNode, ...bodyRowNodes];

  if (nablaBlockId) {
    const blockData: Record<string, unknown> = { nablaBlockId };
    if (nablaBlockIdOwnLine) {
      Object.defineProperty(blockData, "nablaBlockIdOwnLine", {
        value: true,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
    return {
      type: "table",
      align,
      data: blockData as MarkdownNode["data"],
      children: nodeChildren
    } as MarkdownNode;
  }

  return {
    type: "table",
    align,
    children: nodeChildren
  } as MarkdownNode;
}

export function serializeTable(node: MarkdownNode): string {
  const children = node.children as MarkdownNode[] | undefined;
  if (!children || children.length === 0) return "";

  const align = node.align as Array<string | null> | undefined;
  const numCols = align ? align.length : 0;

  const rows: string[] = [];

  for (const row of children) {
    if (row.type !== "tableRow") continue;
    const cells = (row.children as MarkdownNode[] | undefined) ?? [];
    const cellValues = cells.map((cell) => {
      if (cell.type !== "tableCell") return "";
      const cellChildren = (cell.children as MarkdownNode[]) ?? [];
      return cellChildren.map((child) => {
        if (child.type === "text") return child.value ?? "";
        return "";
      }).join("");
    });

    while (cellValues.length < numCols) cellValues.push("");
    rows.push(cellValues.slice(0, numCols).join(" | "));
  }

  if (rows.length === 0) return "";

  const separatorCells: string[] = [];
  const effectiveAlign = align ?? [];
  while (separatorCells.length < numCols) {
    const a = effectiveAlign[separatorCells.length] ?? null;
    if (a === "left") separatorCells.push(":---");
    else if (a === "center") separatorCells.push(":---:");
    else if (a === "right") separatorCells.push("---:");
    else separatorCells.push("---");
  }

  rows.splice(1, 0, separatorCells.join(" | "));

  return rows.join("\n");
}
