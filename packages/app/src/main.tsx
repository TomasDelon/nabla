import { createRoot } from "react-dom/client";
import { useState } from "react";
import { SAMPLE_DOCUMENT_SOURCE } from "./sample-document.js";
import "./app.css";

function App() {
  const [source] = useState(SAMPLE_DOCUMENT_SOURCE);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Nabla</h1>
        <p className="app-subtitle">Markdown-first visual editor</p>
      </header>
      <main className="app-main">
        <div className="status-card">
          <h2 className="status-card__title">Phase 5 app shell running</h2>
          <p className="status-card__note">
            This is not loading documents yet.
          </p>
        </div>

        <div className="sample-section">
          <h2 className="section-title">Sample source loaded</h2>
          <p className="section-note">
            Parsing/rendering starts in P5-004.
          </p>
          <textarea
            className="source-view"
            readOnly
            value={source}
            rows={20}
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
