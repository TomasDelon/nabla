/**
 * Nabla Component Rendering Contract
 *
 * Components are the rendering/view layer only.
 * Markdown/Nabla Markdown+ remains the only persistent source of truth.
 * No hidden JSON, no stored HTML, no serialized component state as source of truth.
 * Components must not mutate parser/serializer/workspace state.
 */

/**
 * Discriminated union of all Nabla component kinds that Phase 4
 * may implement. Blocked or deferred features are excluded.
 */
export type NablaComponentKind =
  | "taskState"
  | "wikiLink"
  | "tag"
  | "highlight"
  | "emoji"
  | "footnote"
  | "comment"
  | "callout"
  | "toggle"
  | "foldedHeading";

/**
 * Features explicitly BLOCKED or DEFERRED from Phase 4 scope.
 *
 * - "transclusion": DEFERRED. Requires stable editor-to-components bridge
 *   and workspace resolver integration. Do not implement until explicitly tasked.
 *
 * - "tooltip": BLOCKED. Tooltip markup extension
 *   (packages/markup/src/extensions/tooltips.ts) is not implemented.
 *   Do not implement tooltip rendering until the extension exists.
 */
export type NablaDeferredComponentKind = "transclusion" | "tooltip";

/**
 * Rendering mode for the component context.
 */
export type NablaRenderMode = "reading" | "editing";

/**
 * Shared rendering context passed to all components.
 */
export interface NablaComponentContext {
  readonly mode: NablaRenderMode;
}

/**
 * Task state value mapped from the editor adapter metadata.
 * Mirrors TaskState from @nabla/markup.
 */
export type TaskStateValue =
  | "unchecked"
  | "checked"
  | "inProgress"
  | "important";

export interface TaskStateProps {
  readonly kind: "taskState";
  readonly state: TaskStateValue;
  readonly text: string;
  readonly onChange: (newState: TaskStateValue) => void;
}

export interface WikiLinkProps {
  readonly kind: "wikiLink";
  readonly target: string;
  readonly alias?: string;
  readonly heading?: string;
  readonly blockId?: string;
  readonly unresolved: boolean;
  readonly raw: string;
}

export interface TagProps {
  readonly kind: "tag";
  readonly value: string;
  readonly segments: readonly string[];
  readonly raw: string;
}

export interface HighlightProps {
  readonly kind: "highlight";
  readonly text: string;
  readonly color?: string;
  readonly raw: string;
}

export interface EmojiProps {
  readonly kind: "emoji";
  readonly name: string;
  readonly value: string;
  readonly raw: string;
}

export interface FootnoteProps {
  readonly kind: "footnote";
  readonly footnoteKind: "reference" | "definition";
  readonly id: string;
  readonly text?: string;
  readonly raw: string;
}

export interface CommentProps {
  readonly kind: "comment";
  readonly text: string;
  readonly multiline: boolean;
  readonly raw: string;
}

export interface CalloutProps {
  readonly kind: "callout";
  readonly calloutType: string;
  readonly foldState: "open" | "closed";
  readonly children?: never;
  readonly onToggleFold: () => void;
}

export interface ToggleProps {
  readonly kind: "toggle";
  readonly foldState: "open" | "closed";
  readonly children?: never;
  readonly onToggleFold: () => void;
}

export interface FoldedHeadingProps {
  readonly kind: "foldedHeading";
  readonly level: number;
  readonly text: string;
  readonly foldState: "open" | "closed";
  readonly children?: never;
  readonly onToggleFold: () => void;
}

/**
 * Discriminated union of all component props.
 */
export type NablaComponentProps =
  | TaskStateProps
  | WikiLinkProps
  | TagProps
  | HighlightProps
  | EmojiProps
  | FootnoteProps
  | CommentProps
  | CalloutProps
  | ToggleProps
  | FoldedHeadingProps;

/**
 * Component registry mapping each NablaComponentKind to its
 * rendering function or component class.
 *
 * The editor-to-components bridge (P4-012) will use this registry
 * to resolve node view implementations.
 */
export interface NablaComponentRegistry {
  readonly taskState: (props: TaskStateProps) => unknown;
  readonly wikiLink: (props: WikiLinkProps) => unknown;
  readonly tag: (props: TagProps) => unknown;
  readonly highlight: (props: HighlightProps) => unknown;
  readonly emoji: (props: EmojiProps) => unknown;
  readonly footnote: (props: FootnoteProps) => unknown;
  readonly comment: (props: CommentProps) => unknown;
  readonly callout: (props: CalloutProps) => unknown;
  readonly toggle: (props: ToggleProps) => unknown;
  readonly foldedHeading: (props: FoldedHeadingProps) => unknown;
}

/**
 * Contract identifier for runtime wiring validation.
 */
export const NABLA_COMPONENT_RENDERING_CONTRACT =
  "nabla-component-rendering-contract";
