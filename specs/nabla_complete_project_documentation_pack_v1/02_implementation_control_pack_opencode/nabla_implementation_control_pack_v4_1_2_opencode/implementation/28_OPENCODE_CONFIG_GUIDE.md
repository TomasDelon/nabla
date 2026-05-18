
# OpenCode Config Guide

## Purpose

Guides safe OpenCode configuration for Nabla.

## Required Checks

Before configuring models, run:

```text
/models
```

Verify available model IDs.

Conceptual targets:
- GPT 5.4 or best reasoning model for supervisor/final review;
- MiniMax M2.5 or best builder model for implementation;
- DeepSeek V4 Pro or best reviewer/debugger model for review.

Do not invent exact provider IDs.
Use verified IDs from `/models`.

## Required Instructions

OpenCode instructions SHOULD include:

```text
AGENTS.md
implementation/00_IMPLEMENTATION_INDEX.md
implementation/17_OPENCODE_MODEL_ROUTING.md
implementation/18_TASK_PACKET_PROTOCOL.md
implementation/16_GIT_AND_VERSION_CONTROL.md
```

## Permissions

Recommended:

| Agent | Edit Permission |
|---|---|
| supervisor | deny |
| builder | ask |
| reviewer | deny |
| context | deny |
| final-review | deny |

## Safety Rules

- No parallel write-capable agents on same files.
- No reviewer edits.
- No final-review edits.
- No builder outside task packet.
- No bypassing Git.
- No “implement everything” prompt.

## Config Skeleton

Exact syntax may differ by OpenCode version.

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
      "model": "verified-reasoning-model",
      "prompt": "Plan tasks and enforce source-of-truth hierarchy. Do not edit implementation code.",
      "permission": { "edit": "deny", "bash": "ask" }
    },
    "nabla-builder": {
      "mode": "primary",
      "model": "verified-builder-model",
      "prompt": "Implement only the current task packet and commit coherent changes.",
      "permission": { "edit": "ask", "bash": "ask" }
    },
    "nabla-reviewer": {
      "mode": "subagent",
      "model": "verified-reviewer-model",
      "prompt": "Review only. Return PASS, FAIL, or BLOCKED. Do not edit files.",
      "permission": { "edit": "deny", "bash": "ask" }
    },
    "nabla-context": {
      "mode": "subagent",
      "model": "verified-context-model",
      "prompt": "Create compact handoff summaries and preserve blockers.",
      "permission": { "edit": "ask", "bash": "ask" }
    },
    "nabla-final-review": {
      "mode": "subagent",
      "model": "verified-final-review-model",
      "prompt": "Review full phase acceptance. Do not edit files.",
      "permission": { "edit": "deny", "bash": "ask" }
    }
  }
}
```


## Config Key Rule

OpenCode custom agents MUST be configured under the singular `agent` key.

Do not use `agents` in generated config unless the installed OpenCode version explicitly documents that key.


## Supervisor Write Clarification

The default supervisor config uses `"edit": "deny"`.

This means the supervisor produces task packets in chat by default.

If file-backed task packets are desired, create a specific controlled mode or task packet that allows writing only to report/task-packet paths.
