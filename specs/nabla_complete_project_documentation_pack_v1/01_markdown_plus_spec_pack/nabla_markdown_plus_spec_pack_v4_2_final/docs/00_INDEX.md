
# Nabla Markdown+ v0 Specification Index

## Purpose

This folder is the source of truth for Nabla Markdown+ v0.

Implementation agents MUST read this file first.
Implementation agents MUST NOT implement behavior that is not specified.
If behavior is missing, the agent MUST stop and report the missing specification.

## Version

This is specification pack v4.1.

v4.1 is the final readiness patch over v4.

It fixes the remaining audit issues:
- block id ownership is now stored on the attachable node via `data.nablaBlockId`;
- GFM table fixtures now use mdast-compatible `tableRow > tableCell > text`;
- parser modes are defined as `strict` and `tolerant`;
- coverage matrix was regenerated with current fixture status;
- toggle spec no longer mentions compatible syntax;
- high-value final fixtures were added;
- inline HTML protection is specified;
- invalid wiki target diagnostics are specified.

## Current Scope

Nabla Markdown+ v0 is a Markdown-compatible extended syntax layer for connected technical notes.

It includes:
- Markdown standard syntax;
- GFM;
- frontmatter;
- footnotes;
- tags;
- wiki links;
- block-only transclusions;
- block ids;
- callouts;
- toggles;
- folded headings;
- tooltips;
- highlights;
- comments;
- task states;
- emoji shortcodes.

It excludes:
- kbd syntax;
- generic components;
- generic attributes;
- MathLive;
- code execution;
- AI.

## Implementation Status

v4.1 is ready for parser skeleton and full implementation planning.

If implementation finds an uncovered case, the required workflow is:
1. add or update the spec;
2. add a fixture;
3. implement;
4. validate.


## v4.2 Final Cleanup

The final cleanup applies the last audit recommendations:
- deterministic block-id serializer wording;
- invalid wiki targets MUST remain text and emit diagnostics;
- callouts/empty fixture added;
- workspace transclusion-cycle diagnostic position removed;
- frontmatter YAML parser clarified;
- stale version wording normalized.
