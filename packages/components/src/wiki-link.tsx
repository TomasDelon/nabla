export interface WikiLinkDisplay {
  readonly displayText: string;
  readonly hasAlias: boolean;
  readonly hasHeading: boolean;
  readonly hasBlockId: boolean;
}

export function getWikiLinkDisplay(props: {
  readonly target: string;
  readonly alias?: string;
  readonly heading?: string;
  readonly blockId?: string;
}): WikiLinkDisplay {
  return {
    displayText: props.alias ?? props.target,
    hasAlias: props.alias !== undefined,
    hasHeading: props.heading !== undefined,
    hasBlockId: props.blockId !== undefined,
  };
}

export interface WikiLinkProps {
  readonly target: string;
  readonly alias?: string;
  readonly heading?: string;
  readonly blockId?: string;
  readonly unresolved: boolean;
  readonly raw: string;
}

export function WikiLink({
  target,
  alias,
  heading,
  blockId,
  unresolved,
}: WikiLinkProps) {
  const display = getWikiLinkDisplay({ target, alias, heading, blockId });

  return (
    <span
      className="nabla-wiki-link"
      data-unresolved={unresolved ? "" : undefined}
      title={unresolved ? `Missing note: ${target}` : target}
    >
      <span className="nabla-wiki-link__text">{display.displayText}</span>
      {display.hasHeading && (
        <span className="nabla-wiki-link__meta">#{heading}</span>
      )}
      {display.hasBlockId && (
        <span className="nabla-wiki-link__meta">^{blockId}</span>
      )}
    </span>
  );
}
