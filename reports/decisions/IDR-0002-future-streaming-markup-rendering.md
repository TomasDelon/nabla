# IDR-0002 Future Streaming MarkUp Rendering

## Status

Accepted as a future architecture constraint.

Not in current implementation scope.

## Decision

Nabla should eventually support AI responses streamed as Nabla MarkUp and rendered progressively in the user interface.

This is a future capability. It must not be implemented during the current Phase 1 work unless a later phase explicitly authorizes it.

## Context

A future Nabla AI interface may receive generated text token-by-token from a language model. Instead of rendering only Markdown, Nabla should be able to render its own MarkUp progressively.

This implies a future pipeline similar to:

```text
LLM token stream
→ text buffer
→ tolerant/incremental MarkUp parsing
→ partial AST or render fallback
→ progressive visual rendering
```

## Architectural Implications

Current implementation should avoid decisions that make future streaming impossible.

The design should leave room for:

- tolerant parsing modes;
- incomplete MarkUp structures;
- partial rendering;
- fallback-to-text behavior;
- later stabilization of components once closing syntax arrives;
- separation between source text, AST, and visual rendering.

## Future Behavior

When streaming AI responses:

- plain text should render immediately;
- simple inline syntax may render progressively;
- incomplete structures should not crash the renderer;
- incomplete structures should fall back to safe text rendering;
- heavy components should render only once stable or closed;
- the source text must remain recoverable.

Examples of future stable/unstable behavior:

- A completed wiki link may render as a link.
- An unfinished highlight may remain text until closed.
- A callout/toggle may render provisionally, then stabilize.
- A Mermaid/code/LaTeX block may render only after closing fence/delimiter.

## Out of Scope Now

Do not implement during current Phase 1:

- AI UI;
- AI chat;
- LLM integration;
- streaming parser;
- incremental AST;
- partial renderer;
- editor streaming behavior;
- component stabilization logic.

## Current Constraint

Phase 1 parser/serializer work should remain focused on fixture-backed batch parsing and serialization.

However, it should avoid unnecessary coupling that would block future tolerant or streaming parsing modes.
