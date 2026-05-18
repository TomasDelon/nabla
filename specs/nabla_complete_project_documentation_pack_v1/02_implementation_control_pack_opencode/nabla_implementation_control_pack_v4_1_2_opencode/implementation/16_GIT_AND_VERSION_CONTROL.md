
# Git and Version Control

## Purpose

This document defines mandatory Git usage for Nabla implementation.

Git is not optional.

## Before Coding

The AI MUST run:

```bash
git status --short
git branch --show-current
```

If not inside a Git repository, the AI MUST run:

```bash
git init
git add .
git commit -m "chore: initialize Nabla implementation workspace"
```

If inside an existing Git repository with uncommitted changes, the AI MUST report them before modifying files.

## Branching

The AI MUST work on a named branch.

Recommended branches:

```text
phase-1-markup-core
phase-2-workspace
phase-3-editor-adapter
phase-4-components
phase-5-app
```

Create a branch with:

```bash
git checkout -b phase-1-markup-core
```

If the branch already exists, switch to it and report current status.

## Commit Policy

Commit after each coherent step.

Good commit examples:

```text
chore(markup): add package skeleton
feat(markup): add AST and diagnostics types
test(markup): add fixture runner tests
feat(markup): parse wiki links
fix(markup): preserve protected regions
```

Bad commit examples:

```text
update stuff
big changes
wip everything
```

## Required Commit Points

At minimum, commit after:

- repo initialization;
- package skeleton creation;
- AST types;
- diagnostics catalog;
- fixture runner;
- parser skeleton;
- serializer skeleton;
- each feature parser;
- each feature serializer;
- each phase handoff.

## Before Every Commit

Run available relevant checks.

When the commands exist, run at minimum:

```bash
pnpm typecheck
pnpm test
```

During early skeleton setup, if full checks cannot run yet, run the checks that exist and explain missing commands in the progress report.

## Before Phase Handoff

The AI MUST run:

```bash
git status --short
git log --oneline -5
```

The working tree MUST be clean before handoff unless the report explains every remaining file.

## Tags

After a phase is completed and validated, the AI MAY propose a tag:

```bash
git tag phase-1-markup-core-complete
```

Do not create release tags without human approval.

## Prohibited Git Actions

The AI MUST NOT:

- force push;
- rewrite history;
- delete branches;
- run destructive cleanup;
- discard user changes;
- commit secrets;
- add generated dependency folders like `node_modules`.

## .gitignore

The AI SHOULD create a `.gitignore` including:

```gitignore
node_modules/
dist/
coverage/
.env
.env.*
.DS_Store
```

Do not ignore specs unless the human explicitly asks.
