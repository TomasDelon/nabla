import { type ReactNode } from "react";

export interface ToggleDisplay {
  readonly foldState: "open" | "closed";
}

export function getToggleDisplay(props: {
  readonly foldState: "open" | "closed";
}): ToggleDisplay {
  return {
    foldState: props.foldState,
  };
}

export interface ToggleProps {
  readonly foldState: "open" | "closed";
  readonly onToggleFold: () => void;
  readonly children?: ReactNode;
}

export function Toggle({ foldState, onToggleFold, children }: ToggleProps) {
  return (
    <div className="nabla-toggle" data-fold-state={foldState}>
      <button className="nabla-toggle__header" onClick={onToggleFold} type="button" aria-expanded={foldState === "open"}>
        <span className="nabla-toggle__indicator" aria-hidden="true">
          {foldState === "open" ? "▾" : "▸"}
        </span>
        <span className="nabla-toggle__label">Toggle content</span>
      </button>
      {foldState === "open" && <div className="nabla-toggle__body">{children}</div>}
    </div>
  );
}
