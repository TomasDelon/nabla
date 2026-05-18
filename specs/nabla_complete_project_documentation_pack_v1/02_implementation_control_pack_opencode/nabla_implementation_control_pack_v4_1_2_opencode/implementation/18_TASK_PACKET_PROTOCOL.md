
# Task Packet Protocol

## Purpose

Task packets are the unit of controlled implementation.

A task packet gives a builder exactly enough context to implement one coherent task without guessing.

## Core Rule

One task packet = one coherent implementation unit.

Task packets MUST be small.
Task packets MUST be phase-bound.
Task packets MUST list exact allowed files.
Task packets MUST list exact source specs and fixtures.
Task packets MUST include stop conditions.

## Mandatory Structure

Every task packet MUST contain:

```md
# Task Packet — <TASK_ID>

## Phase

## Objective

## Scope

## Out of Scope

## Source of Truth

## Files Allowed to Read

## Files Allowed to Modify

## Files Forbidden to Modify

## Fixtures Required

## Commands Required

## Acceptance Criteria

## Stop Conditions

## Required Report

## Reviewer Checklist

## Commit Requirement
```

## Required Fields

### Task ID

Format:

```text
P<phase>-<number>-<slug>
```

Examples:

```text
P1-001-repo-bootstrap
P1-010-wiki-link-parser
P2-004-block-id-index
```

### Source of Truth

Must include exact file paths, for example:

```text
specs/nabla_markdown_plus_spec_pack_v4_2_final/docs/04_AST_MODEL.md
specs/nabla_markdown_plus_spec_pack_v4_2_final/docs/features/wiki-links.md
```

### Files Allowed to Modify

Must be explicit.

Example:

```text
packages/markup/src/extensions/wiki-links.ts
packages/markup/tests/wiki-links.test.ts
reports/IMPLEMENTATION_PROGRESS.md
```

### Files Forbidden to Modify

Must include at least:

```text
specs/
fixtures/
implementation/
AGENTS.md
```

unless the task explicitly has human approval to modify docs.

## Stop Conditions

The builder MUST stop if:
- a source file outside allowed list must be edited;
- a spec is unclear;
- a fixture contradicts a spec;
- a test cannot be written without guessing;
- a dependency change would alter the architecture;
- Git state is unsafe;
- the task would implement out-of-scope behavior.

## Commit Requirement

Each task packet MUST define the expected commit message.

Example:

```text
feat(markup): parse wiki link fixtures
```

## Reviewer Checklist

Every task packet MUST include review questions:
- Did builder edit only allowed files?
- Did builder run required commands?
- Did builder preserve source-of-truth rules?
- Did builder avoid scope creep?
- Did builder commit coherent changes?

## Human Approval Rule

Task packets MUST NOT authorize spec or fixture changes unless the human explicitly approved them before task creation.
