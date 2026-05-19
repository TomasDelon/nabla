import type { FoldState } from "../ast.js";

const TOGGLE_RE = /^](\>|v)[ \t]*(.*)$/;

export type ToggleMarkerResult = {
  foldState: FoldState;
  title: string;
  rawMarker: "]>" | "]v";
};

export function parseToggleMarker(line: string): ToggleMarkerResult | null {
  const match = line.match(TOGGLE_RE);
  if (!match) return null;

  const foldMarker = match[1];

  return {
    foldState: foldMarker === ">" ? "closed" : "open",
    title: match[2],
    rawMarker: `]${foldMarker}` as "]>" | "]v"
  };
}
