# Nabla Markdown+ Spec Pack v4.2 Final Manifest

Generated: 2026-05-18

## Purpose

This is the final cleanup patch after the v4.2 final audit.

## Applied Final Fixes

- Removed stale v4.1/v4 wording from specs.
- Removed diagnostic position from `fixtures/workspace/transclusion-cycle/diagnostics.json`.
- Added `fixtures/callouts/empty`.
- Changed block ID serializer preservation rules from SHOULD to MUST.
- Changed invalid combined wiki target behavior from SHOULD to MUST.
- Clarified frontmatter parser as YAML 1.2-compatible.
- Updated coverage matrix note for callout empty fixture.

## Counts

- Total files: 308
- Markdown files: 172
- JSON files: 136
- Parser fixture cases: 63
- Workspace fixture cases: 5
- JSON parse errors: 0

## Readiness

This pack is ready for full parser/serializer/workspace implementation.
