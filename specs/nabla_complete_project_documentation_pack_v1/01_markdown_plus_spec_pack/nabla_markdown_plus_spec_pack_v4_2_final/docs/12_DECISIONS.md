
# Decisions

## DEC-001 — Source of Truth Is Plain Text

Accepted.

Documents are stored as Markdown-compatible plain text.

## DEC-002 — CommonMark and GFM Baseline

Accepted.

GFM tables and table alignment are included.

## DEC-003 — Read Compatible, Write Canonical

Accepted.

Compatible syntax is parsed and serialized to canonical syntax.

## DEC-004 — No Keyboard-Key Syntax in v0

Accepted.

No kbd node.
No double-backtick kbd.
No `++key++`.

## DEC-005 — No Generic Components in v0

Accepted.

`[component args]` is out.

## DEC-006 — No Generic Attributes in v0

Accepted.

`{#id .class k=v}` is out.

## DEC-007 — Transclusions Are Block-Only

Accepted.

Inline transclusions are out of v0.

## DEC-008 — Task States Live on MarkdownNode.data

Accepted.

Extended task states are stored as `MarkdownNode.data.nablaTaskState`.

## DEC-009 — Registries Are Explicit

Accepted.

Emoji shortcodes and callout rendering use registries defined in `15_REGISTRIES.md`.

## DEC-010 — Fixture AST Must Be Real AST

Accepted.

Fixtures use `NablaDocument`, not summary AST.


## DEC-011 — Block IDs Are Stored on Attachable Nodes

Accepted.

Block IDs are stored as `data.nablaBlockId` on the owning attachable node.

There is no persisted standalone `BlockIdNode` in v0.

## DEC-012 — Parser Modes Are Explicit

Accepted.

`ParseMode = "strict" | "tolerant"`.

Strict mode is default.
Tolerant mode may accept four-space child indentation and normalize it to tabs.
