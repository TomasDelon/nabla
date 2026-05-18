
# Editor Behavior

## Purpose

Defines visual behavior for Nabla Markdown+ v0.

## Standard Markdown

Standard Markdown uses editor default rendering.

## GFM Tables

Table alignment MUST affect visual alignment.

## Task States

Task states render as distinct checkbox states:
- unchecked;
- checked;
- cancelled;
- important.

Changing state updates the source marker.

## Wiki Links

Wiki links render as internal links.
Missing links render with missing state.
Aliases show alias text.

## Transclusions

Transclusions are block-only and read-only.
They render as embedded blocks.
Missing, cycle, and depth-limit errors are visible.

## Tags

Tags render as pills.

## Block IDs

Block ids render as subtle anchors.
They support copy block reference action.

## Callouts

Callouts render as visual callout blocks.
Unknown type uses generic callout style.
Fold state changes update source.

## Toggles

Closed toggles hide children.
Open toggles show children.
Fold changes update source.

## Folded Headings

Closed folded headings hide section content until next heading of same or higher depth.
If a parent folded heading is closed, all nested child headings are hidden regardless of their own fold state.
Open folded headings show their section content unless hidden by a closed parent.

## Tooltips

Tooltip targets render with subtle affordance.
Hover or click reveals tooltip.

## Highlights

Simple highlight uses default style.
Color highlight uses specified hex color.

## Emoji Shortcodes

Known shortcodes render as emoji.
Unknown shortcodes remain source text.

## Comments

Private comments are hidden in reading mode and muted in edit mode.

## Footnotes

Footnote references render as markers.
Definitions render at their source position by default in v0. A footnote panel is future UI.

## Out of Scope

No kbd rendering.
No generic components.
No MathLive.
No code execution.
