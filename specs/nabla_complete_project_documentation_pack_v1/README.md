# Nabla Complete Project Documentation Pack v1

Generated: 2026-05-18

## Purpose

This ZIP combines the two final Nabla documentation packs:

1. Nabla Markdown+ v0 specification pack
2. Nabla implementation control / OpenCode pack

The folders are kept separate to avoid path conflicts.

## Folder Structure

```text
nabla_complete_project_documentation_pack_v1/
├─ 01_markdown_plus_spec_pack/
├─ 02_implementation_control_pack_opencode/
└─ README.md
```

## Included Source ZIPs

| Pack | Source ZIP |
|---|---|
| Markdown+ spec pack | `nabla_markdown_plus_spec_pack_v4_2_final.zip` |
| Implementation control pack | `nabla_implementation_control_pack_v4_1_2_opencode.zip` |

## Counts

| Folder | Total files | Markdown files | JSON files |
|---|---:|---:|---:|
| `01_markdown_plus_spec_pack` | 308 | 172 | 136 |
| `02_implementation_control_pack_opencode` | 41 | 40 | 1 |
| Full combined pack | 353 | 214 | 138 |

## How to Use

Give this ZIP to the implementation AI together with this instruction:

```text
Read the complete Nabla documentation pack.
Use 01_markdown_plus_spec_pack as the language/source-of-truth specification.
Use 02_implementation_control_pack_opencode as the implementation process, OpenCode, Git, task-packet, and quality-gate control layer.
Do not implement behavior outside the specs.
Start with Phase 1: @nabla/markup.
```

## Important Rule

The spec pack defines what to build.
The implementation control pack defines how to build it safely.


## Final Metadata Patch

Applied: 2026-05-18

- Updated combined wrapper counts.
- Regenerated `COMBINED_MANIFEST.json`.
- Canonicalized the spec source ZIP name to `nabla_markdown_plus_spec_pack_v4_2_final.zip`.
- Regenerated external SHA-256 sidecar.
