
# Parallelism Policy

## Purpose

Defines safe multi-agent parallelism.

## Principle

Parallelism is allowed only when file ownership is isolated.

## Allowed Parallelism

Allowed:
- reviewer reads while builder is not editing;
- context agent summarizes reports;
- final reviewer reviews after task completion;
- two builders on separate packages only after prior phases allow it.

## Forbidden Parallelism

Forbidden:
- two builders editing same package;
- builder and reviewer both editing;
- multiple agents editing specs;
- one agent changing fixtures while another implements parser;
- parallel phase execution before prior phase acceptance;
- parallel builders without task ownership declarations.

## Task Ownership

Every task packet must declare:

```md
## Owner Agent

## Allowed Files

## Forbidden Files

## Concurrent Tasks Allowed?

yes/no

## Lock Reason
```

## File Lock Rule

If a task packet owns a file, no other write-capable agent may edit that file until the task is complete.

## Git Rule

Parallel tasks require separate branches.

Merging parallel branches requires review and conflict resolution by the supervisor.
