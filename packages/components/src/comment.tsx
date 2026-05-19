import type { NablaRenderMode } from "./types.js";

export interface CommentDisplay {
  readonly text: string;
  readonly multiline: boolean;
  readonly raw: string;
  readonly visible: boolean;
}

export function getCommentDisplay(props: {
  readonly text: string;
  readonly multiline: boolean;
  readonly raw: string;
  readonly mode: NablaRenderMode;
}): CommentDisplay {
  return {
    text: props.text,
    multiline: props.multiline,
    raw: props.raw,
    visible: props.mode === "editing",
  };
}

export interface CommentProps {
  readonly text: string;
  readonly multiline: boolean;
  readonly raw: string;
  readonly mode?: NablaRenderMode;
}

export function Comment({ text, multiline, raw, mode = "editing" }: CommentProps) {
  const display = getCommentDisplay({ text, multiline, raw, mode });

  if (!display.visible) {
    return null;
  }

  return (
    <span
      className="nabla-comment"
      data-multiline={multiline ? "" : undefined}
      title={`Comment${multiline ? " (multiline)" : ""}`}
    >
      %%{text}%%
    </span>
  );
}
