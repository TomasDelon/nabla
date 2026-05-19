import type {
  NablaComponentKind,
  NablaComponentProps,
  TaskStateValue,
} from "./types.js";

export interface BridgeTaskStateMeta {
  readonly kind: "taskState";
  readonly state: TaskStateValue;
  readonly text: string;
}

export interface BridgeWikiLinkMeta {
  readonly kind: "wikiLink";
  readonly target: string;
  readonly alias?: string;
  readonly heading?: string;
  readonly blockId?: string;
  readonly unresolved: boolean;
  readonly raw: string;
}

export interface BridgeTagMeta {
  readonly kind: "tag";
  readonly value: string;
  readonly segments: readonly string[];
  readonly raw: string;
}

export interface BridgeHighlightMeta {
  readonly kind: "highlight";
  readonly text: string;
  readonly color?: string;
  readonly raw: string;
}

export interface BridgeEmojiMeta {
  readonly kind: "emoji";
  readonly name: string;
  readonly value: string;
  readonly raw: string;
}

export interface BridgeFootnoteMeta {
  readonly kind: "footnote";
  readonly footnoteKind: "reference" | "definition";
  readonly id: string;
  readonly text?: string;
  readonly raw: string;
}

export interface BridgeCommentMeta {
  readonly kind: "comment";
  readonly text: string;
  readonly multiline: boolean;
  readonly raw: string;
}

export interface BridgeCalloutMeta {
  readonly kind: "callout";
  readonly calloutType: string;
  readonly foldState: "open" | "closed";
}

export interface BridgeToggleMeta {
  readonly kind: "toggle";
  readonly foldState: "open" | "closed";
}

export interface BridgeFoldedHeadingMeta {
  readonly kind: "foldedHeading";
  readonly level: number;
  readonly text: string;
  readonly foldState: "open" | "closed";
}

export type BridgeComponentMetadata =
  | BridgeTaskStateMeta
  | BridgeWikiLinkMeta
  | BridgeTagMeta
  | BridgeHighlightMeta
  | BridgeEmojiMeta
  | BridgeFootnoteMeta
  | BridgeCommentMeta
  | BridgeCalloutMeta
  | BridgeToggleMeta
  | BridgeFoldedHeadingMeta;

export function toComponentKind(metadata: BridgeComponentMetadata): NablaComponentKind {
  return metadata.kind;
}

export function toComponentProps(metadata: BridgeComponentMetadata): NablaComponentProps {
  switch (metadata.kind) {
    case "taskState":
      return {
        kind: "taskState",
        state: metadata.state,
        text: metadata.text,
        onChange: () => {},
      };
    case "wikiLink":
      return {
        kind: "wikiLink",
        target: metadata.target,
        alias: metadata.alias,
        heading: metadata.heading,
        blockId: metadata.blockId,
        unresolved: metadata.unresolved,
        raw: metadata.raw,
      };
    case "tag":
      return {
        kind: "tag",
        value: metadata.value,
        segments: metadata.segments,
        raw: metadata.raw,
      };
    case "highlight":
      return {
        kind: "highlight",
        text: metadata.text,
        color: metadata.color,
        raw: metadata.raw,
      };
    case "emoji":
      return {
        kind: "emoji",
        name: metadata.name,
        value: metadata.value,
        raw: metadata.raw,
      };
    case "footnote":
      return {
        kind: "footnote",
        footnoteKind: metadata.footnoteKind,
        id: metadata.id,
        text: metadata.text,
        raw: metadata.raw,
      };
    case "comment":
      return {
        kind: "comment",
        text: metadata.text,
        multiline: metadata.multiline,
        raw: metadata.raw,
      };
    case "callout":
      return {
        kind: "callout",
        calloutType: metadata.calloutType,
        foldState: metadata.foldState,
        onToggleFold: () => {},
      };
    case "toggle":
      return {
        kind: "toggle",
        foldState: metadata.foldState,
        onToggleFold: () => {},
      };
    case "foldedHeading":
      return {
        kind: "foldedHeading",
        level: metadata.level,
        text: metadata.text,
        foldState: metadata.foldState,
        onToggleFold: () => {},
      };
  }
}

export interface NablaComponentDescriptor {
  readonly kind: NablaComponentKind;
  readonly props: NablaComponentProps;
}

export function createComponentDescriptor(metadata: BridgeComponentMetadata): NablaComponentDescriptor {
  return {
    kind: toComponentKind(metadata),
    props: toComponentProps(metadata),
  };
}

export const BRIDGE_DEFERRED_KINDS: readonly string[] = ["transclusion"];

export const BRIDGE_BLOCKED_KINDS: readonly string[] = ["tooltip"];

export function isBridgeKindSupported(kind: string): boolean {
  return (
    !BRIDGE_DEFERRED_KINDS.includes(kind) && !BRIDGE_BLOCKED_KINDS.includes(kind)
  );
}
