# IDR-0001 Audit Bundle Workflow

## Status

Accepted.

## Decision

Use a text-only, git-derived audit bundle under `reports/audit/latest/` for external review.

Every implementation task must produce two separate commits:

1. The implementation commit.
2. The audit bundle commit.

The audit bundle must be generated from an explicit, closed commit range:

```bash
pnpm audit:bundle -- --task <TASK_ID> --base <BASE_COMMIT> --head <IMPLEMENTATION_COMMIT>
```

`--head` is mandatory.

Implicit `HEAD` is not allowed for task review bundles.

## Context

Nabla is implemented incrementally by task. Completed tasks need review artifacts that can be inspected from GitHub or from a ZIP without manually copying logs into chat.

Earlier workflow versions allowed audit generation with only `--base`, which made the bundle depend on the current branch `HEAD`. That caused contamination when later commits were already present in the history.

## Rules

### Required

- Use explicit `--base`.
- Use explicit `--head`.
- Keep the audit bundle commit separate from the implementation commit.
- Store text-only review artifacts under `reports/audit/latest/`.
- Include the reviewed base/head range in `AUDIT_INDEX.md`.
- Include the reviewed base/head range in `audit.json`.
- Include `git diff --name-only <base>..<head>`.
- Include `git diff <base>..<head>`.
- Record the current working tree status separately from the reviewed range.

### Forbidden

- Do not use implicit `HEAD`.
- Do not audit by branch name.
- Do not treat branch raw URLs as source of truth.
- Do not edit `reports/audit/latest/**` manually.
- Do not include binary ZIP snapshots in the normal per-task audit bundle.
- Do not mix implementation and audit commits.

## Review Source of Truth

For each task review, use:

- the audit bundle commit hash;
- `reports/audit/latest/audit.json` at that commit;
- `reports/audit/latest/git-show-name-only.txt` at that commit;
- `reports/audit/latest/git-show.patch` at that commit;
- the implementation commit referenced as `headCommit` in `audit.json`.

Branch names are not stable review anchors.

Commit hashes are stable review anchors.

## If GitHub and Local State Disagree

If GitHub raw files, agent reports, and local state contradict each other:

1. Stop the task flow.
2. Generate or clone a fresh local repository state.
3. Create a full ZIP including `.git`.
4. Exclude heavy generated folders:
   - `node_modules/`
   - `dist/`
   - `coverage/`
5. Use the ZIP with `.git` as the final inspection artifact.

## Rationale

This workflow:

- keeps review artifacts lightweight;
- prevents branch/HEAD contamination;
- makes external review reproducible;
- lets a reviewer inspect exact diffs without cloning when GitHub access works;
- keeps ZIP-based full audit available for contradictions and phase-final reviews.

## Consequences

- Every task costs one extra audit commit.
- The latest audit bundle is overwritten by each new task.
- Historical audit bundles are still recoverable from their audit bundle commits.
- Agents must report both the implementation commit and the audit bundle commit.
