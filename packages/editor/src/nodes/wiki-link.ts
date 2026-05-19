export const NABLA_WIKI_LINK_NODE_VIEW = "node-safe-adapter";

export interface EditorWikiLink {
  readonly index: number;
  readonly target: string;
  readonly alias?: string;
  readonly heading?: string;
  readonly blockId?: string;
  readonly syntax: "canonical" | "compatible";
  readonly raw: string;
  readonly unresolved: false;
}

type ParsedWikiLink = Omit<EditorWikiLink, "index" | "unresolved">;

function findFirstUnescaped(value: string, target: string): number {
  let escaped = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (escaped) {
      escaped = false;
      continue;
    }

    if (character === "\\") {
      escaped = true;
      continue;
    }

    if (character === target) {
      return index;
    }
  }

  return -1;
}

function findLastUnescaped(value: string, target: string): number {
  let escaped = false;
  let lastIndex = -1;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (escaped) {
      escaped = false;
      continue;
    }

    if (character === "\\") {
      escaped = true;
      continue;
    }

    if (character === target) {
      lastIndex = index;
    }
  }

  return lastIndex;
}

function unescapeWikiText(value: string): string {
  return value.replace(/\\([|#^\]])/g, "$1");
}

function parseWikiLink(raw: string): ParsedWikiLink | null {
  const content = raw.slice(2, -2);
  const aliasIndex = findFirstUnescaped(content, "|");
  const targetSide = aliasIndex === -1 ? content : content.slice(0, aliasIndex);
  const aliasSide = aliasIndex === -1 ? undefined : content.slice(aliasIndex + 1);

  let syntax: EditorWikiLink["syntax"] = "canonical";
  let targetText = targetSide;
  let blockId: string | undefined;
  let heading: string | undefined;

  const compatibleBlockIndex = targetText.endsWith("#^") ? -1 : targetText.lastIndexOf("#^");
  if (compatibleBlockIndex !== -1 && compatibleBlockIndex + 2 < targetText.length) {
    syntax = "compatible";
    blockId = targetText.slice(compatibleBlockIndex + 2);
    targetText = targetText.slice(0, compatibleBlockIndex);
  } else {
    const blockIndex = findLastUnescaped(targetText, "^");
    if (blockIndex !== -1 && blockIndex + 1 < targetText.length) {
      blockId = targetText.slice(blockIndex + 1);
      targetText = targetText.slice(0, blockIndex);
    }
  }

  if (blockId !== undefined) {
    const headingMarkerIndex = findFirstUnescaped(targetText, "#");
    if (headingMarkerIndex !== -1) {
      return null;
    }
  } else {
    const headingIndex = findFirstUnescaped(targetText, "#");
    if (headingIndex !== -1) {
      heading = targetText.slice(headingIndex + 1);
      targetText = targetText.slice(0, headingIndex);
    }
  }

  return {
    target: unescapeWikiText(targetText),
    ...(aliasSide !== undefined ? { alias: unescapeWikiText(aliasSide) } : {}),
    ...(heading !== undefined ? { heading: unescapeWikiText(heading) } : {}),
    ...(blockId !== undefined ? { blockId: unescapeWikiText(blockId) } : {}),
    syntax,
    raw,
  };
}

export function getWikiLinksFromMarkdown(markdown: string): readonly EditorWikiLink[] {
  const links: EditorWikiLink[] = [];

  for (const match of markdown.matchAll(/\[\[[\s\S]*?\]\]/g)) {
    const raw = match[0];
    const parsed = parseWikiLink(raw);
    if (!parsed) {
      continue;
    }

    links.push({
      index: links.length,
      ...parsed,
      unresolved: false,
    });
  }

  return links;
}

export function setWikiLinkAliasInMarkdown(
  markdown: string,
  index: number,
  alias?: string,
): string {
  let linkIndex = 0;

  return markdown.replace(/\[\[[\s\S]*?\]\]/g, (raw) => {
    const parsed = parseWikiLink(raw);
    if (!parsed) {
      return raw;
    }

    if (linkIndex !== index) {
      linkIndex += 1;
      return raw;
    }

    linkIndex += 1;

    let target = parsed.target;
    if (parsed.blockId !== undefined) {
      target += parsed.syntax === "compatible" ? `#^${parsed.blockId}` : `^${parsed.blockId}`;
    } else if (parsed.heading !== undefined) {
      target += `#${parsed.heading}`;
    }

    if (alias !== undefined) {
      return `[[${target}|${alias}]]`;
    }

    return `[[${target}]]`;
  });
}

export function getWikiLinkNodeViews() {
  return Object.freeze({
    wikiLink: NABLA_WIKI_LINK_NODE_VIEW,
  });
}
