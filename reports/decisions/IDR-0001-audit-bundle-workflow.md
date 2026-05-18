# IDR-0001 Audit Bundle Workflow

## Decision

Use a text-only, git-derived audit bundle under `reports/audit/latest/` for external review.

## Context

Completed tasks need a review artifact that can be inspected directly from GitHub without uploading ZIP files or binaries.

## Workflow

- Run `pnpm audit:bundle -- --task <TASK_ID> --base <BASE_COMMIT>`.
- The script writes only text artifacts to `reports/audit/latest/`.
- `AUDIT_INDEX.md` explains the review order.
- `audit.json` records task metadata, git state, commands, and raw URLs when the remote is GitHub.

## Rationale

- Keeps review artifacts simple and auditable.
- Avoids binary snapshots for now.
- Uses the repository history as the source of truth.

## Consequences

- External reviewers can inspect the bundle from GitHub directly.
- The workflow stays lightweight and operational.
