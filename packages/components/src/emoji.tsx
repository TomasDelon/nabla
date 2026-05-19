export interface EmojiDisplay {
  readonly name: string;
  readonly value: string;
  readonly raw: string;
  readonly isKnown: boolean;
}

export function getEmojiDisplay(props: {
  readonly name: string;
  readonly value: string;
  readonly raw: string;
}): EmojiDisplay {
  return {
    name: props.name,
    value: props.value,
    raw: props.raw,
    isKnown: props.value !== props.raw,
  };
}

export interface EmojiProps {
  readonly name: string;
  readonly value: string;
  readonly raw: string;
}

export function Emoji({ name, value, raw }: EmojiProps) {
  const display = getEmojiDisplay({ name, value, raw });

  if (display.isKnown) {
    return (
      <span className="nabla-emoji" title={`:${name}:`}>
        {display.value}
      </span>
    );
  }

  return (
    <span className="nabla-emoji nabla-emoji--unknown" title={`Unknown shortcode`}>
      {display.raw}
    </span>
  );
}
