export interface FootnoteDisplay {
  readonly id: string;
  readonly kind: "reference" | "definition";
  readonly text: string | undefined;
  readonly displayText: string;
}

export function getFootnoteDisplay(props: {
  readonly footnoteKind: "reference" | "definition";
  readonly id: string;
  readonly text?: string;
}): FootnoteDisplay {
  return {
    id: props.id,
    kind: props.footnoteKind,
    text: props.text,
    displayText:
      props.footnoteKind === "reference" ? `[${props.id}]` : `[^${props.id}]: ${props.text ?? ""}`,
  };
}

export interface FootnoteReferenceProps {
  readonly footnoteKind: "reference";
  readonly id: string;
  readonly raw: string;
}

export function FootnoteReference({ id }: FootnoteReferenceProps) {
  return (
    <sup className="nabla-footnote-reference" title={`Footnote ${id}`}>
      {id}
    </sup>
  );
}

export interface FootnoteDefinitionProps {
  readonly footnoteKind: "definition";
  readonly id: string;
  readonly text?: string;
  readonly raw: string;
}

export function FootnoteDefinition({ id, text }: FootnoteDefinitionProps) {
  return (
    <span className="nabla-footnote-definition">
      <span className="nabla-footnote-definition__id">[^{id}]:</span>{" "}
      <span className="nabla-footnote-definition__text">{text}</span>
    </span>
  );
}
