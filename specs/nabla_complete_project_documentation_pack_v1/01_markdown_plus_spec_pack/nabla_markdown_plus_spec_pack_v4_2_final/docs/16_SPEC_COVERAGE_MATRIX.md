# Spec Coverage Matrix

Status values: OK, PARTIAL, MISSING, BLOCKED.

| Feature | Syntax | AST | Parser | Serializer | Editor | Workspace | Diagnostics | Fixtures | Notes |
|---|---|---|---|---|---|---|---|---|---|
| CommonMark baseline | OK | OK | PARTIAL | PARTIAL | OK | OK | OK | PARTIAL | mdast extension fields fixed; exact library still implementation choice |
| GFM tables | OK | OK | OK | PARTIAL | OK | OK | OK | OK | mdast-compatible table fixture fixed |
| Task states | OK | OK | OK | OK | OK | OK | OK | OK | complete for v0 |
| Frontmatter | OK | OK | OK | OK | PARTIAL | OK | OK | OK | valid/invalid/hr fixtures exist |
| Wiki links | OK | OK | OK | OK | OK | PARTIAL | OK | OK | alias/combined/escaped/canonical/invalid fixtures exist |
| Tags | OK | OK | OK | OK | OK | PARTIAL | OK | OK | good for v0 |
| Block IDs | OK | OK | OK | PARTIAL | OK | PARTIAL | OK | OK | ownership fixed with data.nablaBlockId |
| Transclusions | OK | OK | OK | OK | OK | PARTIAL | OK | OK | canonical/compatible/missing/depth/cycle covered |
| Callouts | OK | OK | OK | PARTIAL | OK | OK | OK | OK | fold states/nested/fenced/blank/empty covered |
| Toggles | OK | OK | OK | PARTIAL | OK | OK | OK | OK | blank/nested/fenced/empty covered |
| Folded headings | OK | OK | OK | OK | OK | PARTIAL | OK | OK | levels/tag conflict covered |
| Tooltips | OK | OK | OK | PARTIAL | OK | OK | OK | OK | basic/empty/unclosed/protected covered |
| Highlights | OK | OK | OK | OK | OK | OK | OK | OK | simple/color/invalid/unclosed/protected covered |
| Comments | OK | OK | OK | OK | OK | OK | OK | OK | basic/multiline/protected covered |
| Footnotes | OK | OK | OK | PARTIAL | OK | OK | OK | OK | basic/missing/unused covered |
| Emoji shortcodes | OK | OK | OK | OK | OK | OK | OK | OK | registry/unknown/protected covered |
