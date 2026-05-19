import { createRoot } from "react-dom/client";
import "./app.css";

function App() {
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
