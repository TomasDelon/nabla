
# Testing and Fixtures

## Fixture Schema

Every parser fixture MUST contain:
- `input.md`;
- `ast.json`;
- `output.md`;
- `diagnostics.json`.

`ast.json` MUST use the real `NablaDocument` shape from `04_AST_MODEL.md`.

`diagnostics.json` MUST contain official diagnostic objects.

## Diagnostic Snapshot Policy

In v0 fixtures, diagnostic `position` is optional.

If a fixture includes `position`, tests MUST compare it exactly.

If a fixture omits `position`, tests MUST compare only:
- severity;
- code;
- message.

Position-specific diagnostics MUST live in fixtures named `*-position`.

This avoids blocking early parser work on column offsets while still preserving a path to exact position tests.

## Workspace Fixture Schema

Workspace fixtures MUST contain:
- `files/`;
- `expected-index.json`;
- `diagnostics.json`.

Workspace fixtures MUST use real source files.

## Required Test Types

| Test | Requirement |
|---|---|
| parse | compare parser output to `ast.json` |
| serialize | compare serializer output to `output.md` |
| roundtrip | input parses and serializes |
| diagnostics | compare diagnostics according to snapshot policy |
| workspace | compare workspace index to expected index |

## Fixture Coverage Policy

Feature specs may list eventual fixture requirements.

`16_SPEC_COVERAGE_MATRIX.md` is the current source of truth for whether fixture coverage is complete, partial, missing, or blocked.

Before full implementation, every required feature MUST reach at least PARTIAL fixture coverage.

Before stability, every required feature MUST reach OK fixture coverage.
