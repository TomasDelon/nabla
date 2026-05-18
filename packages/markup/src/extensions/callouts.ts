import type { CalloutNode, FoldState, SyntaxStatus, MarkdownNode, NablaBlockNode, ToggleNode } from "../ast.js";

const CALLOUT_CANONICAL_RE = /^\[!([A-Za-z][A-Za-z0-9_-]*)](\>|v)?[ \t]*(.*)$/;
const CALLOUT_COMPATIBLE_RE = /^> \[!([A-Za-z][A-Za-z0-9_-]*)]\s*(.*)$/;
const TOGGLE_RE = /^\](\>|v)[ \t]*(.*)$/;

export type CalloutMarkerResult = {
  calloutType: string;
  foldState?: FoldState;
  title: string;
  syntax: SyntaxStatus;
  rawMarker: string;
};

export function parseCalloutMarker(line: string): CalloutMarkerResult | null {
  const canonical = line.match(CALLOUT_CANONICAL_RE);
  if (canonical) {
    const calloutType = canonical[1];
    const foldMarker = canonical[2];
    const title = canonical[3];
    let rawMarker = `[!${calloutType}]`;
    let foldState: FoldState | undefined;

    if (foldMarker === ">") {
      foldState = "closed";
      rawMarker = `[!${calloutType}]>`;
    } else if (foldMarker === "v") {
      foldState = "open";
      rawMarker = `[!${calloutType}]v`;
    }

    return { calloutType, foldState, title, syntax: "canonical", rawMarker };
  }

  const compatible = line.match(CALLOUT_COMPATIBLE_RE);
  if (compatible) {
    return {
      calloutType: compatible[1],
      foldState: undefined,
      title: compatible[2],
      syntax: "compatible",
      rawMarker: `> [!${compatible[1]}]`
    };
  }

  return null;
}

export type ToggleMarkerResult = {
  foldState: FoldState;
  title: string;
  rawMarker: "]>" | "]v";
};

export function parseToggleMarker(line: string): ToggleMarkerResult | null {
  const match = line.match(TOGGLE_RE);
  if (!match) return null;

  const foldMarker = match[1];

  return {
    foldState: foldMarker === ">" ? "closed" : "open",
    title: match[2],
    rawMarker: `]${foldMarker}` as "]>" | "]v"
  };
}

export function isTabIndented(line: string): boolean {
  return line.length > 0 && line[0] === "\t";
}

export function collectTabIndentedChildren(lines: string[], startIndex: number): { childLines: string[]; endIndex: number } {
  const childLines: string[] = [];
  let i = startIndex;
  let hadContent = false;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      if (!hadContent) break;

      if (i + 1 < lines.length && isTabIndented(lines[i + 1])) {
        childLines.push("");
        i += 1;
        continue;
      }

      break;
    }

    if (isTabIndented(line)) {
      childLines.push(line.slice(1));
      hadContent = true;
      i += 1;
    } else {
      if (!hadContent) break;
      break;
    }
  }

  while (childLines.length > 0 && childLines[childLines.length - 1] === "") {
    childLines.pop();
  }

  return { childLines, endIndex: i - 1 };
}

export function collectCompatibleChildren(lines: string[], startIndex: number): { childLines: string[]; endIndex: number } {
  const childLines: string[] = [];
  let i = startIndex;
  let hadContent = false;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      if (!hadContent) break;

      if (i + 1 < lines.length && lines[i + 1].startsWith("> ")) {
        childLines.push("");
        i += 1;
        continue;
      }

      break;
    }

    if (line.startsWith("> ")) {
      childLines.push(line.slice(2));
      hadContent = true;
      i += 1;
    } else {
      if (!hadContent) break;
      break;
    }
  }

  while (childLines.length > 0 && childLines[childLines.length - 1] === "") {
    childLines.pop();
  }

  return { childLines, endIndex: i - 1 };
}

export function collectToggleChildLines(lines: string[], startIndex: number): { childLines: string[]; endIndex: number } {
  return collectTabIndentedChildren(lines, startIndex);
}

export function serializeCallout(node: CalloutNode): string {
  const title = node.title.map((child) => (child as { value?: string }).value ?? "").join("");

  const marker = node.syntax === "compatible"
    ? `[!${node.calloutType}]`
    : node.rawMarker;

  const header = `${marker} ${title}`;

  if (node.children.length === 0) {
    return `\n${header}`;
  }

  const childOutputs: string[] = [];
  for (const child of node.children) {
    childOutputs.push(serializeChildBlock(child as MarkdownNode | NablaBlockNode));
  }

  return `\n${header}\n${childOutputs.join("\n\n")}`;
}

export function serializeToggle(node: ToggleNode): string {
  const title = node.title.map((child) => (child as { value?: string }).value ?? "").join("");
  const header = `${node.rawMarker} ${title}`;

  if (node.children.length === 0) {
    return `\n${header}`;
  }

  const childOutputs: string[] = [];
  for (const child of node.children) {
    childOutputs.push(serializeChildBlock(child as MarkdownNode | NablaBlockNode));
  }

  return `\n${header}\n${childOutputs.join("\n\n")}`;
}

function serializeChildBlock(node: MarkdownNode | NablaBlockNode): string {
  if (node.type === "paragraph" && Array.isArray(node.children)) {
    const text = node.children.map((child) => (child as { value?: string }).value ?? "").join("");
    return `\t${text}`;
  }

  if (node.type === "code") {
    const lang = typeof node.lang === "string" ? node.lang : "";
    const value = typeof node.value === "string" ? node.value : "";
    const codeLines = value.split("\n");
    const indentedCode = codeLines.map((l) => `\t${l}`).join("\n");
    return `\t\`\`\`${lang}\n${indentedCode}\n\t\`\`\``;
  }

  if (node.type === "callout") {
    const inner = serializeCallout(node as CalloutNode);
    return inner
      .replace(/^\n/, "")
      .split("\n")
      .map((l) => `\t${l}`)
      .join("\n");
  }

  if (node.type === "toggle") {
    const inner = serializeToggle(node as ToggleNode);
    return inner
      .replace(/^\n/, "")
      .split("\n")
      .map((l) => `\t${l}`)
      .join("\n");
  }

  return "";
}