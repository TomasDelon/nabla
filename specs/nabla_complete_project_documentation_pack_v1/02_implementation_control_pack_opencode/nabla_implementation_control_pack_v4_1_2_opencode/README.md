
# Nabla Implementation Control Pack v4.1.2 OpenCode

Generated: 2026-05-18

## Purpose

This ZIP is the implementation control pack for Nabla.

It MUST be used together with:

`nabla_markdown_plus_spec_pack_v4_2_final.zip`

The spec pack defines what Nabla Markdown+ v0 is.
This pack defines how an implementation AI must build it safely.

## v4.1.2 OpenCode Changes

v4.1.2 applies the audit recommendations and adds mandatory Git/version-control rules.

Main changes:
- Git is mandatory.
- The AI must initialize or verify a Git repository before coding.
- Every meaningful change must be committed.
- The working tree must be clean before phase handoff.
- Spec/fixture changes require explicit human approval.
- Fixture paths are now exact.
- Components and app are split into separate phases.
- Quality gates use MUST instead of SHOULD.
- Boundary checks are required.
- Prompts 2–4 are stricter.
- `VALIDATION_REPORT.md` template is defined.
- Spec-pack version validation is required.

## Required Input

The implementation AI must receive:

1. `nabla_markdown_plus_spec_pack_v4_2_final.zip`
2. `nabla_implementation_control_pack_v4_1_2_opencode.zip`
3. a Git repository, or permission to initialize one
4. permission to install dependencies
5. package manager, default `pnpm`

## Implementation Order

1. `@nabla/markup`
2. `@nabla/workspace`
3. `@nabla/editor`
4. `@nabla/components`
5. `@nabla/app`

## Git Rule

No implementation work may begin until Git is initialized and the current state is committed or explicitly documented as the initial uncommitted state.

Recommended first commands:

```bash
git status
git init
git add .
git commit -m "chore: initialize Nabla implementation workspace"
```

If a Git repository already exists, the AI must run:

```bash
git status --short
git branch --show-current
```

and report the result before modifying files.

## Files in This Pack

| File | Purpose |
|---|---|
| AGENTS.md | Global rules for coding agents. |
| implementation/00_IMPLEMENTATION_INDEX.md | Entry point for the implementation AI. |
| implementation/01_AGENT_OPERATING_RULES.md | Non-negotiable agent rules. |
| implementation/02_TECH_STACK.md | Tools and dependencies. |
| implementation/03_REPO_STRUCTURE.md | Monorepo layout and fixture paths. |
| implementation/04_PHASE_1_MARKUP_CORE.md | Implement @nabla/markup. |
| implementation/05_PHASE_2_WORKSPACE.md | Implement @nabla/workspace. |
| implementation/06_PHASE_3_EDITOR_ADAPTER.md | Implement @nabla/editor. |
| implementation/07_PHASE_4_COMPONENTS.md | Implement @nabla/components. |
| implementation/08_PHASE_5_APP.md | Implement @nabla/app. |
| implementation/09_FIXTURE_DRIVEN_WORKFLOW.md | Fixture workflow. |
| implementation/10_TESTING_AND_QUALITY_GATES.md | Executable quality gates. |
| implementation/11_MISSING_SPEC_PROTOCOL.md | Missing spec protocol. |
| implementation/12_PROGRESS_REPORT_TEMPLATE.md | Progress and validation templates. |
| implementation/13_PROMPTS_FOR_IMPLEMENTATION_AI.md | Ready-to-use prompts. |
| implementation/14_RISK_REGISTER.md | Known risks. |
| implementation/15_HANDOFF_CHECKLIST.md | Phase handoff checklist. |
| implementation/16_GIT_AND_VERSION_CONTROL.md | Mandatory Git workflow. |


## v4.1 Patch Summary

- Stale v3 control-pack references fixed.
- OpenCode config skeleton uses singular `agent`.
- Required OpenCode files are exact filenames in metadata.
- Phase 3, 4, and 5 quality gates list exact commands.
- Prompt 4 now requires exact commands, exit-code reporting, Git status, and stop conditions.
- Handoff checks before Phase 4 and Phase 5 are stricter.


## v4.1.2 Tiny Final Patch

This patch applies the final audit recommendations:

- removes the embedded self-referential ZIP hash from `implementation_pack.json`;
- defines ZIP artifact hashing as external sidecar metadata;
- clarifies quality-gate manifest hash validation;
- fixes stale README wording.

## v4.1.2 Final Naming Cleanup

This patch applies the final naming/count cleanup:

- replaces previous `v4_1` and `v4_1_1` control-pack paths with `v4_1_2`;
- updates README counts;
- cleans duplicated spec-version validation wording;
- clarifies that the SHA-256 sidecar is external and not inside the ZIP;
- clarifies supervisor write behavior in OpenCode.

## Final Counts

- Markdown files: 40
- JSON files: 1
- Total files: 41
