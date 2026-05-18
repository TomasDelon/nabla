
# OpenCode Model Routing

## Purpose

This file defines how OpenCode should coordinate multiple models for Nabla implementation.

OpenCode is the harness.
OpenCode is not the source of truth.

The source of truth remains:

1. Human instruction
2. Active task packet
3. Accepted implementation decisions
4. Current Git state
5. Test and validation reports
6. Nabla Markdown+ spec pack
7. Implementation control pack
8. Older summaries

If sources conflict, agents MUST stop and report.

## Required Model Verification

Exact model IDs MUST be verified inside OpenCode before use.

The human or supervisor MUST run:

```text
/models
```

The following conceptual routing is intended:

| Role | Preferred model class | Purpose |
|---|---|---|
| Supervisor / architect | GPT 5.4 or best available reasoning model | task planning, task packets, final arbitration |
| Builder | MiniMax M2.5 or best available implementation model | code implementation under task packet |
| Reviewer | DeepSeek V4 Pro or best available code review model | independent review/debugging |
| Context agent | efficient summarization model | compaction and handoff summaries |
| Final review | GPT 5.4 or best available reasoning model | phase approval/rejection |

If exact IDs differ, update the local OpenCode config after verifying `/models`.

## Agent Roles

### `nabla-supervisor`

Responsibilities:
- reads specs and control docs;
- creates task packets;
- assigns agents;
- verifies phase order;
- does not implement code directly unless explicitly asked.

Permissions:
- read: yes
- write: task packets and reports only
- code edits: no by default

### `nabla-builder`

Responsibilities:
- implements exactly one task packet;
- edits only allowed files;
- runs required commands;
- commits coherent changes;
- writes progress report.

Permissions:
- read: task packet, relevant specs, relevant fixtures, allowed source files
- write: allowed implementation files and reports
- specs/fixtures: no write without human approval

### `nabla-reviewer`

Responsibilities:
- reviews `git diff`;
- checks task packet compliance;
- checks spec compliance;
- checks tests and fixtures;
- returns PASS / FAIL / BLOCKED.

Permissions:
- read: yes
- write: review report only
- code edits: no

### `nabla-context`

Responsibilities:
- compacts context;
- writes handoff summaries;
- preserves active task state.

Permissions:
- read: reports, task packets, git log summaries
- write: handoff reports
- code edits: no

### `nabla-final-review`

Responsibilities:
- performs phase final review;
- checks acceptance criteria;
- approves or rejects phase handoff.

Permissions:
- read: yes
- write: final review report only
- code edits: no

## Permission Matrix

| Agent | Read specs | Edit code | Edit specs | Edit fixtures | Commit | Review |
|---|---|---|---|---|---|---|
| supervisor | yes | no | no | no | no | yes |
| builder | relevant only | allowed files only | no | no | yes | no |
| reviewer | yes | no | no | no | no | yes |
| context | reports only | no | no | no | no | no |
| final-review | yes | no | no | no | no | yes |

Spec or fixture changes require explicit human approval.

## Mandatory Implementation Loop

```text
task packet
→ builder implementation
→ tests
→ commit
→ reviewer report
→ fixes if needed
→ final task acceptance
→ handoff summary
```

## Git Discipline

Every task packet MUST specify:
- branch;
- allowed files;
- expected commit message;
- commands to run;
- clean working tree requirement.

No two write-capable agents may edit the same files concurrently.

## Forbidden Actions

Agents MUST NOT:
- implement the whole app from a vague prompt;
- bypass task packets;
- modify specs or fixtures without human approval;
- use reviewer as write-capable agent;
- run parallel builders on the same package;
- skip Git;
- skip tests;
- introduce out-of-scope features.

## Recommended OpenCode Config Shape

This is conceptual. Exact syntax and model IDs must be verified with OpenCode.

```json
{
  "instructions": [
    "AGENTS.md",
    "implementation/00_IMPLEMENTATION_INDEX.md",
    "implementation/17_OPENCODE_MODEL_ROUTING.md",
    "implementation/18_TASK_PACKET_PROTOCOL.md",
    "implementation/16_GIT_AND_VERSION_CONTROL.md"
  ],
  "agent": {
    "nabla-supervisor": {
      "mode": "primary",
      "model": "verified-supervisor-model",
      "prompt": "Create task packets, enforce phase order, and do not edit implementation code.",
      "permission": { "edit": "deny", "bash": "ask" }
    },
    "nabla-builder": {
      "mode": "primary",
      "model": "verified-builder-model",
      "prompt": "Implement only the active task packet. Edit only allowed files. Commit coherent changes.",
      "permission": { "edit": "ask", "bash": "ask" }
    },
    "nabla-reviewer": {
      "mode": "subagent",
      "model": "verified-reviewer-model",
      "prompt": "Review git diff against task packet, specs, fixtures, and quality gates. Do not edit code.",
      "permission": { "edit": "deny", "bash": "ask" }
    },
    "nabla-context": {
      "mode": "subagent",
      "model": "verified-context-model",
      "prompt": "Summarize context and write handoff reports only when allowed.",
      "permission": { "edit": "ask", "bash": "ask" }
    },
    "nabla-final-review": {
      "mode": "subagent",
      "model": "verified-final-review-model",
      "prompt": "Perform final phase review and approve, reject, or block. Do not edit code.",
      "permission": { "edit": "deny", "bash": "ask" }
    }
  }
}
```

## Stop Conditions

Stop if:
- model IDs cannot be verified;
- no task packet exists;
- multiple builders would edit same files;
- Git state is dirty and unexplained;
- task packet conflicts with spec;
- reviewer requests out-of-scope behavior.


## Supervisor Output Clarification

The supervisor may draft task packets and reports in chat.

If the supervisor needs to write files, it must use a controlled report-writing mode explicitly allowed by the human or by a task packet.

Default OpenCode config keeps supervisor file edits denied.
