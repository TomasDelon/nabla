
# Callouts

## Purpose

Defines foldable block syntax.

## Syntax

`[!type] title`, `[!type]> title`, `[!type]v title`, compatible `> [!type] title`

## Parsing Rules

Valid at block start. Type grammar `[A-Za-z][A-Za-z0-9_-]*`. Children are tab-indented. Compatible blockquote callouts serialize to canonical tab-indented children.

Child ownership:
- a child line MUST start with at least one tab beyond parent indentation;
- four spaces MAY be accepted in tolerant mode and serialized as one tab;
- lazy continuation is forbidden in v0;
- blank lines are allowed only inside an already established child block;
- multiple blank lines canonicalize to one blank line;
- fenced code inside children is protected;
- nested callouts/toggles are allowed at child indentation.

## AST

Produces `CalloutNode`.

## Serialization

Serializer emits canonical tab indentation.
Compatible blockquote syntax serializes to canonical Nabla syntax when applicable.

## Editor Behavior

Fold state changes update source markers.

## Workspace Behavior

No required workspace behavior.

## Conflicts

Markers inside paragraphs remain text.
Markers inside code remain literal.

## Diagnostics

`NABLA_CALLOUT_INVALID_TYPE`.

## Fixtures

Must include:
- canonical;
- folded/open states;
- compatible form when applicable;
- empty child;
- blank line child;
- fenced code child;
- nested block child.

## Acceptance Criteria

- parser fixture passes;
- serializer fixture passes;
- child ownership fixtures pass;
- protected-region fixtures pass.
