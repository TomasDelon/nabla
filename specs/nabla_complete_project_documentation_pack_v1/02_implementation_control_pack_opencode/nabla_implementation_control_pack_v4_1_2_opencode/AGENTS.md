
# AGENTS.md — Nabla Implementation Rules

## Project

You are implementing Nabla Markdown+ v0.

You MUST use the accompanying specification pack as the source of truth:

`nabla_markdown_plus_spec_pack_v4_2_final.zip`

## Non-Negotiable Rules

- Do not invent behavior.
- Do not implement features outside v0.
- Do not implement kbd syntax.
- Do not implement generic components in v0.
- Do not implement generic attributes in v0.
- Do not implement MathLive in v0.
- Do not implement code execution in v0.
- Do not implement AI features in v0.
- Do not store HTML as document source.
- Do not store hidden JSON as document source.
- Do not make the editor the source of truth.
- Plain text is the source of truth.

## Mandatory Git Rules

Git is mandatory.

Before modifying files, you MUST:

1. verify whether the repo is already a Git repo;
2. run `git status --short`;
3. report the current branch and working tree state;
4. create an initial commit if the project is not yet committed.

During implementation, you MUST:

- work on a named branch;
- commit after each coherent implementation step;
- keep commits small and understandable;
- include tests/spec references in commit messages when useful;
- never leave unrelated changes mixed together;
- never rewrite history unless the human explicitly asks;
- never force-push unless the human explicitly asks.

Before phase handoff, you MUST:

- run required tests;
- run `git status --short`;
- ensure the working tree is clean, or explain every remaining change.

## Required Workflow

1. Read the relevant spec.
2. Read the relevant fixtures.
3. Create or confirm Git branch.
4. Implement the smallest testable unit.
5. Run tests.
6. Commit.
7. Report status.
8. Stop if behavior is not specified.

## Spec and Fixture Change Rule

Do not modify the spec pack or fixtures unless the human explicitly approves.

If a spec or fixture seems wrong, create `reports/MISSING_SPEC_REPORT.md` and stop.

## Missing Specification Rule

If behavior is missing or contradictory:

1. Do not guess.
2. Create `reports/MISSING_SPEC_REPORT.md`.
3. Explain the missing behavior.
4. List affected files.
5. Propose options.
6. Wait for human approval.

## First Implementation Target

The first target is `@nabla/markup`.

Do not start UI work before `@nabla/markup` parser and serializer pass the fixture suite.


## Task Packet Rule

When using OpenCode, builders MUST implement from an active task packet.

No builder may start from a vague instruction like "implement Nabla".

The active task packet overrides general summaries but cannot override the spec pack or human instruction.
