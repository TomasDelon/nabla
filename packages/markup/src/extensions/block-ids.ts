import type { Diagnostic } from "../ast.js";
import { DIAGNOSTIC_CODES } from "../diagnostics.js";

const BLOCK_ID_GRAMMAR = /^[A-Za-z][A-Za-z0-9_-]*$/;

const SAME_LINE_EOL = /[ \t]+\^([A-Za-z][A-Za-z0-9_-]*)\s*$/;
const SAME_LINE_INVALID = /[ \t]+\^(\S+)\s*$/;
const OWN_LINE_EOL = /\n\^([A-Za-z][A-Za-z0-9_-]*)\s*$/;
const OWN_LINE_INVALID = /\n\^(\S+)\s*$/;
const MID_BLOCK_ID = /\^([A-Za-z][A-Za-z0-9_-]*)/;

export const OWN_LINE_ONLY = /^\^([A-Za-z][A-Za-z0-9_-]*)\s*$/;

function stripInlineBrackets(text: string): string {
  return text
    .replace(/\[\[[^\]]*\]\]/g, (m) => "\0".repeat(m.length))
    .replace(/\[\^[^\]\s]+\]/g, (m) => "\0".repeat(m.length));
}

export type BlockIdResult = {
  strippedText: string;
  blockId?: string;
  diagnostic?: Diagnostic;
  isOwnLine?: boolean;
};

export function extractBlockId(text: string): BlockIdResult {
  const clean = stripInlineBrackets(text);

  const ownLineOnlyMatch = clean.match(OWN_LINE_ONLY);
  if (ownLineOnlyMatch) {
    return { strippedText: "", blockId: ownLineOnlyMatch[1], isOwnLine: true };
  }

  const ownLineEolMatch = clean.match(OWN_LINE_EOL);
  if (ownLineEolMatch) {
    return { strippedText: text.slice(0, ownLineEolMatch.index), blockId: ownLineEolMatch[1], isOwnLine: true };
  }

  const sameLineEolMatch = clean.match(SAME_LINE_EOL);
  if (sameLineEolMatch) {
    return { strippedText: text.slice(0, sameLineEolMatch.index), blockId: sameLineEolMatch[1] };
  }

  const ownLineInvalidMatch = clean.match(OWN_LINE_INVALID);
  if (ownLineInvalidMatch) {
    const candidate = ownLineInvalidMatch[1];
    if (!BLOCK_ID_GRAMMAR.test(candidate)) {
      return {
        strippedText: text,
        diagnostic: {
          severity: "warning" as const,
          code: DIAGNOSTIC_CODES.BLOCK_ID_INVALID,
          message: "Block id does not match the required grammar."
        }
      };
    }
  }

  const sameLineInvalidMatch = clean.match(SAME_LINE_INVALID);
  if (sameLineInvalidMatch) {
    const candidate = sameLineInvalidMatch[1];
    if (!BLOCK_ID_GRAMMAR.test(candidate)) {
      return {
        strippedText: text,
        diagnostic: {
          severity: "warning" as const,
          code: DIAGNOSTIC_CODES.BLOCK_ID_INVALID,
          message: "Block id does not match the required grammar."
        }
      };
    }
  }

  const midMatch = clean.match(MID_BLOCK_ID);
  if (midMatch) {
    const after = clean.slice(midMatch.index! + midMatch[0].length);
    if (after.trim() !== "") {
      return {
        strippedText: text,
        diagnostic: {
          severity: "warning" as const,
          code: DIAGNOSTIC_CODES.BLOCK_ID_INVALID_POSITION,
          message: "Block id appears in an invalid position."
        }
      };
    }
  }

  return { strippedText: text };
}

const ATTACHABLE_KINDS = new Set([
  "paragraph", "heading", "foldableHeading", "listItem",
  "callout", "toggle", "transclusion", "table"
]);

export function getBlockText(block: { kind: string; text?: string; content?: string; title?: string }): string | null {
  if (block.kind === "paragraph" || block.kind === "listItem" || block.kind === "transclusion") {
    return block.text ?? null;
  }
  if (block.kind === "heading") {
    return block.content ?? null;
  }
  if (block.kind === "foldableHeading" || block.kind === "callout" || block.kind === "toggle") {
    return block.title ?? null;
  }
  return null;
}

export function setBlockText(block: { kind: string; text?: string; content?: string; title?: string }, value: string): void {
  if (block.kind === "paragraph" || block.kind === "listItem" || block.kind === "transclusion") {
    block.text = value;
  } else if (block.kind === "heading") {
    block.content = value;
  } else if (block.kind === "foldableHeading" || block.kind === "callout" || block.kind === "toggle") {
    block.title = value;
  }
}

export function isNonAttachable(block: { kind: string }): boolean {
  return (
    block.kind === "code" ||
    block.kind === "html" ||
    block.kind === "frontmatter" ||
    block.kind === "thematicBreak" ||
    block.kind === "privateComment" ||
    block.kind === "footnoteDefinition"
  );
}

export function processBlockIds(
  blocks: Array<Record<string, unknown>>
): { diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as Record<string, unknown>;
    const kind = block.kind as string;

    if (isNonAttachable(block as { kind: string })) continue;

    const text = getBlockText(block as { kind: string; text?: string; content?: string; title?: string });
    if (text === null) continue;

    if (kind === "paragraph") {
      const cleanText = stripInlineBrackets(text);
      const ownLineId = cleanText.match(OWN_LINE_ONLY)?.[1];
      if (ownLineId) {
        let prevAttachable = -1;
        for (let j = i - 1; j >= 0; j--) {
          const prev = blocks[j] as Record<string, unknown>;
          if (!isNonAttachable(prev as { kind: string }) && ATTACHABLE_KINDS.has(prev.kind as string)) {
            prevAttachable = j;
            break;
          }
        }
        if (prevAttachable !== -1) {
          (blocks[prevAttachable] as Record<string, unknown>).nablaBlockId = ownLineId;
          Object.defineProperty(blocks[prevAttachable], "nablaBlockIdOwnLine", {
            value: true,
            enumerable: false,
            writable: false,
            configurable: false
          });
          blocks.splice(i, 1);
          i--;
          continue;
        }
        continue;
      }
    }

    const result = extractBlockId(text);
    if (result.blockId && ATTACHABLE_KINDS.has(kind)) {
      block.nablaBlockId = result.blockId;
      if (result.isOwnLine) {
        (block as Record<string, unknown>).nablaBlockIdOwnLine = true;
      }
      setBlockText(block as { kind: string; text?: string; content?: string; title?: string }, result.strippedText);
    }
    if (result.diagnostic) {
      diagnostics.push(result.diagnostic);
    }
  }

  const seen = new Map<string, number>();
  for (const block of blocks) {
    const b = block as Record<string, unknown>;
    const id = b.nablaBlockId as string | undefined;
    if (id) {
      if (seen.has(id)) {
        diagnostics.push({
          severity: "warning" as const,
          code: DIAGNOSTIC_CODES.BLOCK_ID_DUPLICATE,
          message: `Duplicate block id in do\u0063ument.`
        });
      }
      seen.set(id, (seen.get(id) ?? 0) + 1);
    }
  }

  return { diagnostics };
}
