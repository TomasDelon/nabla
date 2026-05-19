export interface TagDisplay {
  readonly value: string;
  readonly segments: readonly string[];
  readonly displayText: string;
}

export function getTagDisplay(props: {
  readonly value: string;
  readonly segments: readonly string[];
}): TagDisplay {
  return {
    value: props.value,
    segments: props.segments,
    displayText: `#${props.value}`,
  };
}

export interface TagProps {
  readonly value: string;
  readonly segments: readonly string[];
  readonly raw: string;
}

export function Tag({ value, segments }: TagProps) {
  const display = getTagDisplay({ value, segments });

  return (
    <span className="nabla-tag" title={display.value}>
      {display.displayText}
    </span>
  );
}
