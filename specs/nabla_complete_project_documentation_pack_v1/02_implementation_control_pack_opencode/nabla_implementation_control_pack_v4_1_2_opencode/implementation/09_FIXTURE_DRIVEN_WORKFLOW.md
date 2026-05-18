
# Fixture Driven Workflow

## Principle

Fixtures are executable contracts.

Do not implement behavior that cannot be tested against a fixture.

## Canonical Fixture Location

The canonical fixture path is:

```text
specs/nabla_markdown_plus_spec_pack_v4_2_final/fixtures/
```

All fixture tests MUST load from this path unless a controlled script copies fixtures into a test workspace.

## Fixture Types

Parser fixture:

```text
input.md
ast.json
output.md
diagnostics.json
```

Workspace fixture:

```text
files/
expected-index.json
diagnostics.json
```

## Test Loop

1. Load fixture.
2. Parse `input.md`.
3. Compare AST to `ast.json`.
4. Compare diagnostics to `diagnostics.json`.
5. Serialize AST.
6. Compare output to `output.md`.

## Diagnostic Position Policy

If a diagnostic fixture contains `position`, compare it exactly.

If it does not contain `position`, compare only:

- severity;
- code;
- message.

## Adding or Updating Behavior

Do not modify specs or fixtures without human approval.

If behavior is missing:

1. write `reports/MISSING_SPEC_REPORT.md`;
2. stop implementation;
3. wait for human approval.

If the human approves a spec/fixture change:

1. update the spec;
2. update or add the fixture;
3. commit the spec/fixture change separately;
4. implement behavior;
5. commit implementation separately.

## Do Not

- Do not use fixtures as vague examples.
- Do not compare only rendered HTML.
- Do not ignore diagnostics.
- Do not weaken fixtures to make tests pass without approval.
