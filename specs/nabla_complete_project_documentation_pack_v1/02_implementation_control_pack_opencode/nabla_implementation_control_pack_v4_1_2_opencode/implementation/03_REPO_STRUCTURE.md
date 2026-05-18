
# Repository Structure

## Recommended Monorepo

```text
nabla/
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ specs/
│  ├─ nabla_markdown_plus_spec_pack_v4_2_final/
│  └─ nabla_implementation_control_pack_v4_1_2_opencode/
├─ packages/
│  ├─ markup/
│  ├─ workspace/
│  ├─ editor/
│  ├─ components/
│  ├─ theme/
│  └─ app/
├─ reports/
│  ├─ MISSING_SPEC_REPORT.md
│  ├─ IMPLEMENTATION_PROGRESS.md
│  └─ VALIDATION_REPORT.md
└─ scripts/
```

## Canonical Fixture Location

The canonical fixture source is:

```text
specs/nabla_markdown_plus_spec_pack_v4_2_final/fixtures/
```

The implementation MUST read fixtures from this location by default.

Do not duplicate fixtures into a root `fixtures/` directory unless a script copies them from the canonical spec path.

If copied fixtures are used, the copy script MUST be deterministic and documented.

## Package Responsibilities

| Package | Responsibility |
|---|---|
| `packages/markup` | AST, parser, serializer, diagnostics, fixture runner |
| `packages/workspace` | indexes, resolution, backlinks, transclusions |
| `packages/editor` | Milkdown adapter |
| `packages/components` | React components |
| `packages/theme` | tokens and CSS |
| `packages/app` | final app shell |

## Important Boundary

Do not put parser logic in `packages/editor`.

Do not put workspace resolution logic in `packages/components`.

Do not put product grammar in React components.

## Git Layout Rule

The spec packs should be committed with the project unless the human explicitly wants them ignored.

If spec packs are too large, the AI MUST ask before adding them to `.gitignore`.


## Spec Pack Git Storage Alternatives

Default: commit extracted spec packs with the project.

If the human considers the spec packs too large, the AI may propose one of these alternatives:

1. commit only `MANIFEST.md`, `docs/`, and `fixtures/`;
2. commit a checksum file and keep ZIPs outside Git;
3. use Git LFS if available.

The AI MUST NOT ignore specs automatically.
The human must approve the chosen storage policy.
