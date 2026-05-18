
# Implementation Decision Records

## Purpose

Defines how implementation decisions are recorded.

Language/product decisions belong in the spec pack.
Implementation decisions belong in implementation decision records.

## Storage

Implementation decision records live in:

```text
reports/decisions/
```

File name format:

```text
IDR-0001-short-title.md
```

## Template

```md
# IDR-0001 — Title

## Date

## Phase

## Status

Proposed / Accepted / Superseded / Rejected

## Context

## Decision

## Alternatives Considered

## Consequences

## Affected Files

## Human Approval Required?

## Links
```

## When Required

Create an IDR for:

- replacing a core dependency;
- changing package layout;
- changing fixture loader strategy;
- changing boundary check strategy;
- changing build tool;
- changing test runner;
- adding generated code.

## Human Approval

If the decision changes control-pack assumptions, human approval is required.
