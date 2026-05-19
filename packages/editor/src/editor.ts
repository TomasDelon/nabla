import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown";
import { EditorState as ProseMirrorEditorState } from "prosemirror-state";

export interface Editor {
  state: ProseMirrorEditorState;
  readonly nodeViews: Readonly<Record<string, never>>;
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

export function createEditor(): Editor {
  return {
    state: createState(""),
    nodeViews: Object.freeze({}),
  };
}

export function loadSource(editor: Editor, markdown: string): Editor {
  editor.state = createState(markdown);
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
  return defaultMarkdownSerializer.serialize(editor.state.doc);
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
