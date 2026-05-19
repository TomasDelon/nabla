export interface HighlightStyle {
  readonly text: string;
  readonly color: string | undefined;
  readonly backgroundColor: string;
}

export function getHighlightStyle(props: {
  readonly text: string;
  readonly color?: string;
}): HighlightStyle {
  return {
    text: props.text,
    color: props.color,
    backgroundColor: props.color ?? "#ffff0066",
  };
}

export interface HighlightProps {
  readonly text: string;
  readonly color?: string;
  readonly raw: string;
}

export function Highlight({ text, color }: HighlightProps) {
  const style = getHighlightStyle({ text, color });

  return (
    <mark
      className="nabla-highlight"
      data-has-color={color ? "" : undefined}
      style={
        color
          ? { backgroundColor: color, color: "#1a1a1a" }
          : undefined
      }
    >
      {style.text}
    </mark>
  );
}
