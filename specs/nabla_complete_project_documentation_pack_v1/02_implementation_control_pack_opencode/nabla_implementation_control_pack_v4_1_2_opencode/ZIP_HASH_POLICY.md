
# ZIP Hash Policy

## Purpose

This file explains why the implementation control pack does not embed its own ZIP SHA-256 inside `implementation_pack.json`.

## Rule

The ZIP artifact hash is external metadata.

A ZIP archive cannot safely contain the final SHA-256 hash of itself, because updating the embedded hash changes the ZIP bytes and therefore changes the hash.

## Validation

Use the external sidecar file. The sidecar is distributed next to the ZIP and is not stored inside the ZIP:

```text
nabla_implementation_control_pack_v4_1_2_opencode.zip.sha256
```

to validate the final downloaded artifact.

## Spec Pack Hash

The spec pack manifest hash remains embedded in `implementation_pack.json` because it refers to a different artifact:

```text
required_spec_manifest_sha256
```


## Distribution Rule

The sidecar file MUST NOT be expected inside the ZIP archive.

It is distributed externally next to the ZIP artifact.
