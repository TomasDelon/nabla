
# Registries

## Purpose

Defines v0 registries used by parsing and rendering.

## Emoji Registry

The default v0 emoji registry contains:

| Name | Emoji |
|---|---|
| `check` | ✅ |
| `warning` | ⚠️ |
| `idea` | 💡 |
| `fire` | 🔥 |
| `star` | ⭐ |
| `x` | ❌ |

Unknown emoji shortcodes remain text and MAY emit `NABLA_EMOJI_UNKNOWN`.

## Callout Registry

The parser does not require a callout registry.

The editor uses the registry for rendering.

Default v0 callout registry MAY contain:

| Type | Label | Style |
|---|---|---|
| `note` | Note | neutral |
| `warning` | Warning | warning |
| `info` | Info | info |
| `tip` | Tip | success |

The grammar still accepts any callout type matching the callout type regex.
Unknown callout types render as generic callouts.


## Fixture Registry Policy

Fixtures use the default v0 emoji registry unless a fixture-local registry file explicitly overrides it.

Fixtures use the default v0 callout registry for rendering expectations only.
The parser still accepts any callout type matching the grammar.
