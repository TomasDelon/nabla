# Task States

## Purpose

Defines supported checkbox states.

## Syntax

`- [ ] text`, `- [x] text`, `- [-] text`, `- [!] text`.

## Parsing Rules

Task state applies only to list items.

## AST

Stored on MarkdownNode.data.nablaTaskState.

## Serialization

Serialize state to original marker.

## Editor Behavior

Render distinct checkbox states. Changing state updates source.

## Workspace Behavior

No workspace behavior.

## Conflicts

Other checkbox markers are not v0.

## Diagnostics

No required diagnostics for unsupported markers; they may remain text.

## Fixtures

Must include all four states and unsupported marker.

## Acceptance Criteria

- parser fixture passes
- serializer fixture passes
- diagnostics fixture passes
- protected-region behavior is respected when applicable
