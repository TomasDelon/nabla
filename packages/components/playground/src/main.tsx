import { createRoot } from "react-dom/client";
import { useState, type ReactNode } from "react";
import { TaskStateCheckbox, getNextTaskState, TASK_STATE_LABELS } from "../../src/task-state.tsx";
import { WikiLink } from "../../src/wiki-link.tsx";
import { Tag } from "../../src/tag.tsx";
import { Highlight } from "../../src/highlight.tsx";
import { Emoji } from "../../src/emoji.tsx";
import { FootnoteReference, FootnoteDefinition } from "../../src/footnote.tsx";
import { Comment } from "../../src/comment.tsx";

import "../../src/tokens.css";
import "../../src/task-state.css";
import "../../src/wiki-link.css";
import "../../src/tag.css";
import "../../src/highlight.css";
import "../../src/emoji.css";
import "../../src/footnote.css";
import "../../src/comment.css";

type TaskState = "unchecked" | "checked" | "cancelled" | "important";
const ALL_TASK_STATES: TaskState[] = ["unchecked", "checked", "cancelled", "important"];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2 style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "0.75rem" }}>
        {children}
      </div>
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>{children}</span>;
}

const CONTAINER_STYLE: Record<string, string> = {
  maxWidth: "640px",
  margin: "0 auto",
  padding: "2rem",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

function App() {
  const [taskStates, setTaskStates] = useState<TaskState[]>(["unchecked", "checked", "cancelled", "important"]);

  function handleTaskStateChange(index: number, _newState: TaskState) {
    setTaskStates((prev) => {
      const next = [...prev];
      next[index] = getNextTaskState(prev[index]);
      return next;
    });
  }

  return (
    <div style={CONTAINER_STYLE}>
      <h1 style={{ marginBottom: "0.25rem" }}>@nabla/components</h1>
      <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "2rem" }}>
        Development playground — not the app. Source of truth remains Markdown/Nabla Markdown+.
      </p>

      <Section title="Task State Checkbox">
        {ALL_TASK_STATES.map((state, i) => (
          <div key={state}>
            <Label>{TASK_STATE_LABELS[state]}</Label>
            <TaskStateCheckbox state={taskStates[i]} text={`Item ${i + 1}`} onChange={(s) => handleTaskStateChange(i, s)} />
          </div>
        ))}
      </Section>

      <Section title="Wiki Link">
        <div>
          <Label>Resolved</Label>
          <WikiLink target="ResolvedPage" alias="Resolved Link" unresolved={false} raw="[[ResolvedPage|Resolved Link]]" />
        </div>
        <div>
          <Label>Unresolved (missing target)</Label>
          <WikiLink target="MissingPage" unresolved={true} raw="[[MissingPage]]" />
        </div>
        <div>
          <Label>With heading reference</Label>
          <WikiLink target="Page" heading="Section" unresolved={false} raw="[[Page#Section]]" />
        </div>
        <div>
          <Label>With block reference</Label>
          <WikiLink target="Page" blockId="abc123" unresolved={false} raw="[[Page^abc123]]" />
        </div>
      </Section>

      <Section title="Tag">
        <div>
          <Label>Simple tag</Label>
          <Tag value="mytag" segments={["mytag"]} raw="#mytag" />
        </div>
        <div>
          <Label>Nested tag</Label>
          <Tag value="nested/tag" segments={["nested", "tag"]} raw="#nested/tag" />
        </div>
      </Section>

      <Section title="Highlight">
        <div>
          <Label>Simple highlight</Label>
          <Highlight text="highlighted text" raw="==highlighted text==" />
        </div>
        <div>
          <Label>Color highlight (#ffff00)</Label>
          <Highlight text="yellow note" color="#ffff00" raw="=={#ff0}yellow note==" />
        </div>
      </Section>

      <Section title="Emoji">
        <div>
          <Label>Known shortcode (:check:)</Label>
          <Emoji name="check" value="✅" raw=":check:" />
        </div>
        <div>
          <Label>Unknown shortcode (:unknown:)</Label>
          <Emoji name="unknown" value=":unknown:" raw=":unknown:" />
        </div>
      </Section>

      <Section title="Footnote">
        <div>
          <Label>Reference</Label>
          <span>Some text</span>
          <FootnoteReference footnoteKind="reference" id="note1" raw="[^note1]" />
        </div>
        <div>
          <Label>Definition</Label>
          <FootnoteDefinition footnoteKind="definition" id="note1" text="Footnote definition text." raw="[^note1]: Footnote definition text." />
        </div>
      </Section>

      <Section title="Comment">
        <div>
          <Label>Editing mode (visible)</Label>
          <Comment text="private note" multiline={false} raw="%%private note%%" mode="editing" />
        </div>
        <div>
          <Label>Reading mode (hidden — renders null)</Label>
          <Comment text="should be hidden" multiline={false} raw="%%should be hidden%%" mode="reading" />
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>→ (nothing rendered above)</span>
        </div>
        <div>
          <Label>Multiline comment</Label>
          <Comment text="line 1\nline 2" multiline={true} raw="%%line 1\nline 2%%" mode="editing" />
        </div>
      </Section>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
