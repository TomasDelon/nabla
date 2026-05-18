
# Spec Sync and Hash Policy

## Purpose

Prevents implementation against the wrong spec pack.

## Required Spec Pack

Expected spec pack:

```text
nabla_markdown_plus_spec_pack_v4_2_final
```

## Hash Definition

`required_spec_manifest_sha256` is the SHA-256 hash of the raw extracted `MANIFEST.md` bytes from the required spec pack.

Expected current manifest hash:

```text
b6a6a59f70b30ecf68009e0ded88533b65f31a81facffa9db24879a8797ccdd1
```

## Validation Command

`pnpm validate:spec-version` MUST verify:

- spec directory exists;
- `MANIFEST.md` exists;
- `docs/16_SPEC_COVERAGE_MATRIX.md` exists;
- `fixtures/` exists;
- manifest hash matches `implementation_pack.json`.

## Stop Rule

If spec validation fails, implementation MUST stop before coding.

## Updating the Hash

Only update the required hash when:
- the human explicitly provides a new approved spec pack;
- the manifest hash is recomputed;
- `implementation_pack.json` is updated;
- the update is committed.
