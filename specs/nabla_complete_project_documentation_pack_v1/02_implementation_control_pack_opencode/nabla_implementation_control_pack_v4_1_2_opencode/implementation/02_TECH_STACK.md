
# Tech Stack

## Default Stack

| Area | Choice |
|---|---|
| Language | TypeScript |
| Package manager | pnpm |
| Test runner | Vitest |
| Markdown parser | unified + remark-parse |
| GFM support | remark-gfm |
| YAML frontmatter | YAML 1.2-compatible parser |
| Editor later | Milkdown / Crepe |
| UI later | React |
| Build | tsup |
| Lint | ESLint |
| Formatting | Prettier |

## Phase 1 Dependencies

Recommended dependencies for `@nabla/markup`:

```bash
pnpm add unified remark-parse remark-gfm unist-util-visit yaml
pnpm add -D typescript vitest tsx tsup @types/node
```

The implementation AI may adjust dependencies only if it explains why.

## Dependency Rules

`@nabla/markup` MUST NOT depend on:

- React;
- DOM;
- Milkdown;
- ProseMirror;
- browser APIs;
- workspace storage.

`@nabla/workspace` MAY depend on `@nabla/markup`.

`@nabla/editor` MAY depend on Milkdown, ProseMirror, and `@nabla/markup`.

## Version Policy

Use current stable package versions available in the environment.

If exact package installation fails, report the failure and propose an alternative.

## Version Control

Git is mandatory. See `16_GIT_AND_VERSION_CONTROL.md`.


## Core Parser Stack Approval Rule

The implementation AI MUST NOT replace the core parser stack without explicit human approval.

Core parser stack means:

- `unified`
- `remark-parse`
- `remark-gfm`

Alternative libraries may be proposed in a report, but the AI MUST NOT switch to them until the human approves.

Non-core helper dependencies may be adjusted if the AI explains the reason in the progress report.
