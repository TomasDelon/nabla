
# Phase 1 — @nabla/markup

## Goal

Implement the framework-independent markup core.

## Scope

This phase includes:

- AST types;
- diagnostic types;
- diagnostic catalog;
- fixture loader;
- parser skeleton;
- serializer skeleton;
- CommonMark/GFM integration;
- Nabla block post-processing;
- Nabla inline parsing;
- tests against fixtures.

This phase excludes:

- workspace resolution;
- editor UI;
- React components;
- Milkdown integration.

## Files to Create

```text
packages/markup/
├─ package.json
├─ src/
│  ├─ ast.ts
│  ├─ diagnostics.ts
│  ├─ parse-mode.ts
│  ├─ parser.ts
│  ├─ serializer.ts
│  ├─ fixtures.ts
│  ├─ protected-regions.ts
│  ├─ extensions/
│  │  ├─ wiki-links.ts
│  │  ├─ tags.ts
│  │  ├─ transclusions.ts
│  │  ├─ block-ids.ts
│  │  ├─ callouts.ts
│  │  ├─ toggles.ts
│  │  ├─ folded-headings.ts
│  │  ├─ tooltips.ts
│  │  ├─ highlights.ts
│  │  ├─ comments.ts
│  │  ├─ footnotes.ts
│  │  ├─ task-states.ts
│  │  └─ emoji-shortcodes.ts
│  └─ index.ts
└─ tests/
   ├─ fixtures.test.ts
   ├─ parser.test.ts
   └─ serializer.test.ts
```

## Implementation Order

1. Create TypeScript types from `04_AST_MODEL.md`.
2. Create diagnostic constants from `14_DIAGNOSTICS.md`.
3. Create fixture loader.
4. Make fixture loader validate JSON shape.
5. Implement serializer baseline.
6. Integrate remark/remark-gfm.
7. Implement protected region rules.
8. Implement wiki links and tags.
9. Implement highlights and tooltips.
10. Implement comments and footnotes.
11. Implement task states.
12. Implement block-level transclusions.
13. Implement callouts, toggles, and folded headings.
14. Implement block id post-processing.
15. Run all parser and serializer fixtures.

## First Fixtures to Target

Start with:

1. `fixtures/wiki-links/basic`
2. `fixtures/tags/basic`
3. `fixtures/highlights/basic`
4. `fixtures/comments/basic`
5. `fixtures/task-states/basic`

Then expand to block-level features.

## Quality Gate

Phase 1 is done when:

- all parser fixtures pass;
- all serializer fixtures pass;
- all diagnostics fixtures pass;
- protected region fixtures pass;
- `@nabla/markup` has no UI dependency.
