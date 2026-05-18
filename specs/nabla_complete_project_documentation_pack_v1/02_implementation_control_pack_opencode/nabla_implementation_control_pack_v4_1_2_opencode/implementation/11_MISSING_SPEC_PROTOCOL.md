
# Missing Specification Protocol

## When to Use

Use this protocol when:

- behavior is unspecified;
- two specs conflict;
- a fixture conflicts with a spec;
- a dependency cannot represent required behavior;
- implementation would require guessing.

## Required Output

Create or update:

```text
reports/MISSING_SPEC_REPORT.md
```

## Template

```md
# Missing Specification Report

## Summary

## Affected Feature

## Affected Spec Files

## Affected Fixtures

## Missing or Contradictory Behavior

## Why Implementation Cannot Continue Safely

## Possible Options

### Option A

### Option B

## Recommended Option

## Required Human Decision

## Status

Waiting for human approval.
```

## Git Rule

Commit the missing spec report:

```bash
git add reports/MISSING_SPEC_REPORT.md
git commit -m "docs: report missing specification for <feature>"
```

## Important Rule

The implementation AI may propose options but MUST NOT implement one until approved.

The implementation AI MUST NOT modify specs or fixtures without explicit human approval.
