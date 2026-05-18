# Tooltips

## Purpose

Defines inline tooltips.

## Syntax

`word^[tooltip]`, `[visible text]^[tooltip]`.

## Parsing Rules

Single-token target uses `[\p{L}\p{N}_-]+`. Explicit-span target uses bracket content.

## AST

Produces `TooltipNode`.

## Serialization

Serialize single-token or explicit-span form according to target length.

## Editor Behavior

Render target with subtle affordance. Hover/click reveals tooltip.

## Workspace Behavior

No workspace behavior.

## Conflicts

`[^id]` is footnote. Tooltip inside code is literal.

## Diagnostics

`NABLA_TOOLTIP_EMPTY_TARGET`, `NABLA_TOOLTIP_UNCLOSED`.

## Fixtures

Must include single token, explicit span, footnote conflict, empty target, protected region.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable


## Protected Region Fixture

`tooltips/protected-region` proves tooltip syntax remains literal inside inline code and fenced code.
