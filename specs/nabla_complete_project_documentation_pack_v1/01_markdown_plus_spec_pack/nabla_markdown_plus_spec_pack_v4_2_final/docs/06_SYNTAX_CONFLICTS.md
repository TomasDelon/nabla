
# Syntax Conflicts

## Protected Regions

Protected regions win over all Nabla syntax.

## Rules

| Conflict | Rule |
|---|---|
| `# text` vs `#tag` | heading if space follows marker |
| `#v text` vs `#vocabulary` | folded heading only with `#v ` |
| `#> text` | folded heading only at heading position |
| `text[^id]` vs `text^[tip]` | `[^` footnote, `^[` tooltip |
| `[text]^[tip]` vs link | tooltip span when `]^[` follows immediately |
| `![[note]]` inline | remains text; transclusions are block-only |
| `![[note]]` block | transclusion |
| `[[note]]` | wiki link |
| `> [!type]` | compatible callout |
| `[!type]` | Nabla callout only at block start |
| `]> title` | toggle only at block start |
| `^id` | block id only in valid block-id position |
| `=={#hex}text==` | color highlight if color is valid |
| `%% text %%` | private comment if closing delimiter exists |
| `:name:` | emoji shortcode only if registry has name |

## Emoji Grammar

```regex
[a-z0-9_+-]+
```

Unknown shortcodes remain text and MAY emit `NABLA_EMOJI_UNKNOWN`.

## Hex Color Grammar

```regex
#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})
```

## Removed Conflicts

There is no kbd conflict in v0.
Double backticks remain Markdown code span behavior.

## Inline HTML

Nabla syntax inside inline HTML MUST remain literal.
