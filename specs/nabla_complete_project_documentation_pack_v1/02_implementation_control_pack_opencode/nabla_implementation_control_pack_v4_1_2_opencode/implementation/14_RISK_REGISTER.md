
# Risk Register

## R1 — Source Fidelity Loss

Risk: editor normalizes Markdown and loses source details.

Mitigation:
- preserve original source snapshot;
- save through parser + serializer;
- emit `NABLA_EDITOR_EXPORT_LOSS`.

## R2 — Parser Overreach

Risk: parser recognizes Nabla syntax inside code or HTML.

Mitigation:
- protected region tests;
- parse protected regions first.

## R3 — Scope Creep

Risk: implementation adds kbd, generic components, MathLive, AI, or code execution.

Mitigation:
- follow product scope;
- reject out-of-scope features.

## R4 — Workspace Ambiguity

Risk: path resolution differs by platform.

Mitigation:
- use spec-defined case-sensitive matching;
- test with workspace fixtures.

## R5 — Block ID Ownership Bugs

Risk: block references point to wrong node.

Mitigation:
- use `data.nablaBlockId`;
- test list/table/callout/toggle/transclusion attachments.

## R6 — Fixture Drift

Risk: fixtures stop matching specs.

Mitigation:
- update spec and fixture together;
- run validation after each change.


## R7 — No Version Control

Risk: implementation becomes untraceable.

Mitigation:
- Git is mandatory;
- branch per phase;
- commit after each coherent step;
- clean working tree before handoff.

## R8 — Silent Spec Drift

Risk: AI edits specs or fixtures to make tests pass.

Mitigation:
- human approval required before spec/fixture changes;
- spec/fixture changes committed separately;
- missing spec report required.
