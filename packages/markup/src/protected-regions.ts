export type ProtectedRegionKind =
  | "inlineCode"
  | "fencedCodeBlock"
  | "indentedCodeBlock"
  | "rawHtmlBlock"
  | "inlineHtml";

export type ProtectedRegion = {
  kind: ProtectedRegionKind;
  start: number;
  end: number;
  text: string;
};

type LineInfo = {
  text: string;
  start: number;
  end: number;
};

function getLineInfos(source: string) {
  const lines: LineInfo[] = [];
  let start = 0;

  while (start < source.length) {
    const nextBreak = source.indexOf("\n", start);
    if (nextBreak === -1) {
      lines.push({ text: source.slice(start), start, end: source.length });
      start = source.length;
      break;
    }

    lines.push({ text: source.slice(start, nextBreak + 1), start, end: nextBreak + 1 });
    start = nextBreak + 1;
  }

  if (source.length === 0) {
    return lines;
  }

  if (source.endsWith("\n") === false && start === source.length) {
    return lines;
  }

  if (lines.length === 0) {
    lines.push({ text: source, start: 0, end: source.length });
  }

  return lines;
}

function addRegion(
  regions: ProtectedRegion[],
  kind: ProtectedRegionKind,
  start: number,
  end: number,
  source: string
) {
  if (end <= start) return;
  regions.push({ kind, start, end, text: source.slice(start, end) });
}

function sortRegions(regions: ProtectedRegion[]) {
  return regions.sort((left, right) => left.start - right.start || left.end - right.end);
}

function isBlankLine(text: string) {
  return text.trim() === "";
}

function stripTrailingLineBreak(text: string) {
  return text.endsWith("\n") ? text.slice(0, -1) : text;
}

function countLeadingSpaces(text: string) {
  let count = 0;
  while (count < text.length && text[count] === " ") {
    count += 1;
  }
  return count;
}

function findFencedCodeBlocks(source: string, lines: LineInfo[]) {
  const regions: ProtectedRegion[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = stripTrailingLineBreak(line.text).match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (!match) continue;

    const fence = match[2];
    const marker = fence[0];
    const minimumLength = fence.length;
    let end = line.end;

    for (let innerIndex = index + 1; innerIndex < lines.length; innerIndex += 1) {
      const innerLine = lines[innerIndex];
      const closingMatch = stripTrailingLineBreak(innerLine.text).match(/^( {0,3})(`{3,}|~{3,})[ \t]*$/);
      if (closingMatch && closingMatch[2][0] === marker && closingMatch[2].length >= minimumLength) {
        end = innerLine.end;
        index = innerIndex;
        break;
      }

      end = innerLine.end;
    }

    addRegion(regions, "fencedCodeBlock", line.start, end, source);
  }

  return regions;
}

function findIndentedCodeBlocks(source: string, lines: LineInfo[]) {
  const regions: ProtectedRegion[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const startsIndentedBlock = /^(?: {4}|\t)\S/.test(line.text);
    if (!startsIndentedBlock) continue;

    let end = line.end;
    let innerIndex = index + 1;

    while (innerIndex < lines.length) {
      const innerLine = lines[innerIndex];
      if (/^(?: {4}|\t)/.test(innerLine.text) || isBlankLine(innerLine.text)) {
        end = innerLine.end;
        innerIndex += 1;
        continue;
      }
      break;
    }

    addRegion(regions, "indentedCodeBlock", line.start, end, source);
    index = innerIndex - 1;
  }

  return regions;
}

function findRawHtmlBlocks(source: string, lines: LineInfo[]) {
  const regions: ProtectedRegion[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (countLeadingSpaces(line.text) > 3) continue;

    const trimmed = stripTrailingLineBreak(line.text).trimStart();
    const startsHtmlBlock =
      /^<!--/.test(trimmed) ||
      /^<([A-Za-z][A-Za-z0-9-]*)(?:\s[^>]*)?>/.test(trimmed) ||
      /^<\/[A-Za-z][A-Za-z0-9-]*>/.test(trimmed);
    if (!startsHtmlBlock) continue;

    let end = line.end;
    let innerIndex = index + 1;
    while (innerIndex < lines.length) {
      const innerLine = lines[innerIndex];
      if (isBlankLine(innerLine.text)) break;
      end = innerLine.end;
      innerIndex += 1;
    }

    addRegion(regions, "rawHtmlBlock", line.start, end, source);
    index = innerIndex - 1;
  }

  return regions;
}

function mergeRegions(regions: ProtectedRegion[]) {
  const sorted = sortRegions([...regions]);
  const merged: ProtectedRegion[] = [];

  for (const region of sorted) {
    const previous = merged.at(-1);
    if (!previous || region.start >= previous.end) {
      merged.push(region);
      continue;
    }

    if (region.end > previous.end) {
      const previousEnd = previous.end;
      previous.end = region.end;
      previous.text += region.text.slice(previousEnd - region.start);
    }
  }

  return merged;
}

function isCovered(regions: ProtectedRegion[], start: number, end: number) {
  return regions.some((region) => start < region.end && end > region.start);
}

function findInlineCodeAndHtml(source: string, occupiedRegions: ProtectedRegion[]) {
  const regions: ProtectedRegion[] = [];

  for (let index = 0; index < source.length; index += 1) {
    if (isCovered(occupiedRegions, index, index + 1)) continue;

    if (source[index] === "`") {
      let length = 1;
      while (source[index + length] === "`") {
        length += 1;
      }

      const marker = "`".repeat(length);
      const endIndex = source.indexOf(marker, index + length);
      if (endIndex !== -1) {
        const regionEnd = endIndex + length;
        if (!isCovered(occupiedRegions, index, regionEnd)) {
          addRegion(regions, "inlineCode", index, regionEnd, source);
          index = regionEnd - 1;
          continue;
        }
      }
    }

    if (source[index] === "<") {
      const remaining = source.slice(index);
      const inlineHtmlMatch = remaining.match(/^<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>\n]*)?>/);
      if (inlineHtmlMatch) {
        const regionEnd = index + inlineHtmlMatch[0].length;
        if (!isCovered(occupiedRegions, index, regionEnd)) {
          addRegion(regions, "inlineHtml", index, regionEnd, source);
          index = regionEnd - 1;
        }
      }
    }
  }

  return regions;
}

export function findProtectedRegions(source: string) {
  const lines = getLineInfos(source);
  const blockRegions = mergeRegions([
    ...findFencedCodeBlocks(source, lines),
    ...findIndentedCodeBlocks(source, lines),
    ...findRawHtmlBlocks(source, lines)
  ]);
  const inlineRegions = findInlineCodeAndHtml(source, blockRegions);
  return sortRegions([...blockRegions, ...inlineRegions]);
}

export function isOffsetProtected(regions: ProtectedRegion[], offset: number) {
  return regions.some((region) => offset >= region.start && offset < region.end);
}
