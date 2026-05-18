import type { Diagnostic, WikiLinkNode } from "../ast.js";
import { DIAGNOSTIC_CODES } from "../diagnostics.js";

export type ParsedWikiLink = {
  node: WikiLinkNode;
};

export type InvalidWikiLink = {
  text: string;
  diagnostic: Diagnostic;
};

export type WikiLinkParseResult = ParsedWikiLink | InvalidWikiLink;

function findFirstUnescaped(value: string, target: string) {
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

function findLastUnescaped(value: string, target: string) {
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

function unescapeWikiText(value: string) {
  return value.replace(/\\([|#^\]])/g, "$1");
}

function escapeWikiText(value: string) {
  return value.replace(/[|#^\]]/g, "\\$&");
}

function invalidCombinedDiagnostic(): Diagnostic {
  return {
    severity: "warning",
    code: DIAGNOSTIC_CODES.WIKI_LINK_INVALID_TARGET,
    message: "Wiki link target combines heading and block syntax invalidly."
  };
}

export function parseWikiLink(raw: string): WikiLinkParseResult {
  const content = raw.slice(2, -2);
  const aliasIndex = findFirstUnescaped(content, "|");
  const targetSide = aliasIndex === -1 ? content : content.slice(0, aliasIndex);
  const aliasSide = aliasIndex === -1 ? undefined : content.slice(aliasIndex + 1);

  let syntax: WikiLinkNode["syntax"] = "canonical";
  let targetText = targetSide;
  let blockId: string | undefined;
  let heading: string | undefined;

  if (targetText.length === 0) {
    return {
      node: {
        type: "wikiLink",
        target: "",
        syntax,
        raw
      }
    };
  }

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
      return {
        text: raw,
        diagnostic: invalidCombinedDiagnostic()
      };
    }
  } else {
    const headingIndex = findFirstUnescaped(targetText, "#");
    if (headingIndex !== -1) {
      heading = targetText.slice(headingIndex + 1);
      targetText = targetText.slice(0, headingIndex);
    }
  }

  const node: WikiLinkNode = {
    type: "wikiLink",
    target: unescapeWikiText(targetText),
    ...(heading !== undefined ? { heading: unescapeWikiText(heading) } : {}),
    ...(blockId !== undefined ? { blockId: unescapeWikiText(blockId) } : {}),
    ...(aliasSide !== undefined ? { alias: unescapeWikiText(aliasSide) } : {}),
    syntax,
    raw
  };

  return { node };
}

export function serializeWikiLink(node: WikiLinkNode) {
  let target = escapeWikiText(node.target);

  if (node.blockId !== undefined) {
    target += `^${escapeWikiText(node.blockId)}`;
  } else if (node.heading !== undefined) {
    target += `#${escapeWikiText(node.heading)}`;
  }

  if (node.alias !== undefined) {
    target += `|${escapeWikiText(node.alias)}`;
  }

  return `[[${target}]]`;
}
