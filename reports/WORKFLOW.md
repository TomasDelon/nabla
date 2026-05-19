# Nabla Operational Workflow

## Current State

Current implementation phase:

```text
Phase 1 — @nabla/markup
```

Current branch:

```text
phase-1-markup-core
```

The current work mode is:

```text
single writer
external review
audit bundle by exact commit range
```

## Source of Truth

The frozen specs and fixtures under `specs/` are the implementation contract.

Do not modify:

- `specs/**`;
- checked-in fixture files;
- generated audit bundle files by hand.

If implementation behavior conflicts with the spec or fixtures, stop and report the conflict.

## Per-Task Workflow

Each task follows this sequence:

1. Read only the relevant spec files.
2. Implement only the active task.
3. Run required checks.
4. Commit implementation.
5. Generate audit bundle with explicit `--base` and `--head`.
6. Commit audit bundle separately.
7. Push.
8. External reviewer audits by commit-specific bundle.

Required audit command:

```bash
pnpm audit:bundle -- --task <TASK_ID> --base <BASE_COMMIT> --head <IMPLEMENTATION_COMMIT>
```

Do not use implicit `HEAD`.

## Required Report Format

After every task, report only:

```text
Task:
Model:
Implementation commit:
Audit bundle commit:
Base:
Head:
Changed files:
Commands all passed: yes/no
Git status:
Next recommended task:
```

If there was a failure, include:

```text
Failing command:
Exit code:
Relevant error:
Files touched:
Recommendation:
```

## Context Compaction Rules

Compact or restart the coding session when:

- context is above roughly 60%;
- a large task just finished;
- the model changed;
- reports/logs are polluting context;
- there was a confusing bug and the next action is cleanly defined.

Do not compact or restart when:

- there are uncommitted changes;
- a command is running;
- the model is in the middle of editing;
- failing logs are needed and not yet captured.

Before compacting or restarting, ensure:

```bash
git status --short
```

is clean, or explicitly preserve the dirty state in a handoff report.

## Anti-Contamination Protocol

Always audit by commit hash.

Never audit by branch as source of truth.

Use:

- implementation commit;
- audit bundle commit;
- explicit base/head;
- `audit.json`;
- `git-show.patch`;
- `git-show-name-only.txt`.

Do not trust:

- moving branch raw URLs as final proof;
- model summaries without an audit bundle;
- UI modified-file sidebars as a commit diff;
- implicit `HEAD` ranges.

If GitHub, local files, and model reports disagree:

1. Stop.
2. Do not continue to the next task.
3. Create a ZIP with `.git`.
4. Audit the ZIP as the final source.

## Model Routing

Current available builder:

```text
DeepSeek V4 Flash Free
```

Current review:

```text
External review from GitHub/MCP audit bundle.
```

Use GPT only when available and necessary for:

- architecture-critical decisions;
- parser/AST/source-of-truth bugs;
- repeated failures after cheaper models;
- phase-final review.

Do not mention quota/model strategy inside task prompts unless it affects the implementation tool directly.

## Parallel Agents

Current level:

```text
Level 1 — one writer only.
```

Allowed now:

- one builder that edits files;
- external reviewer;
- optional read-only diagnostic/context agent.

Not allowed yet:

- multiple builders writing in parallel;
- two agents touching `parser.ts` at the same time;
- two agents touching `serializer.ts` at the same time;
- simultaneous audit bundle generation.

Level 2 parallel builders become allowed only when tasks have:

- separate branches;
- exclusive allowed files;
- no shared `parser.ts` or `serializer.ts` edits;
- no shared `reports/audit/latest/` edits;
- clear merge plan;
- low conflict risk.

The next major reevaluation point is after the core parser features are stable.

## Phase-Final Workflow

After each major phase:

1. Finish all phase tasks.
2. Run all quality gates.
3. Generate a final audit bundle.
4. Push everything.
5. Create a full ZIP with `.git`.
6. Run external mega audit.
7. Advance only after `PASS` or approved `PASS WITH MINOR FIXES`.

## Future Architecture Notes

Nabla may later support AI responses streamed as Nabla MarkUp.

That is documented as a future architecture constraint, not current scope.

Do not implement streaming AI, streaming parser, or partial AST during current Phase 1 unless explicitly authorized in a later task.
