
# Prompts for Implementation AI

## Prompt 1 — Start Markup Core

```text
You are implementing Nabla Markdown+ v0.

Read both attached ZIPs:
1. nabla_markdown_plus_spec_pack_v4_2_final.zip
2. nabla_implementation_control_pack_v4_1_2_opencode.zip

Your task is to implement Phase 1 only: @nabla/markup.

Before coding:
1. verify Git status;
2. create or switch to branch phase-1-markup-core;
3. verify the spec pack path;
4. produce an implementation plan.

Do not implement UI, workspace, editor, React, Milkdown, AI, MathLive, code execution, generic components, generic attributes, or kbd syntax.

Implement:
- AST types;
- diagnostic constants;
- fixture loader;
- parser skeleton;
- serializer skeleton;
- tests.

After coding:
- run relevant commands;
- commit coherent changes;
- produce progress report with commands, exit codes, latest commit, and git status.

Stop if behavior is missing or contradictory.
Do not modify specs or fixtures without human approval.
```

## Prompt 2 — Continue After Fixture Runner

```text
Continue Phase 1.

Before coding:
- run git status;
- confirm branch phase-1-markup-core;
- list fixtures targeted in this step.

Target fixtures in this order:
1. wiki-links/basic
2. tags/basic
3. highlights/basic
4. comments/basic
5. task-states/basic

After each fixture group:
- run tests;
- commit if passing;
- update progress report.

If a fixture contradicts a spec, stop and create MISSING_SPEC_REPORT.md.
Do not edit fixtures without human approval.
```

## Prompt 3 — Workspace

```text
Implement Phase 2: @nabla/workspace.

Before coding:
- verify @nabla/markup tests pass;
- create or switch to branch phase-2-workspace;
- read docs/08_WORKSPACE_MODEL.md and workspace fixtures.

Do not implement editor UI.
Do not implement React components.
Do not use editor state for workspace resolution.

Implement:
- path resolution;
- heading slugs;
- block id index;
- backlinks;
- transclusion resolver;
- cycle detection;
- depth limit.

Use workspace fixtures as executable contracts.

Run:
- pnpm test:workspace
- pnpm typecheck
- pnpm check:boundaries

Commit coherent changes and produce a progress report.
Stop on missing specs.
```

## Prompt 4 — Editor Adapter

```text
Implement Phase 3: @nabla/editor.

Before coding:
- run git status --short;
- verify @nabla/markup and @nabla/workspace tests pass;
- create or switch to branch phase-3-editor-adapter;
- read docs/07_EDITOR_BEHAVIOR.md and docs/02_ARCHITECTURE.md.

Use Milkdown/ProseMirror as adapter only.

Do not implement app shell.
Do not implement AI.
Do not implement MathLive.
Do not implement code execution.
Do not bypass @nabla/markup.

Save pipeline must be:
editor export → parser → serializer → saved source.

Implement source-preservation tests.
Implement or test NABLA_EDITOR_EXPORT_LOSS behavior.

Required commands:
- pnpm test
- pnpm typecheck
- pnpm lint
- pnpm build
- pnpm check:boundaries
- git status --short

After coding:
- commit coherent changes;
- produce reports/IMPLEMENTATION_PROGRESS.md;
- include command outputs and exit codes.

Stop on missing specs, failing gates, source preservation loss, or package-boundary violations.
```

## Prompt 5 — Components

```text
Implement Phase 4: @nabla/components.

Before coding:
- run git status --short;
- verify packages markup, workspace, and editor have passed their gates;
- create or switch to branch phase-4-components;
- read docs/07_EDITOR_BEHAVIOR.md and docs/15_REGISTRIES.md.

Do not implement app shell.
Do not define grammar in components.
Do not parse source strings in components except for display-only fallback.
Do not modify specs or fixtures without human approval.

Implement visual components only from semantic props.

Required commands:
- pnpm test
- pnpm typecheck
- pnpm lint
- pnpm build
- pnpm check:boundaries

After coding:
- commit coherent changes;
- run git status --short;
- produce reports/IMPLEMENTATION_PROGRESS.md using the template;
- include command outputs and exit codes.

Stop on missing specs or package-boundary violations.
```

## Prompt 6 — App Shell

```text
Implement Phase 5: @nabla/app.

Before coding:
- run git status --short;
- verify packages markup, workspace, editor, and components pass their gates;
- create or switch to branch phase-5-app;
- read implementation/08_PHASE_5_APP.md.

Implement minimal app shell only.

The app must save through parser + serializer.
The app must not introduce a persistence format other than Markdown-compatible plain text.

Do not add out-of-scope features.
Do not implement AI.
Do not implement MathLive.
Do not implement code execution.
Do not implement generic components.
Do not modify specs or fixtures without human approval.

Required commands:
- pnpm test
- pnpm typecheck
- pnpm lint
- pnpm build
- pnpm check:boundaries
- pnpm validate:fixtures
- pnpm validate:spec-version

After coding:
- commit coherent changes;
- run git status --short;
- produce reports/VALIDATION_REPORT.md;
- include command outputs and exit codes;
- list final phase readiness.

Stop on missing specs, failing gates, or source-of-truth violations.
```
