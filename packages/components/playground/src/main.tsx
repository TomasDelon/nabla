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
import "./playground.css";

type TaskState = "unchecked" | "checked" | "cancelled" | "important";
const ALL_TASK_STATES: TaskState[] = ["unchecked", "checked", "cancelled", "important"];

function ExampleRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="playground-row">
      <span className="playground-row__label">{label}</span>
      <div className="playground-row__content">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="playground-section">
      <h2 className="playground-section__title">{title}</h2>
      <div className="playground-section__body">{children}</div>
    </section>
  );
}

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
    <div className="playground">
      <h1 className="playground__heading">@nabla/components</h1>
      <p className="playground__subtitle">
        Development playground — not the app. Source of truth remains Markdown/Nabla Markdown+.
      </p>

      <Section title="Task State Checkbox">
        {ALL_TASK_STATES.map((state, i) => (
          <ExampleRow key={state} label={TASK_STATE_LABELS[state]}>
            <TaskStateCheckbox state={taskStates[i]} text={`Item ${i + 1}`} onChange={(s) => handleTaskStateChange(i, s)} />
          </ExampleRow>
        ))}
      </Section>

      <Section title="Wiki Link">
        <ExampleRow label="Resolved">
          <WikiLink target="ResolvedPage" alias="Resolved Link" unresolved={false} raw="[[ResolvedPage|Resolved Link]]" />
        </ExampleRow>
        <ExampleRow label="Unresolved (missing target)">
          <WikiLink target="MissingPage" unresolved={true} raw="[[MissingPage]]" />
        </ExampleRow>
        <ExampleRow label="With heading reference">
          <WikiLink target="Page" heading="Section" unresolved={false} raw="[[Page#Section]]" />
        </ExampleRow>
        <ExampleRow label="With block reference">
          <WikiLink target="Page" blockId="abc123" unresolved={false} raw="[[Page^abc123]]" />
        </ExampleRow>
      </Section>

      <Section title="Tag">
        <ExampleRow label="Simple tag">
          <Tag value="mytag" segments={["mytag"]} raw="#mytag" />
        </ExampleRow>
        <ExampleRow label="Nested tag">
          <Tag value="nested/tag" segments={["nested", "tag"]} raw="#nested/tag" />
        </ExampleRow>
      </Section>

      <Section title="Highlight">
        <ExampleRow label="Simple highlight">
          <Highlight text="highlighted text" raw="==highlighted text==" />
        </ExampleRow>
        <ExampleRow label="Color highlight (#ffff00)">
          <Highlight text="yellow note" color="#ffff00" raw="=={#ff0}yellow note==" />
        </ExampleRow>
      </Section>

      <Section title="Emoji">
        <ExampleRow label="Known shortcode (:check:)">
          <Emoji name="check" value="✅" raw=":check:" />
        </ExampleRow>
        <ExampleRow label="Unknown shortcode (:unknown:)">
          <Emoji name="unknown" value=":unknown:" raw=":unknown:" />
        </ExampleRow>
      </Section>

      <Section title="Footnote">
        <ExampleRow label="Reference">
          <span>Some text </span>
          <FootnoteReference footnoteKind="reference" id="note1" raw="[^note1]" />
        </ExampleRow>
        <ExampleRow label="Definition">
          <FootnoteDefinition footnoteKind="definition" id="note1" text="Footnote definition text." raw="[^note1]: Footnote definition text." />
        </ExampleRow>
      </Section>

      <Section title="Comment">
        <ExampleRow label="Editing mode (visible)">
          <Comment text="private note" multiline={false} raw="%%private note%%" mode="editing" />
        </ExampleRow>
        <ExampleRow label="Reading mode (hidden — renders null)">
          <Comment text="should be hidden" multiline={false} raw="%%should be hidden%%" mode="reading" />
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>→ (nothing rendered above)</span>
        </ExampleRow>
        <ExampleRow label="Multiline comment">
          <Comment text="line 1\nline 2" multiline={true} raw="%%line 1\nline 2%%" mode="editing" />
        </ExampleRow>
      </Section>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
