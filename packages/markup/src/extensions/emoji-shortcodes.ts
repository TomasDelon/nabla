import type { EmojiShortcodeNode } from "../ast.js";
import { DIAGNOSTIC_CODES } from "../diagnostics.js";

export const DEFAULT_EMOJI_REGISTRY: ReadonlyMap<string, string> = new Map([
  ["check", "\u2705"],
  ["warning", "\u26A0\uFE0F"],
  ["idea", "\uD83D\uDCA1"],
  ["fire", "\uD83D\uDD25"],
  ["star", "\u2B50"],
  ["x", "\u274C"],
]);

const EMOJI_PATTERN = /:([a-z0-9_+\-]+):/;

export type EmojiParseResult =
  | { kind: "known"; node: EmojiShortcodeNode }
  | { kind: "unknown"; raw: string; name: string }
  | null;

export function tryParseEmojiShortcode(
  source: string,
  index: number,
  registry?: ReadonlyMap<string, string>
): EmojiParseResult {
  if (source[index] !== ":") return null;

  const rest = source.slice(index);
  const match = rest.match(EMOJI_PATTERN);
  if (!match || match.index !== 0) return null;

  const name = match[1];
  const raw = match[0];
  const reg = registry ?? DEFAULT_EMOJI_REGISTRY;

  if (!reg.has(name)) {
    return { kind: "unknown", raw, name };
  }

  return {
    kind: "known",
    node: {
      type: "emojiShortcode",
      name,
      raw
    }
  };
}

export function buildEmojiUnknownDiagnostic(name: string) {
  return {
    severity: "info" as const,
    code: DIAGNOSTIC_CODES.EMOJI_UNKNOWN,
    message: `Unknown emoji shortcode: ${name}.`
  };
}

export function serializeEmojiShortcode(node: EmojiShortcodeNode) {
  return node.raw;
}
