# P5 MVP Visual Audit

## Task

`P5-MVP-VISUAL-AUDIT` - Manual MVP visual/product audit

## Environment

- Branch confirmed: `phase-1-markup-core`
- Accepted base head provided: `7459d78`
- Browser URL targeted: `http://127.0.0.1:5173`

## Run Commands Used

```bash
git branch --show-current
git status --short
pnpm install
pnpm build
pnpm --dir packages/app build
pnpm dev:app
curl -I http://127.0.0.1:5173
```

## App Start Result

- App starts successfully: **No**
- Dev server shell responds at `http://127.0.0.1:5173`: **Yes**
- HTTP server result: **200 OK**
- MVP status: **blocked**
- Screenshots taken manually: **No**
- Manual visual audit completed: **No**

## Blocking Failure

The Vite dev server starts, but the app does not load cleanly because `packages/app/src/app.css` imports `@nabla/components/src/*.css` paths that are not exported by `packages/components/package.json`. The current runtime error observed in the dev log is:

```text
[postcss] Missing "./src/tokens.css" specifier in "@nabla/components" package
```

Because the app is blocked at startup, a real browser-based visual/product audit could not be completed in this task without first fixing the runtime packaging issue. Per task instructions, no source changes were made.

## Browser / Inspection Notes

- URL tested: `http://127.0.0.1:5173`
- Local browser binary was not available in this environment.
- A temporary Playwright-based screenshot attempt was not usable on this host because browser installation failed for the current OS target.
- Independent of that tooling limitation, the app already shows a concrete startup blocker in the Vite dev log, so the MVP cannot be considered visually auditable in its current accepted state.

## Visual Findings

- No reliable rendered-app visual audit was possible because runtime CSS resolution blocks normal app loading.
- From implementation review only, the shell is structured as a narrow single-column card stack with textarea-driven editing, canonical export, workspace summary, and component preview sections.
- The current product framing appears functional but likely still developer-facing rather than end-user-ready: multiple sections are diagnostic/summary-heavy, and the source editor is explicitly described as plain-source MVP.

## UX Findings

- Primary blocker: the current accepted MVP cannot be opened into a trustworthy interactive state for manual evaluation.
- Even before visual polish concerns, startup reliability is now the highest UX issue because users cannot reach the product.
- Based on the UI structure in `packages/app/src/main.tsx`, the experience is still likely biased toward internal validation rather than clear user workflow: pipeline stats, diagnostics counts, and component preview inventory are prominent.

## Technical Risks

- Package export/runtime mismatch between `packages/app/src/app.css` and `packages/components/package.json` means build success does not guarantee dev-runtime success.
- Phase 5 validation previously recorded "App opens in browser"; current accepted state shows that claim is not durable enough without an actual runtime smoke check tied to asset resolution.
- Current test/gate coverage appears strong for Node and package boundaries, but it does not protect against this browser/runtime CSS packaging failure.

## Source-of-Truth Risks

- No new source-of-truth violation was found during this audit.
- The main risk is operational: if the MVP cannot boot reliably, the source-of-truth workflow cannot be exercised manually, which weakens confidence in the end-to-end invariant despite passing non-browser tests.

## Top 10 Highest-Impact Improvements

1. Restore app startup by aligning component CSS imports with package exports.
2. Add a real browser/runtime smoke gate for `pnpm dev:app` asset resolution.
3. Add a minimal rendered-page verification step before declaring browser-open success.
4. Reduce diagnostic-first framing in the top viewport.
5. Make the editor/export workflow more visually primary than internal summaries.
6. Clarify section labels around "Render pipeline" and "Workspace" for non-developer users.
7. Rebalance the component preview so it supports comprehension instead of reading like a fixture gallery.
8. Add explicit empty/error/loading UI states once runtime boot is fixed.
9. Introduce visual regression or screenshot coverage for the MVP shell.
10. Re-run a true manual visual audit after startup reliability is restored.

## Recommended Next Controlled Task

`P5-MVP-RUNTIME-REPAIR` - repair the app runtime/package export mismatch so `pnpm dev:app` loads the MVP successfully in a browser before any further MVP polish or Phase 6 work.

## Phase 6 Recommendation

Phase 6 should **not** start now. MVP repair/polish tasks should happen first, beginning with the runtime startup failure that currently blocks manual product validation.

## Audit Outcome

This audit task completed as a **blocked audit report**. The required manual visual/product review could not proceed to a full rendered-product assessment because the current accepted MVP does not load cleanly at runtime.
