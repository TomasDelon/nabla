
# Phase 2 — @nabla/workspace

## Goal

Implement workspace indexing and resolution.

## Scope

This phase includes:

- file index;
- heading index;
- block id index;
- tag index;
- backlink index;
- transclusion resolver;
- cycle detection;
- depth limit;
- workspace diagnostics.

This phase excludes:

- editor rendering;
- inline transclusion editing;
- UI panels.

## Files to Create

```text
packages/workspace/
├─ package.json
├─ src/
│  ├─ workspace.ts
│  ├─ file-index.ts
│  ├─ heading-index.ts
│  ├─ block-index.ts
│  ├─ backlink-index.ts
│  ├─ transclusion-resolver.ts
│  ├─ slug.ts
│  ├─ path-resolution.ts
│  └─ index.ts
└─ tests/
   ├─ workspace-fixtures.test.ts
   ├─ path-resolution.test.ts
   ├─ heading-slugs.test.ts
   └─ transclusions.test.ts
```

## Required Specs

Read:

- `08_WORKSPACE_MODEL.md`
- `docs/features/wiki-links.md`
- `docs/features/transclusions.md`
- `docs/features/block-ids.md`
- `14_DIAGNOSTICS.md`
- workspace fixtures

## Implementation Order

1. Implement path normalization.
2. Implement file target matching.
3. Implement heading slug algorithm.
4. Implement block id extraction from parsed AST.
5. Implement backlinks.
6. Implement transclusion resolution.
7. Implement cycle detection.
8. Implement depth limit.
9. Run workspace fixtures.

## Quality Gate

Phase 2 is done when:

- workspace fixtures pass;
- missing targets produce official diagnostics;
- duplicate block ids are detected;
- transclusion cycles are detected;
- depth limit is enforced.
