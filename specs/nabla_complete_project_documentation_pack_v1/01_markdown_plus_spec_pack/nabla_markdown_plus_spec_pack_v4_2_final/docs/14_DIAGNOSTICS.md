
# Diagnostics

## Diagnostic Type

```ts
type Diagnostic = {
  severity: "info" | "warning" | "error";
  code: string;
  message: string;
  position?: SourcePosition;
};
```

## Codes

| Code | Severity | Meaning |
|---|---|---|
| `NABLA_FRONTMATTER_INVALID` | warning | invalid frontmatter |
| `NABLA_LINK_MISSING_TARGET` | warning | missing wiki target |
| `NABLA_LINK_AMBIGUOUS_TARGET` | warning | ambiguous wiki target |
| `NABLA_WIKI_LINK_INVALID_TARGET` | warning | invalid wiki link target grammar |
| `NABLA_HEADING_MISSING_TARGET` | warning | missing heading |
| `NABLA_BLOCK_MISSING_TARGET` | warning | missing block |
| `NABLA_BLOCK_ID_INVALID` | warning | invalid block id grammar |
| `NABLA_BLOCK_ID_INVALID_POSITION` | warning | invalid block id position |
| `NABLA_BLOCK_ID_DUPLICATE` | warning | duplicate block id |
| `NABLA_TOOLTIP_EMPTY_TARGET` | warning | tooltip has no target |
| `NABLA_TOOLTIP_UNCLOSED` | warning | tooltip not closed |
| `NABLA_HIGHLIGHT_UNCLOSED` | warning | highlight not closed |
| `NABLA_HIGHLIGHT_INVALID_COLOR` | warning | invalid color |
| `NABLA_CALLOUT_INVALID_TYPE` | warning | invalid callout type |
| `NABLA_TOGGLE_MISSING_TITLE` | info | empty toggle title |
| `NABLA_TRANSCLUSION_INLINE_UNSUPPORTED` | warning | inline transclusion not supported |
| `NABLA_TRANSCLUSION_MISSING_TARGET` | warning | missing transclusion target |
| `NABLA_TRANSCLUSION_CYCLE` | error | transclusion cycle |
| `NABLA_TRANSCLUSION_DEPTH_LIMIT` | warning | transclusion depth limit |
| `NABLA_EMOJI_UNKNOWN` | info | unknown emoji shortcode |
| `NABLA_FOOTNOTE_MISSING_DEFINITION` | warning | missing footnote definition |
| `NABLA_FOOTNOTE_UNUSED_DEFINITION` | info | unused footnote definition |
| `NABLA_EDITOR_EXPORT_LOSS` | error | editor Markdown export lost a source construct before save |
