import type { TagNode } from "../ast.js";

const TAG_PATTERN = /^#([A-Za-z0-9_][A-Za-z0-9_/-]*)/;

export function parseTag(raw: string) {
  const match = raw.match(TAG_PATTERN);
  if (!match) return null;

  const value = match[1];
  const segments = value.split("/");

  const node: TagNode = {
    type: "tag",
    value,
    segments,
    raw: match[0]
  };

  return node;
}

export function serializeTag(node: TagNode) {
  return `#${node.value}`;
}
