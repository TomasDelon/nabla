# IDR-0003 Phase Final Mega Audit

## Status

Accepted.

## Decision

After every major implementation phase, Nabla must undergo a full mega audit before the next phase starts.

The mega audit is stricter than per-task audit bundle review.

## Phase Gates

Major phases:

1. Phase 1 — `@nabla/markup`
2. Phase 2 — `@nabla/workspace`
3. Phase 3 — `@nabla/editor`
4. Phase 4 — `@nabla/components`
5. Phase 5 — `@nabla/app`

Do not start the next phase until the current phase receives a final audit verdict of:

- `PASS`, or
- explicitly approved `PASS WITH MINOR FIXES`.

## Required Artifact

At phase end, create a full repository ZIP with `.git` included.

Exclude heavy/generated directories:

- `node_modules/`
- `dist/`
- `coverage/`

Recommended command pattern:

```bash
cd ~/Desktop

rm -rf nabla-phase-audit
git clone --branch <PHASE_BRANCH> --single-branch https://github.com/TomasDelon/nabla.git nabla-phase-audit

zip -r nabla-phase-<N>-full-audit-with-git.zip nabla-phase-audit \\
  -x "nabla-phase-audit/node_modules/*" \\
  -x "nabla-phase-audit/dist/*" \\
  -x "nabla-phase-audit/coverage/*"
```

## Mega Audit Scope

The phase-final mega audit must check:

- Git history;
- task sequence;
- implementation commits;
- audit bundle commits;
- `reports/audit/latest/` behavior;
- `reports/IMPLEMENTATION_PROGRESS.md`;
- `reports/decisions/**`;
- specs and fixtures untouched;
- package boundaries;
- test coverage;
- fixture coverage;
- parser/serializer/workspace/editor correctness depending on phase;
- architecture consistency;
- scope creep;
- unresolved blockers;
- missing spec reports;
- technical debt created during the phase.

## Required Commands Before Audit

Before creating the phase-final ZIP, run:

```bash
pnpm test
pnpm test:markup
pnpm typecheck
pnpm build
pnpm validate:fixtures
pnpm validate:spec-version
pnpm check:boundaries
pnpm lint
git status --short
```

Phase-specific commands may be added as packages appear.

## Verdicts

Possible final audit verdicts:

- `PASS` — advance to next phase.
- `PASS WITH MINOR FIXES` — fix listed issues, then advance if approved.
- `FAIL` — do not advance; fix blockers.
- `BLOCKED` — do not advance; a human/spec decision is required.

## Rationale

Per-task review prevents local errors.

Phase-final mega audit prevents accumulated drift.

Both are required.
