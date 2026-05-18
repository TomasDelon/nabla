import type { MarkdownNode, NablaDocument, WikiLinkNode } from "./ast.js";
import { serializeWikiLink } from "./extensions/wiki-links.js";

export type SerializeOptions = {
  lineEnding?: "lf" | "crlf";
};

function normalizeLineEnding(value: string, lineEnding: SerializeOptions["lineEnding"]) {
  if (lineEnding === "crlf") {
    return value.replace(/\n/g, "\r\n");
  }
  return value;
}

function serializeInlineNode(node: MarkdownNode) {
  if (node.type === "text") {
    return typeof node.value === "string" ? node.value : "";
  }

  if (node.type === "wikiLink") {
    return serializeWikiLink(node as WikiLinkNode);
  }

  return "";
}

function serializeBlockNode(node: MarkdownNode) {
  if (node.type === "paragraph" && Array.isArray(node.children)) {
    return node.children.map((child) => serializeInlineNode(child as MarkdownNode)).join("");
  }

  return "";
}

export function serialize(source: NablaDocument, options: SerializeOptions = {}) {
  const output = source.children.map((child) => serializeBlockNode(child as MarkdownNode)).join("\n\n");
  const normalizedOutput = output === "" ? "" : `${output}\n`;
  return normalizeLineEnding(normalizedOutput, options.lineEnding);
}
