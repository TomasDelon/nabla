
# Final Phase Review Protocol

## Purpose

Defines how to approve or reject a full phase.

Final review happens after all tasks in a phase are complete.

## Final Reviewer Permissions

Final reviewer is read-only.
Final reviewer writes a final review report.

## Required Inputs

- phase backlog;
- all task packets;
- all progress reports;
- all review reports;
- validation report;
- Git log;
- current Git status;
- quality gate command outputs.

## Final Review Template

```md
# Phase Final Review

## Phase

## Branch

## Commits Reviewed

## Specs Used

## Fixtures Used

## Commands Run

## Boundary Checks

## Scope Creep Audit

## Source-of-Truth Audit

## Git Audit

## Open Risks

## Required Fixes

## Verdict

APPROVED / REJECTED / BLOCKED
```

## Verdict Rules

APPROVED:
- all phase acceptance criteria pass;
- Git tree clean;
- required reports exist;
- no scope creep;
- boundary checks pass.

REJECTED:
- implementation incomplete;
- tests failing;
- reports missing;
- package boundaries violated.

BLOCKED:
- missing spec or contradiction prevents phase completion.

## Merge Rule

Do not merge phase branch to main until final review is APPROVED.
