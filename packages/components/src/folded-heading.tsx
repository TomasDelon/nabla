import { type ReactNode } from "react";

export interface FoldedHeadingDisplay {
  readonly level: number;
  readonly foldState: "open" | "closed";
  readonly text: string;
}

export function getFoldedHeadingDisplay(props: {
  readonly level: number;
  readonly foldState: "open" | "closed";
  readonly text: string;
}): FoldedHeadingDisplay {
  return {
    level: props.level,
    foldState: props.foldState,
    text: props.text,
  };
}

export interface FoldedHeadingProps {
  readonly level: number;
  readonly text: string;
  readonly foldState: "open" | "closed";
  readonly onToggleFold: () => void;
  readonly children?: ReactNode;
}

const HEADING_FONT_SIZE: Record<number, string> = {
  1: "1.5rem",
  2: "1.25rem",
  3: "1.125rem",
  4: "1rem",
  5: "0.875rem",
  6: "0.875rem",
};

export function FoldedHeading({ level, text, foldState, onToggleFold, children }: FoldedHeadingProps) {
  const display = getFoldedHeadingDisplay({ level, foldState, text });
  const fontSize = HEADING_FONT_SIZE[level] ?? "1rem";

  return (
    <div className="nabla-folded-heading" data-fold-state={foldState} data-level={level}>
      <button
        className="nabla-folded-heading__header"
        onClick={onToggleFold}
        type="button"
        aria-expanded={foldState === "open"}
        style={{ fontSize }}
      >
        <span className="nabla-folded-heading__indicator" aria-hidden="true">
          {foldState === "open" ? "▾" : "▸"}
        </span>
        <span className="nabla-folded-heading__title">{display.text}</span>
      </button>
      {foldState === "open" && <div className="nabla-folded-heading__body">{children}</div>}
    </div>
  );
}
