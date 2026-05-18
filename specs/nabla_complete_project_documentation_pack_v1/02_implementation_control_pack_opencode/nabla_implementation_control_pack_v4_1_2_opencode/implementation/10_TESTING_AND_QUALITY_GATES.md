# Testing and Quality Gates

## Required Commands

The implementation MUST create commands with these exact names:

```bash
pnpm test
pnpm test:markup
pnpm test:workspace
pnpm typecheck
pnpm lint
pnpm build
pnpm validate:fixtures
pnpm validate:spec-version
pnpm check:boundaries
```

If a command cannot exist yet, the AI MUST explain the temporary absence in the progress report and create the command as soon as the relevant package exists.

## Boundary Check

`pnpm check:boundaries` MUST verify at least:

- `@nabla/markup` does not import React;
- `@nabla/markup` does not import DOM APIs;
- `@nabla/markup` does not import Milkdown;
- `@nabla/markup` does not import ProseMirror;
- `@nabla/components` does not import parser internals;
- `@nabla/editor` does not define grammar.

## Spec Version Validation

`pnpm validate:spec-version` MUST verify:

- required spec folder exists;
- required spec `MANIFEST.md` exists;
- required spec version matches the expected version;
- manifest hash matches `required_spec_manifest_sha256`;
- fixture folder exists;
- `docs/16_SPEC_COVERAGE_MATRIX.md` exists.

For detailed hash policy, see `implementation/25_SPEC_SYNC_AND_HASH_POLICY.md`.

## Test Failure Rule

If tests cannot run, the AI MUST report:

- command attempted;
- exact error;
- exit code if available;
- likely cause;
- next fix.

The AI MUST NOT claim a phase is done if required tests cannot run.

## Phase 1 Gate

`@nabla/markup` passes when:

- TypeScript compiles;
- parser fixtures pass;
- serializer fixtures pass;
- diagnostics fixtures pass;
- protected region fixtures pass;
- boundary check confirms no UI dependency;
- Git working tree is clean after commit.

## Phase 2 Gate

`@nabla/workspace` passes when:

- workspace fixtures pass;
- missing links detected;
- duplicate block ids detected;
- transclusion cycles detected;
- depth limit enforced;
- Git working tree is clean after commit.

## Phase 3 Gate

`@nabla/editor` passes when:

- source preservation tests pass;
- fold state commands update source;
- protected regions remain literal;
- save pipeline goes through parser + serializer;
- `NABLA_EDITOR_EXPORT_LOSS` behavior is tested;
- Git working tree is clean after commit.

## Regression Policy

If any fixture breaks:

1. stop;
2. identify cause;
3. fix implementation or request approval to update spec + fixture;
4. do not ignore.

## Spec Manifest Hash

If a manifest hash is provided in `implementation_pack.json`, the spec-version validation command must include that hash check.

If the hash cannot be verified because the spec pack is not present, the command MUST fail with an actionable message.
