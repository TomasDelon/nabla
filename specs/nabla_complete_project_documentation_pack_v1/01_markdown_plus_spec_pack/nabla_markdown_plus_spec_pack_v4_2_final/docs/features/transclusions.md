# Transclusions

## Purpose

Defines block-only read-only embeds.

## Syntax

`![[note]]`, `![[note#heading]]`, `![[note^id]]`, compatible `![[note#^id]]`.

## Parsing Rules

Parse only at block level. Inline occurrences remain text and may emit diagnostic.

## AST

Produces block-only `TransclusionNode`.

## Serialization

Serialize compatible block transclusions to `![[note^id]]`.

## Editor Behavior

Render as read-only embedded block with diagnostic states.

## Workspace Behavior

Workspace resolves target and detects cycles/depth limit.

## Conflicts

`![[note]]` inside paragraph is not a transclusion in v0.

## Diagnostics

`NABLA_TRANSCLUSION_INLINE_UNSUPPORTED`, `NABLA_TRANSCLUSION_MISSING_TARGET`, `NABLA_TRANSCLUSION_CYCLE`, `NABLA_TRANSCLUSION_DEPTH_LIMIT`.

## Fixtures

Must include note, heading, block, compatible, inline unsupported, missing, cycle, depth limit.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable


## Canonical Block Fixture

`transclusions/block-canonical` proves canonical `![[note^id]]` parsing and serialization.
