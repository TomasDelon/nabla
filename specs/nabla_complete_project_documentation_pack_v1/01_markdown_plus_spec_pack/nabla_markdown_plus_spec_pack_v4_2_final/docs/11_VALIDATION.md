
# Validation

## Levels

| Level | Name | Requirement |
|---|---|---|
| L0 | Specified | feature spec exists |
| L1 | Modeled | AST contract exists |
| L2 | Fixtured | real fixtures exist |
| L3 | Parsed | parser tests pass |
| L4 | Serialized | serializer tests pass |
| L5 | Rendered | editor behavior works |
| L6 | Indexed | workspace behavior works |
| L7 | Stable | no regressions |

## Definition of Done

A feature is done only when:
- syntax is specified;
- AST is specified;
- diagnostics are specified;
- fixtures use real schema;
- parse tests pass;
- serializer tests pass;
- editor behavior matches spec;
- workspace behavior passes when applicable.

## Missing Spec Rule

If behavior is missing, stop and report it.
Do not guess.
