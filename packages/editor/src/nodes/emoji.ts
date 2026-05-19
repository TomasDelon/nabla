import { DEFAULT_EMOJI_REGISTRY, findProtectedRegions, isOffsetProtected } from "@nabla/markup";

export const NABLA_EMOJI_NODE_VIEW = "node-safe-adapter";

export interface EditorEmojiShortcode {
  readonly index: number;
  readonly name: string;
  readonly raw: string;
  readonly value: string;
}

const EMOJI_PATTERN = /:([a-z0-9_+\-]+):/g;

export function getEmojiShortcodesFromMarkdown(markdown: string): readonly EditorEmojiShortcode[] {
  const protectedRegions = findProtectedRegions(markdown);
  const emojis: EditorEmojiShortcode[] = [];

  for (const match of markdown.matchAll(EMOJI_PATTERN)) {
    const raw = match[0];
    const name = match[1];
    const offset = match.index ?? -1;

    if (offset < 0) {
      continue;
    }

    if (isOffsetProtected(protectedRegions, offset)) {
      continue;
    }

    const value = DEFAULT_EMOJI_REGISTRY.get(name);
    if (value === undefined) {
      continue;
    }

    emojis.push({
      index: emojis.length,
      name,
      raw,
      value,
    });
  }

  return emojis;
}

export function getEmojiNodeViews() {
  return Object.freeze({
    emoji: NABLA_EMOJI_NODE_VIEW,
  });
}
