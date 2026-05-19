# Implementation Progress Report

## Phase

Phase 1 - `@nabla/markup`

## Task ID

`P1-021 transclusions`

## Branch

`phase-1-markup-core`

## Status

Transclusion parsing and serialization implemented against checked-in fixture contracts (P1-021).

All 5 transclusion fixture groups pass:
- `transclusions/note` — `![[Analyse]]` canonical transclusion
- `transclusions/heading` — `![[Analyse#Limits]]` heading transclusion
- `transclusions/block-canonical` — `![[Analyse^thm-main]]` canonical block ID transclusion
- `transclusions/block-compatible` — `![[Analyse#^thm-main]]` compatible block ID transclusion serialized to canonical
- `transclusions/inline-unsupported` — inline `![[Analyse]]` remains text with diagnostic

Block ID attachment for transclusions verified via `block-ids/callout-toggle-transclusion-attachment`.

All existing wiki-links/tags/highlights/comments/task-states/frontmatter/code/footnotes/callouts/toggles/folded-headings/block-ids fixtures remain passing.

## Scope Guardrails

- No workspace/editor/components/app
- No workspace-level file resolution
- No actual embedded rendering
- No cycle detection
- No table parsing
- No spec changes
- No fixture changes

## Files Created

- `packages/markup/src/extensions/transclusions.ts`

## Files Modified

- `packages/markup/src/parser.ts` — transclusion block detection in parseBlocks, inline transclusion diagnostic in parseParagraphChildren, AST construction for transclusion blocks
- `packages/markup/src/serializer.ts` — transclusion serialization with block ID appending
- `packages/markup/src/extensions/block-ids.ts` — transclusion added to ATTACHABLE_KINDS, getBlockText, setBlockText; stripInlineBrackets fixed to use \0 instead of space to prevent space-run merging
- `packages/markup/src/index.ts` — exported parseTransclusionLine and serializeTransclusion
- `packages/markup/tests/wiki-links.test.mjs` — 5 transclusion fixture IDs and block-ids/callout-toggle-transclusion-attachment fixture ID, inline transclusion diagnostic expectation
- `packages/markup/tests/parser.test.mjs` — updated paragraph test that parse ![[note]] as transclusion
- `reports/IMPLEMENTATION_PROGRESS.md` — this update

## Verification Summary

- `node --test packages/markup/tests/**/*.test.mjs` — 65 tests pass
- `tsc -b --pretty false packages/markup/tsconfig.json` — typecheck passed
- `tsc -b packages/markup/tsconfig.json` — build passed
- `node scripts/validate-fixtures.mjs` — fixture validation passed
- `node scripts/validate-spec-version.mjs` — spec version validation passed
- `node scripts/check-boundaries.mjs` — boundary check passed
- `node scripts/report-unavailable.mjs lint` — lint unavailable (bootstrap placeholder)

## Active Blockers

None.

## Next Recommended Task

P1-022 emoji shortcodes
