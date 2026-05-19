import { createRoot } from "react-dom/client";
import { useState } from "react";
import { SAMPLE_DOCUMENT_SOURCE } from "./sample-document.js";
import { getRenderPipelineSummary } from "./render-pipeline.js";
import {
  createSampleComponentDescriptors,
  getComponentRenderingSummary,
} from "./component-rendering.js";
import {
  getEditableSource,
  exportCanonicalSource,
  getEditorIntegrationSummary,
} from "./editor-integration.js";
import {
  getWorkspaceIntegrationSummary,
} from "./workspace-integration.js";
import {
  TaskStateCheckbox,
  getNextTaskState,
  WikiLink,
  Tag,
  Highlight,
  Emoji,
  FootnoteReference,
  FootnoteDefinition,
  Comment,
  Callout,
  Toggle,
  FoldedHeading,
} from "@nabla/components";
import "./app.css";

function App() {
  const [editedSource, setEditedSource] = useState(
    getEditableSource(SAMPLE_DOCUMENT_SOURCE),
  );

  const pipelineSummary = getRenderPipelineSummary(SAMPLE_DOCUMENT_SOURCE);
  const canonicalExport = exportCanonicalSource(editedSource);
  const editorSummary = getEditorIntegrationSummary(editedSource);
  const workspaceSummary = getWorkspaceIntegrationSummary(editedSource);

  const componentSummary = getComponentRenderingSummary();

  const [taskStates, setTaskStates] = useState<string[]>([
    "unchecked", "checked", "cancelled", "important",
  ]);

  function handleTaskStateChange(index: number) {
    setTaskStates((prev) => {
      const next = [...prev];
      next[index] = getNextTaskState(prev[index] as any);
      return next;
    });
  }

  const [calloutFoldStates, setCalloutFoldStates] = useState<
    Record<string, "open" | "closed">
  >({ note: "open", warning: "closed" });

  function toggleCallout(key: string) {
    setCalloutFoldStates((prev) => ({
      ...prev,
      [key]: prev[key] === "open" ? "closed" : "open",
    }));
  }

  const [toggleFoldStates, setToggleFoldStates] = useState<
    Record<string, "open" | "closed">
  >({ first: "open", second: "closed" });

  function handleToggle(key: string) {
    setToggleFoldStates((prev) => ({
      ...prev,
      [key]: prev[key] === "open" ? "closed" : "open",
    }));
  }

  const [headingFoldStates, setHeadingFoldStates] = useState<
    Record<string, "open" | "closed">
  >({ h2: "open", h3: "closed" });

  function toggleHeading(key: string) {
    setHeadingFoldStates((prev) => ({
      ...prev,
      [key]: prev[key] === "open" ? "closed" : "open",
    }));
  }

  const descriptors = createSampleComponentDescriptors();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Nabla</h1>
        <p className="app-subtitle">Markdown-first visual editor</p>
      </header>
      <main className="app-main">
        <div className="status-card">
          <h2 className="status-card__title">Render pipeline connected</h2>
          <div className="status-card__stats">
            <span>Original length: {pipelineSummary.originalLength}</span>
            <span>Canonical length: {pipelineSummary.canonicalLength}</span>
            <span>Diagnostics: {pipelineSummary.diagnosticsCount}</span>
          </div>
        </div>

        <section className="editor-section">
          <h2 className="section-title">Editor</h2>
          <p className="section-note">
            This is plain source editing MVP. Rich-text editor node views are deferred.
          </p>
          <div className="editor-summary">
            <span>Edited length: {editorSummary.sourceLength}</span>
            <span>Exported length: {editorSummary.exportedLength}</span>
            <span>Diagnostics: {editorSummary.diagnosticsCount}</span>
          </div>
          <textarea
            className="editor-textarea"
            value={editedSource}
            onChange={(e) => setEditedSource(e.target.value)}
            rows={12}
          />
        </section>

        <div className="sample-section">
          <h2 className="section-title">Canonical export</h2>
          <textarea
            className="source-view"
            readOnly
            value={canonicalExport}
            rows={10}
          />
        </div>

        <div className="status-card">
          <h2 className="status-card__title">Workspace</h2>
          <p className="section-note">
            MVP-level workspace index from in-memory document. No filesystem, no transclusion rendering.
          </p>
          <div className="status-card__stats">
            <span>Documents: {workspaceSummary.documentCount}</span>
            <span>Links: {workspaceSummary.linkCount}</span>
            <span>Backlinks: {workspaceSummary.backlinkCount}</span>
            <span>Diagnostics: {workspaceSummary.diagnosticCount}</span>
          </div>
        </div>

        <section className="component-preview">
          <h2 className="section-title">Visual Components Preview</h2>
          <p className="section-note">
            Derived UI from sample metadata — Markdown/Nabla Markdown+ remains
            the source of truth. No editor/workspace integration.
            Total: {componentSummary.totalCount} descriptors,
            {componentSummary.supportedKinds.length} supported component kinds.
          </p>

          <div className="preview-grid">
            <div className="preview-group">
              <h3 className="preview-group__title">Task State</h3>
              <div className="preview-examples">
                {descriptors.filter(d => d.kind === "taskState").map((desc, i) => {
                  const props = desc.props as any;
                  return (
                    <div key={i} className="preview-item">
                      <TaskStateCheckbox
                        state={props.state}
                        text={props.text}
                        onChange={() => handleTaskStateChange(i)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="preview-group">
              <h3 className="preview-group__title">Wiki Link</h3>
              <div className="preview-examples">
                {descriptors.filter(d => d.kind === "wikiLink").map((desc, i) => {
                  const p = desc.props as any;
                  return (
                    <div key={i} className="preview-item">
                      <WikiLink
                        target={p.target}
                        alias={p.alias}
                        heading={p.heading}
                        blockId={p.blockId}
                        unresolved={p.unresolved}
                        raw={p.raw}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="preview-group">
              <h3 className="preview-group__title">Tag</h3>
              <div className="preview-examples">
                {descriptors.filter(d => d.kind === "tag").map((desc, i) => {
                  const p = desc.props as any;
                  return (
                    <div key={i} className="preview-item">
                      <Tag value={p.value} segments={p.segments} raw={p.raw} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="preview-group">
              <h3 className="preview-group__title">Highlight</h3>
              <div className="preview-examples">
                {descriptors.filter(d => d.kind === "highlight").map((desc, i) => {
                  const p = desc.props as any;
                  return (
                    <div key={i} className="preview-item">
                      <Highlight text={p.text} color={p.color} raw={p.raw} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="preview-group">
              <h3 className="preview-group__title">Emoji</h3>
              <div className="preview-examples">
                {descriptors.filter(d => d.kind === "emoji").map((desc, i) => {
                  const p = desc.props as any;
                  return (
                    <div key={i} className="preview-item">
                      <Emoji name={p.name} value={p.value} raw={p.raw} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="preview-group">
              <h3 className="preview-group__title">Footnote</h3>
              <div className="preview-examples">
                {descriptors.filter(d => d.kind === "footnote").map((desc, i) => {
                  const p = desc.props as any;
                  if (p.footnoteKind === "reference") {
                    return (
                      <div key={i} className="preview-item">
                        <FootnoteReference footnoteKind="reference" id={p.id} raw={p.raw} />
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="preview-item">
                      <FootnoteDefinition footnoteKind="definition" id={p.id} text={p.text} raw={p.raw} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="preview-group">
              <h3 className="preview-group__title">Comment</h3>
              <div className="preview-comment-row">
                <span className="preview-comment-label">Editing mode (visible):</span>
                <Comment text="private note" multiline={false} raw="%%private note%%" mode="editing" />
              </div>
              <div className="preview-comment-row">
                <span className="preview-comment-label">Reading mode (hidden):</span>
                <Comment text="should be hidden" multiline={false} raw="%%should be hidden%%" mode="reading" />
                <span className="preview-comment-note">&rarr; (nothing rendered above)</span>
              </div>
            </div>

            <div className="preview-group">
              <h3 className="preview-group__title">Callout</h3>
              <div className="preview-examples">
                <div className="preview-item">
                  <Callout calloutType="note" foldState={calloutFoldStates.note} onToggleFold={() => toggleCallout("note")}>
                    <p style={{ margin: 0 }}>Note callout body — visible when open.</p>
                  </Callout>
                </div>
                <div className="preview-item">
                  <Callout calloutType="warning" foldState={calloutFoldStates.warning} onToggleFold={() => toggleCallout("warning")}>
                    <p style={{ margin: 0 }}>Warning callout body — hidden when closed.</p>
                  </Callout>
                </div>
              </div>
            </div>

            <div className="preview-group">
              <h3 className="preview-group__title">Toggle</h3>
              <div className="preview-examples">
                <div className="preview-item">
                  <Toggle foldState={toggleFoldStates.first} onToggleFold={() => handleToggle("first")}>
                    <p style={{ margin: 0 }}>Toggle body visible when open.</p>
                  </Toggle>
                </div>
                <div className="preview-item">
                  <Toggle foldState={toggleFoldStates.second} onToggleFold={() => handleToggle("second")}>
                    <p style={{ margin: 0 }}>Toggle body hidden when closed.</p>
                  </Toggle>
                </div>
              </div>
            </div>

            <div className="preview-group">
              <h3 className="preview-group__title">Folded Heading</h3>
              <div className="preview-examples">
                <div className="preview-item">
                  <FoldedHeading level={2} text="Section Title" foldState={headingFoldStates.h2} onToggleFold={() => toggleHeading("h2")}>
                    <p style={{ margin: 0 }}>Content under level-2 folded heading.</p>
                  </FoldedHeading>
                </div>
                <div className="preview-item">
                  <FoldedHeading level={3} text="Sub Section" foldState={headingFoldStates.h3} onToggleFold={() => toggleHeading("h3")}>
                    <p style={{ margin: 0 }}>Content under level-3 folded heading, hidden when closed.</p>
                  </FoldedHeading>
                </div>
              </div>
            </div>
          </div>
        </section>

        <p className="app-reminder">
          Markdown/Nabla Markdown+ remains the source of truth.
        </p>
      </main>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
