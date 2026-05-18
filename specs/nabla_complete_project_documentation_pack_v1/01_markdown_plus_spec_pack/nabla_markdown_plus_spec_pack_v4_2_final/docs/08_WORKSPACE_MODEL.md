
# Workspace Model

## Purpose

Defines deterministic workspace behavior.

## Path Resolution

Targets are normalized by:
1. trim surrounding whitespace;
2. Unicode NFC;
3. preserve case;
4. preserve `/`;
5. remove trailing `.md` or `.mp` for matching.

Matching candidates:
1. `target`
2. `target.md`
3. `target.mp`
4. `target/index.md`
5. `target/index.mp`

Matching is case-sensitive and platform-independent in v0.

## Heading Slugs

Slug algorithm:
1. visible heading text;
2. Unicode NFC;
3. lowercase;
4. trim;
5. remove accents by Unicode decomposition;
6. replace whitespace with `-`;
7. remove punctuation except `-` and `_`;
8. collapse repeated `-`;
9. trim leading/trailing `-`.

Duplicate slugs:
- first: `slug`
- second: `slug-2`
- third: `slug-3`.

## Block Index

Block ids are unique per document.
Duplicates emit `NABLA_BLOCK_ID_DUPLICATE`.

## Backlinks

Backlinks are derived from wiki links.

A backlink record includes:
- source path;
- target path;
- kind: note, heading, or block;
- source position.

## Transclusion Graph

Graph node identity:
- `path`
- `path#headingSlug`
- `path^blockId`

Resolver tracks visited nodes.
Revisiting a node emits `NABLA_TRANSCLUSION_CYCLE`.

Default max depth: 5.
Exceeding depth emits `NABLA_TRANSCLUSION_DEPTH_LIMIT`.

## Workspace Fixtures

Workspace fixtures MUST include real files under `files/`.
Expected workspace results belong in `expected-index.json`.


## Backlink Source Position Policy

Workspace backlink records SHOULD include `sourcePosition` when source mapping is available.

In v0 workspace fixtures, `sourcePosition` is optional unless the fixture name contains `position`.

If `sourcePosition` is omitted from a fixture, workspace tests MUST compare path, target, and kind only.

Position-specific workspace behavior MUST be tested in dedicated fixtures.
