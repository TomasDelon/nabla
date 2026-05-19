import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown";
import { EditorState as ProseMirrorEditorState } from "prosemirror-state";

import {
  getTaskStateNodeViews,
  getTaskStatesFromMarkdown,
  setTaskStateInMarkdown,
  toggleTaskStateInMarkdown,
} from "./nodes/task-state.js";
import {
  getWikiLinkNodeViews,
  getWikiLinksFromMarkdown,
  setWikiLinkAliasInMarkdown,
} from "./nodes/wiki-link.js";

import type { TaskState } from "@nabla/markup";
import type { EditorTaskState } from "./nodes/task-state.js";
import type { EditorWikiLink } from "./nodes/wiki-link.js";

export interface Editor {
  state: ProseMirrorEditorState;
  source: string;
  readonly nodeViews: Readonly<{
    readonly taskState: string;
    readonly wikiLink: string;
  }>;
}

export interface EditorBlockSummary {
  readonly type:
    | "heading"
    | "paragraph"
    | "bullet_list"
    | "ordered_list"
    | "list_item"
    | "code_block"
    | "blockquote";
  readonly level?: number;
}

type SummaryNode = {
  readonly type: {
    readonly name: string;
  };
  readonly attrs: {
    readonly level?: number;
  };
  forEach(callback: (child: SummaryNode) => void): void;
};

function createState(markdown: string) {
  return ProseMirrorEditorState.create({
    schema: defaultMarkdownParser.schema,
    doc: defaultMarkdownParser.parse(markdown),
  });
}

function normalizeExportedMarkdown(markdown: string): string {
  return markdown.replace(/\n$/, "");
}

function shouldPreserveSource(editor: Editor): boolean {
  return (
    getTaskStatesFromMarkdown(editor.source).length > 0 ||
    getWikiLinksFromMarkdown(editor.source).length > 0
  );
}

export function createEditor(): Editor {
  return {
    state: createState(""),
    source: "",
    nodeViews: Object.freeze({
      ...getTaskStateNodeViews(),
      ...getWikiLinkNodeViews(),
    }),
  };
}

export function loadSource(editor: Editor, markdown: string): Editor {
  editor.state = createState(markdown);
  editor.source = markdown;
  return editor;
}

export function replaceSource(editor: Editor, markdown: string): Editor {
  return loadSource(editor, markdown);
}

export function insertMarkdownBlock(editor: Editor, markdown: string): Editor {
  const current = getSource(editor);
  const nextSource = current === "" ? markdown : `${current}\n\n${markdown}`;
  return loadSource(editor, nextSource);
}

export function getSource(editor: Editor): string {
  if (shouldPreserveSource(editor)) {
    return normalizeExportedMarkdown(editor.source);
  }

  return defaultMarkdownSerializer.serialize(editor.state.doc);
}

export function getTaskStates(editor: Editor): readonly EditorTaskState[] {
  return getTaskStatesFromMarkdown(editor.source);
}

export function setTaskState(editor: Editor, index: number, state: TaskState): Editor {
  return loadSource(editor, setTaskStateInMarkdown(editor.source, index, state));
}

export function toggleTaskState(editor: Editor, index: number): Editor {
  return loadSource(editor, toggleTaskStateInMarkdown(editor.source, index));
}

export function getWikiLinks(editor: Editor): readonly EditorWikiLink[] {
  return getWikiLinksFromMarkdown(editor.source);
}

export function setWikiLinkAlias(editor: Editor, index: number, alias?: string): Editor {
  return loadSource(editor, setWikiLinkAliasInMarkdown(editor.source, index, alias));
}

function appendBlockSummaries(node: SummaryNode, summary: EditorBlockSummary[]): void {
  switch (node.type.name) {
    case "heading":
      summary.push({ type: "heading", level: node.attrs.level });
      break;
    case "paragraph":
    case "bullet_list":
    case "ordered_list":
    case "list_item":
    case "code_block":
    case "blockquote":
      summary.push({ type: node.type.name });
      break;
    default:
      break;
  }

  node.forEach((child) => {
    appendBlockSummaries(child, summary);
  });
}

export function getDocumentBlockSummary(editor: Editor): readonly EditorBlockSummary[] {
  const summary: EditorBlockSummary[] = [];

  editor.state.doc.forEach((child) => {
    appendBlockSummaries(child as SummaryNode, summary);
  });

  return summary;
}
