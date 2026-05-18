import type { MarkdownNode, NablaDocument, WikiLinkNode, TagNode, FoldableHeadingNode, HighlightNode, ColorHighlightNode, PrivateCommentNode, TaskState, FrontmatterNode } from "./ast.js";
import { serializeWikiLink } from "./extensions/wiki-links.js";
import { serializeTag } from "./extensions/tags.js";
import { serializeHighlight, serializeColorHighlight } from "./extensions/highlights.js";
import { taskStateToMarker } from "./extensions/task-states.js";
import { serializeFrontmatter } from "./extensions/frontmatter.js";

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

  if (node.type === "inlineCode") {
    return `\`${node.value}\``;
  }

  if (node.type === "wikiLink") {
    return serializeWikiLink(node as WikiLinkNode);
  }

  if (node.type === "tag") {
    return serializeTag(node as TagNode);
  }

  if (node.type === "highlight") {
    return serializeHighlight(node as HighlightNode);
  }

  if (node.type === "colorHighlight") {
    return serializeColorHighlight(node as ColorHighlightNode);
  }

  return "";
}

function serializeBlockNode(node: MarkdownNode) {
  if (node.type === "paragraph" && Array.isArray(node.children)) {
    return node.children.map((child) => serializeInlineNode(child as MarkdownNode)).join("");
  }

  if (node.type === "code") {
    const lang = typeof node.lang === "string" ? node.lang : "";
    const value = typeof node.value === "string" ? node.value : "";
    const info = lang ? lang : "";
    return `\n\`\`\`${info}\n${value}\n\`\`\``;
  }

  if (node.type === "heading" && typeof node.depth === "number") {
    const content = (Array.isArray(node.children) ? node.children : [])
      .map((child) => serializeInlineNode(child as MarkdownNode))
      .join("");
    return `${"#".repeat(node.depth)} ${content}`;
  }

  if (node.type === "foldableHeading") {
    const foldNode = node as unknown as FoldableHeadingNode;
    const marker = foldNode.rawMarker || "#v";
    const content = (Array.isArray(foldNode.title) ? foldNode.title : [])
      .map((child) => serializeInlineNode(child as MarkdownNode))
      .join("");
    return `${marker} ${content}`;
  }

  if (node.type === "privateComment") {
    return (node as unknown as PrivateCommentNode).raw;
  }

  if (node.type === "html") {
    return typeof node.value === "string" ? node.value : "";
  }

  if (node.type === "frontmatter") {
    const fmNode = node as unknown as FrontmatterNode;
    return serializeFrontmatter(fmNode.raw);
  }

  if (node.type === "list" && Array.isArray(node.children)) {
    return node.children
      .map((child) => serializeListItem(child as MarkdownNode))
      .join("\n");
  }

  return "";
}

function serializeListItem(node: MarkdownNode): string {
  const data = node.data as { nablaTaskState?: TaskState } | undefined;
  const taskState = data?.nablaTaskState;

  const paragraph = (Array.isArray(node.children) ? node.children : [])
    .find((child) => (child as MarkdownNode).type === "paragraph") as MarkdownNode | undefined;
  const text = paragraph
    ? (Array.isArray(paragraph.children) ? paragraph.children : [])
        .map((child) => serializeInlineNode(child as MarkdownNode))
        .join("")
    : "";

  if (taskState) {
    const marker = taskStateToMarker(taskState);
    return `- [${marker}] ${text}`;
  }

  return `- ${text}`;
}

export function serialize(source: NablaDocument, options: SerializeOptions = {}) {
  const output = source.children.map((child) => serializeBlockNode(child as MarkdownNode)).join("\n");
  const normalizedOutput = output === "" ? "" : `${output}\n`;
  return normalizeLineEnding(normalizedOutput, options.lineEnding);
}
