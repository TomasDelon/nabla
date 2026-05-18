
# Markup Syntax

## Status

| Status | Meaning |
|---|---|
| included | supported in v0 |
| compatible | parsed in v0 and serialized to canonical syntax |
| out | not implemented in v0 |

## Markdown Standard

| Feature | Syntax | Status |
|---|---|---|
| Paragraph | free text | included |
| Heading 1 | `# text` | included |
| Heading 2 | `## text` | included |
| Heading 3 | `### text` | included |
| Heading 4 | `#### text` | included |
| Heading 5 | `##### text` | included |
| Heading 6 | `###### text` | included |
| Italic | `*text*` | included |
| Bold | `**text**` | included |
| Inline code | `` `text` `` | included |
| List | `- text` | included |
| Ordered list | `1. text` | included |
| Quote | `> text` | included |
| Separator | `---` | included |
| Link | `[text](url)` | included |
| Link title | `[text](url "title")` | included |
| Reference link | `[text][id]` | included |
| Reference definition | `[id]: url` | included |
| Image | `![alt](src)` | included |
| Reference image | `![alt][id]` | included |
| Autolink | `<url>` | included |
| Email autolink | `<email>` | included |
| Indented code block | four spaces | included |
| Fenced code block | ```` ```lang ... ``` ```` | included |
| Inline HTML | `<span>...</span>` | included |
| Block HTML | `<div>...</div>` | included |
| HTML comment | `<!-- text -->` | included |
| Escape | `\character` | included |
| HTML entity | `&name;` | included |

## GFM

| Feature | Syntax | Status |
|---|---|---|
| Table | `A | B` | included |
| Default column | `---` | included |
| Left column | `:---` | included |
| Center column | `:---:` | included |
| Right column | `---:` | included |
| Unchecked task | `- [ ] text` | included |
| Checked task | `- [x] text` | included |
| Strikethrough | `~~text~~` | included |
| Literal autolink | `https://...` | included |

## Common Extensions

| Feature | Syntax | Status |
|---|---|---|
| Frontmatter | `--- ... ---` | included |
| Footnote reference | `text[^id]` | included |
| Footnote definition | `[^id]: text` | included |
| Unicode emoji | direct emoji as text | included |
| Emoji shortcode | `:name:` | included |
| Simple highlight | `==text==` | included |
| Cancelled task | `- [-] text` | included |
| Important task | `- [!] text` | included |

## Connected Notes

| Feature | Syntax | Status |
|---|---|---|
| Tag | `#tag` | included |
| Nested tag | `#a/b` | included |
| Wiki link | `[[note]]` | included |
| Wiki alias | `[[note\|text]]` | included |
| Heading link | `[[note#heading]]` | included |
| Compatible block link | `[[note#^id]]` | compatible |
| Canonical block link | `[[note^id]]` | included |
| Note transclusion | `![[note]]` | included |
| Heading transclusion | `![[note#heading]]` | included |
| Compatible block transclusion | `![[note#^id]]` | compatible |
| Canonical block transclusion | `![[note^id]]` | included |
| Block id | `^id` | included |
| Private comment | `%% text %%` | included |
| Compatible callout | `> [!type] title` | compatible |

## Nabla Compact Syntax

| Feature | Syntax | Status |
|---|---|---|
| Color highlight | `=={#hex}text==` | included |
| Single-token tooltip | `word^[tooltip]` | included |
| Explicit-span tooltip | `[visible text]^[tooltip]` | included |
| Closed toggle | `]> title` | included |
| Open toggle | `]v title` | included |
| Closed folded heading | `#> text`, `##> text`, etc. | included |
| Open folded heading | `#v text`, `##v text`, etc. | included |
| Callout | `[!type] title` | included |
| Closed callout | `[!type]> title` | included |
| Open callout | `[!type]v title` | included |

## Explicitly Out

| Feature | Syntax |
|---|---|
| Keyboard key | double backticks |
| Keyboard key alternative | `++key++` |
| Superscript | `text^sup^` |
| Subscript | `text~sub~` |
| Generic attributes | `{#id .class k=v}` |
| Generic components | `[component args]` |
| Inline transclusion | `text ![[note]] text` |

## Canonicalization

| Compatible input | Canonical output |
|---|---|
| `[[note#^id]]` | `[[note^id]]` |
| `![[note#^id]]` | `![[note^id]]` |
| `> [!type] title` | `[!type] title` |
