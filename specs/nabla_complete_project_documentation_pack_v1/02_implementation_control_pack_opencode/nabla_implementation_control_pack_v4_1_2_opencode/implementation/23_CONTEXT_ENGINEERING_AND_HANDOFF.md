
# Context Engineering and Handoff

## Purpose

Controls context size and handoff quality in long OpenCode sessions.

## Principle

Do not paste the full spec pack into every prompt.

Use compact task packets with exact references.

## What Must Stay in Context

Always preserve:

- current phase;
- current task ID;
- active branch;
- latest commit;
- task objective;
- allowed files;
- forbidden files;
- relevant spec files;
- relevant fixture folders;
- latest failing test;
- missing spec status;
- stop conditions.

## What Can Be Omitted

Omit:
- unrelated feature specs;
- old completed task details;
- full fixture contents unless directly needed;
- long logs after summarizing command, exit code, and failure message.

## Handoff Summary Template

```md
# Handoff Summary

## Current Phase

## Current Task

## Branch

## Latest Commit

## Files Changed

## Tests Passing

## Tests Failing

## Active Blockers

## Missing Spec Reports

## Decisions Pending

## Next Task Packet

## Context to Preserve
```

## Compaction Rule

Before context becomes too large, the context agent MUST write or update:

```text
reports/HANDOFF_SUMMARY.md
```

The next task must start from the handoff summary plus active task packet.

## Forbidden

- Do not remove stop conditions from context.
- Do not remove forbidden scope from context.
- Do not summarize away failing tests.
- Do not replace specs with memory summaries.
