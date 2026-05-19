import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown";
import { EditorState as ProseMirrorEditorState } from "prosemirror-state";

export interface Editor {
  state: ProseMirrorEditorState;
  readonly nodeViews: Readonly<Record<string, never>>;
}

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

export function getSource(editor: Editor): string {
  return defaultMarkdownSerializer.serialize(editor.state.doc);
}
