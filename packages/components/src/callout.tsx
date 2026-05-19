import { type ReactNode } from "react";

export interface CalloutDisplay {
  readonly calloutType: string;
  readonly foldState: "open" | "closed";
  readonly typeLabel: string;
}

const CALLOUT_TYPE_LABELS: Record<string, string> = {
  note: "Note",
  warning: "Warning",
  tip: "Tip",
  danger: "Danger",
  info: "Info",
  abstract: "Abstract",
  question: "Question",
};

export function getCalloutDisplay(props: {
  readonly calloutType: string;
  readonly foldState: "open" | "closed";
}): CalloutDisplay {
  return {
    calloutType: props.calloutType,
    foldState: props.foldState,
    typeLabel: CALLOUT_TYPE_LABELS[props.calloutType.toLowerCase()] ?? props.calloutType,
  };
}

export interface CalloutProps {
  readonly calloutType: string;
  readonly foldState: "open" | "closed";
  readonly onToggleFold: () => void;
  readonly children?: ReactNode;
}

export function Callout({ calloutType, foldState, onToggleFold, children }: CalloutProps) {
  const display = getCalloutDisplay({ calloutType, foldState });

  return (
    <div className="nabla-callout" data-fold-state={foldState} data-callout-type={calloutType.toLowerCase()}>
      <div className="nabla-callout__header">
        <span className="nabla-callout__type">{display.typeLabel}</span>
        <button
          className="nabla-callout__toggle"
          onClick={onToggleFold}
          aria-label={foldState === "open" ? "Collapse" : "Expand"}
          type="button"
        >
          {foldState === "open" ? "−" : "+"}
        </button>
      </div>
      {foldState === "open" && <div className="nabla-callout__body">{children}</div>}
    </div>
  );
}
