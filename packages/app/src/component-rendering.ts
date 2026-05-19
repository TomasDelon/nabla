import {
  createComponentDescriptor,
  isBridgeKindSupported,
} from "@nabla/components";
import type {
  NablaComponentDescriptor,
  BridgeComponentMetadata,
} from "@nabla/components";

/**
 * Temporary explicit sample metadata derived from the sample document.
 *
 * This is a temporary app MVP bridge. In the full integration, the parser or
 * editor adapter will extract BridgeComponentMetadata automatically from
 * parsed Markdown+ source.
 *
 * Markdown/Nabla Markdown+ remains the source of truth.
 * Component preview is derived UI, not saved state.
 */
const SAMPLE_METADATA: BridgeComponentMetadata[] = [
  { kind: "taskState", state: "unchecked", text: "Unchecked task" },
  { kind: "taskState", state: "checked", text: "Checked task" },
  { kind: "taskState", state: "cancelled", text: "Cancelled task" },
  { kind: "taskState", state: "important", text: "Important task" },
  { kind: "wikiLink", target: "ResolvedPage", alias: "Resolved Link", unresolved: false, raw: "[[ResolvedPage|Resolved Link]]" },
  { kind: "wikiLink", target: "MissingPage", unresolved: true, raw: "[[MissingPage]]" },
  { kind: "tag", value: "mytag", segments: ["mytag"], raw: "#mytag" },
  { kind: "tag", value: "nested/tag", segments: ["nested", "tag"], raw: "#nested/tag" },
  { kind: "highlight", text: "highlighted text", raw: "==highlighted text==" },
  { kind: "highlight", text: "yellow note", color: "#ffff00", raw: "=={#ffff00}yellow note==" },
  { kind: "emoji", name: "check", value: "\u2705", raw: ":check:" },
  { kind: "emoji", name: "unknown", value: ":unknown:", raw: ":unknown:" },
  { kind: "footnote", footnoteKind: "reference", id: "note1", raw: "[^note1]" },
  { kind: "footnote", footnoteKind: "definition", id: "note1", text: "Footnote definition text.", raw: "[^note1]: Footnote definition text." },
  { kind: "comment", text: "private note (editing mode)", multiline: false, raw: "%%private note%%" },
  { kind: "comment", text: "should be hidden (reading mode)", multiline: false, raw: "%%should be hidden%%" },
  { kind: "comment", text: "line 1\\nline 2", multiline: true, raw: "%%line 1\\nline 2%%" },
  { kind: "callout", calloutType: "note", foldState: "open" },
  { kind: "callout", calloutType: "warning", foldState: "closed" },
  { kind: "toggle", foldState: "open" },
  { kind: "toggle", foldState: "closed" },
  { kind: "foldedHeading", level: 2, text: "Section Title", foldState: "open" },
  { kind: "foldedHeading", level: 3, text: "Sub Section", foldState: "closed" },
];

export function createSampleComponentDescriptors(): NablaComponentDescriptor[] {
  return SAMPLE_METADATA.map((meta) => createComponentDescriptor(meta));
}

export interface ComponentRenderingSummary {
  readonly totalCount: number;
  readonly uniqueKinds: readonly string[];
  readonly supportedKinds: readonly string[];
}

export function getComponentRenderingSummary(): ComponentRenderingSummary {
  const descriptors = createSampleComponentDescriptors();
  const kinds = descriptors.map((d) => d.kind);
  const uniqueKinds = [...new Set(kinds)];
  const supportedKinds = uniqueKinds.filter((k) => isBridgeKindSupported(k));

  return {
    totalCount: descriptors.length,
    uniqueKinds,
    supportedKinds,
  };
}
