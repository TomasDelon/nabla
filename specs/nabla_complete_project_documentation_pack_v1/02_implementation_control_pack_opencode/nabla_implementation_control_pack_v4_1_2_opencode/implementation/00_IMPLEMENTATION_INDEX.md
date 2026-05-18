
# Implementation Index

## Purpose

This document tells an implementation AI how to build Nabla step by step.

This pack is not a replacement for the spec pack.
The spec pack defines product behavior.
This pack defines implementation order, repo structure, Git workflow, quality gates, and handoff rules.

## Required Input

The implementation AI must receive:

1. `nabla_markdown_plus_spec_pack_v4_2_final.zip`
2. `nabla_implementation_control_pack_v4_1_2_opencode.zip`
3. a Git repository, or permission to initialize one
4. package manager, default `pnpm` unless the user explicitly overrides it

## Spec-Pack Validation Before Coding

Before coding, the AI MUST verify:

- the spec pack exists at `specs/nabla_markdown_plus_spec_pack_v4_2_final/`;
- the implementation pack exists at `specs/nabla_implementation_control_pack_v4_1_2_opencode/`;
- the spec pack contains `MANIFEST.md`;
- the spec pack contains `docs/16_SPEC_COVERAGE_MATRIX.md`;
- the spec pack contains `fixtures/`.

If any item is missing, stop and report.

## Git Validation Before Coding

Before coding, the AI MUST run:

```bash
git status --short
git branch --show-current
```

If the directory is not a Git repository, initialize it and make an initial commit.

## Default Assumptions

- language: TypeScript
- package manager: pnpm
- test runner: Vitest
- parser ecosystem: unified / remark / remark-gfm
- editor base later: Milkdown / Crepe
- app framework later: React

## Implementation Phases

| Phase | Package | Goal |
|---|---|---|
| 1 | `@nabla/markup` | AST, diagnostics, parser, serializer, fixture runner |
| 2 | `@nabla/workspace` | indexes, resolution, backlinks, transclusions |
| 3 | `@nabla/editor` | Milkdown/ProseMirror adapter |
| 4 | `@nabla/components` | React visual components |
| 5 | `@nabla/app` | minimal app shell |

## Golden Rule

No phase may depend on behavior that is not specified.

If a required behavior is missing, stop and write a missing spec report.


## OpenCode Required Files

For multi-agent OpenCode execution, read additionally:

- `implementation/17_OPENCODE_MODEL_ROUTING.md`
- `implementation/18_TASK_PACKET_PROTOCOL.md`
- `implementation/19_TASK_PACKET_TEMPLATE.md`
- `implementation/20_PHASE_1_TASK_BACKLOG.md`
- `implementation/21_REVIEW_PROTOCOL.md`
- `implementation/22_FINAL_REVIEW_PROTOCOL.md`
- `implementation/23_CONTEXT_ENGINEERING_AND_HANDOFF.md`
- `implementation/24_DECISION_RECORDS.md`
- `implementation/25_SPEC_SYNC_AND_HASH_POLICY.md`
- `implementation/26_BOUNDARY_CHECK_POLICY.md`
- `implementation/27_PHASE_ACCEPTANCE_CRITERIA.md`
- `implementation/28_OPENCODE_CONFIG_GUIDE.md`
- `implementation/29_PARALLELISM_POLICY.md`
- `implementation/30_PHASE_2_TASK_BACKLOG.md`
- `implementation/31_PHASE_3_TASK_BACKLOG.md`
- `implementation/32_PHASE_4_TASK_BACKLOG.md`
- `implementation/33_PHASE_5_TASK_BACKLOG.md`
