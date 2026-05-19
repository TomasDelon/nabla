import { createRoot } from "react-dom/client";
import { useState } from "react";
import { SAMPLE_DOCUMENT_SOURCE } from "./sample-document.js";
import { getRenderPipelineSummary } from "./render-pipeline.js";
import "./app.css";

function App() {
  const [source] = useState(SAMPLE_DOCUMENT_SOURCE);
  const summary = getRenderPipelineSummary(source);

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
            <span>Original length: {summary.originalLength}</span>
            <span>Canonical length: {summary.canonicalLength}</span>
            <span>Diagnostics: {summary.diagnosticsCount}</span>
          </div>
        </div>

        <div className="sample-section">
          <h2 className="section-title">Original source</h2>
          <textarea
            className="source-view"
            readOnly
            value={source}
            rows={10}
          />
        </div>

        <div className="sample-section">
          <h2 className="section-title">Canonical output</h2>
          <p className="section-note">
            Visual component rendering starts in P5-005.
          </p>
          <textarea
            className="source-view"
            readOnly
            value={summary.canonicalSource}
            rows={10}
          />
        </div>

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
