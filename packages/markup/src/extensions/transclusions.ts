import type { TransclusionNode, SyntaxStatus } from "../ast.js";

export type TransclusionContent = {
  target: string;
  heading?: string;
  blockId?: string;
  syntax: SyntaxStatus;
};

export function parseTransclusionContent(content: string): TransclusionContent {
  let syntax: SyntaxStatus = "canonical";
  let targetText = content;
  let blockId: string | undefined;
  let heading: string | undefined;

  const compatibleBlockIndex = targetText.lastIndexOf("#^");
  if (compatibleBlockIndex !== -1 && compatibleBlockIndex + 2 < targetText.length) {
    syntax = "compatible";
    blockId = targetText.slice(compatibleBlockIndex + 2);
    targetText = targetText.slice(0, compatibleBlockIndex);
  } else {
    const blockIndex = targetText.lastIndexOf("^");
    if (blockIndex !== -1 && blockIndex + 1 < targetText.length) {
      blockId = targetText.slice(blockIndex + 1);
      targetText = targetText.slice(0, blockIndex);
    }
  }

  if (blockId === undefined) {
    const headingIndex = targetText.indexOf("#");
    if (headingIndex !== -1) {
      heading = targetText.slice(headingIndex + 1);
      targetText = targetText.slice(0, headingIndex);
    }
  }

  return { target: targetText, heading, blockId, syntax };
}

export function parseTransclusionLine(line: string): TransclusionNode {
  const content = line.slice(3, -2);
  const parsed = parseTransclusionContent(content);
  return {
    type: "transclusion",
    target: parsed.target,
    ...(parsed.heading ? { heading: parsed.heading } : {}),
    ...(parsed.blockId ? { blockId: parsed.blockId } : {}),
    syntax: parsed.syntax,
    raw: line
  };
}

export function serializeTransclusion(node: TransclusionNode): string {
  let inner = node.target;
  if (node.blockId !== undefined) {
    inner += `^${node.blockId}`;
  } else if (node.heading !== undefined) {
    inner += `#${node.heading}`;
  }
  return `![[${inner}]]`;
}
