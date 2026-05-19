import type { FoldState } from "../ast.js";

const FOLDED_HEADING_RE = /^(#{1,6})(>|v) (.+)$/;

export type FoldedHeadingMarkerResult = {
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  foldState: FoldState;
  title: string;
  rawMarker: string;
};

export function parseFoldedHeadingMarker(line: string): FoldedHeadingMarkerResult | null {
  const match = line.match(FOLDED_HEADING_RE);
  if (!match) return null;

  const hashes = match[1];
  const foldMarker = match[2];
  const depth = hashes.length as 1 | 2 | 3 | 4 | 5 | 6;

  return {
    depth,
    foldState: foldMarker === ">" ? "closed" : "open",
    title: match[3],
    rawMarker: `${hashes}${foldMarker}`
  };
}
