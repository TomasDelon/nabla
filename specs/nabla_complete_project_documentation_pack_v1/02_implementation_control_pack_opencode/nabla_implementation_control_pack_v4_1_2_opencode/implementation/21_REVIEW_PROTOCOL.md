
# Review Protocol

## Purpose

Defines how independent reviewers inspect task output.

Reviewers are read-only.

## Reviewer Permissions

The reviewer MUST NOT edit code.
The reviewer MUST NOT edit specs.
The reviewer MUST NOT edit fixtures.
The reviewer writes only a review report.

## Required Inputs

- task packet;
- `git diff`;
- relevant specs;
- relevant fixtures;
- command outputs;
- progress report.

## Review Report Template

```md
# Review Report

## Verdict

PASS / FAIL / BLOCKED

## Task Packet Reviewed

## Diff Reviewed

## Task Packet Compliance

## Spec Compliance

## Fixture Compliance

## Tests Reviewed

## Scope Creep Check

## Source-of-Truth Check

## Dependency Boundary Check

## Git Check

## Required Fixes

## Optional Suggestions

## Final Decision
```

## Verdict Rules

PASS:
- task packet followed;
- tests pass;
- no forbidden files touched;
- no scope creep.

FAIL:
- implementation bug;
- missing test;
- boundary violation;
- task packet not fully satisfied.

BLOCKED:
- spec contradiction;
- fixture/spec conflict;
- missing behavior that requires human decision.

## Mandatory Checks

Reviewer MUST check:
- `git diff --stat`;
- files modified are allowed;
- specs were not modified unless approved;
- fixtures were not modified unless approved;
- required commands ran;
- latest commit exists;
- no out-of-scope behavior added.

## Out-of-Scope Suggestions

Reviewer MUST NOT request:
- AI features;
- MathLive;
- code execution;
- generic components;
- generic attributes;
- kbd syntax;
- sync/collaboration;
- advanced export.
