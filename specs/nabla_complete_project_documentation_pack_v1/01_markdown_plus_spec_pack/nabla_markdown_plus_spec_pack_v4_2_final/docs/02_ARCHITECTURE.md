
# Architecture

## Purpose

This document defines the stable architecture for Nabla Markdown+ v0.

## Principle

Plain text source is the only persistent document truth.

Derived layers:
- parsed AST;
- editor document;
- rendered UI;
- workspace indexes.

## Runtime Flow

```text
source .md/.mp
→ @nabla/markup parser
→ NablaDocument
→ @nabla/workspace indexes
→ @nabla/editor adapter
→ Milkdown / ProseMirror document
→ React node views
→ serializer
→ canonical source
```

## Packages

| Package | Responsibility |
|---|---|
| `@nabla/markup` | parser, AST, serializer, diagnostics |
| `@nabla/workspace` | file index, heading index, block index, backlinks, transclusions |
| `@nabla/editor` | Milkdown/ProseMirror integration |
| `@nabla/components` | React views only |
| `@nabla/theme` | visual tokens |
| `@nabla/app` | application shell |

## Dependency Rules

`@nabla/markup` MUST NOT depend on React, Milkdown, ProseMirror, DOM, or workspace storage.

`@nabla/workspace` MAY depend on `@nabla/markup`.

`@nabla/editor` MAY depend on `@nabla/markup` and `@nabla/components`.

`@nabla/components` MUST NOT define grammar.

## Editor Adapter Contract

The v0 safe adapter path is:

```text
editor document → Markdown string → Nabla parser → Nabla serializer → saved source
```

The editor MUST NOT save rendered HTML.

Unsupported Markdown MUST be preserved when possible.
Protected regions MUST remain literal.

## Workspace Contract

The workspace operates without the visual editor.

It MUST:
- parse documents;
- index files;
- index headings;
- index block ids;
- compute backlinks;
- resolve transclusions;
- detect cycles;
- emit diagnostics.


## Editor Markdown Export Source Preservation

The editor adapter MUST treat Milkdown/ProseMirror Markdown export as an intermediate representation, not as trusted final source.

Before saving, exported Markdown MUST be parsed by `@nabla/markup` and serialized by the canonical serializer.

If the editor export loses a construct that was present in the source and cannot be represented in the editor document, the adapter MUST emit a diagnostic before save.

The implementation SHOULD keep an original-source snapshot while the file is open so source-preservation tests can detect unintended loss.
