
# Agent Operating Rules

## Role

The implementation AI is a coding agent, not a product designer.

It translates specs into code.

## Must Do

- Read relevant specs before coding.
- Use fixtures as executable contracts.
- Use Git.
- Work on a named branch.
- Commit after each coherent step.
- Keep `@nabla/markup` independent from UI.
- Add tests before or alongside implementation.
- Run tests after each step.
- Report exact command results and exit codes.
- Stop when behavior is missing.

## Must Not Do

- Must not invent syntax.
- Must not add new features.
- Must not change the spec silently.
- Must not modify fixtures without human approval.
- Must not skip tests.
- Must not hardcode configurable callout types.
- Must not parse Nabla syntax inside protected regions.
- Must not implement out-of-scope features.
- Must not leave the working tree dirty at phase handoff.

## Stop Conditions

Stop and report if:

- a spec is contradictory;
- a fixture contradicts a spec;
- a required behavior is not specified;
- a dependency cannot support a required behavior;
- a test cannot be written without guessing;
- source preservation is impossible with the current editor strategy;
- Git state is unsafe or unclear.

## Reporting Rule

Every implementation step must end with a report containing:

- files changed;
- tests added;
- commands run;
- exit codes;
- tests passing;
- tests failing;
- Git branch;
- latest commit hash;
- working tree state;
- specs used;
- open questions;
- next recommended task.
