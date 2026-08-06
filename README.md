# Goshi

A shared React component library and UI framework engineered to handle
everything from simple consumer flows to complex enterprise dashboards.

Goshi ships two product modes from one shared foundation:

- **Consumer** (`con`) — React Native, its own typography/components/patterns
- **Enterprise** (`ent`) — Next.js, its own typography/components/patterns

Both alias the same underlying colour, spacing, sizing, radius, elevation,
motion and icon foundation. See
[docs/architecture](docs/architecture/README.md) for the full reasoning —
start with
[0005 — Consumer/Enterprise sharing & override model](docs/architecture/0005-consumer-enterprise-sharing-model.md)
if you want the short version.

> **Status.** Foundations are built. Consumer has six components — Loader,
> Shimmer, Button, Tag, Card, Tile — translated from the real Goshi Design
> System (Consumer) Figma file; see
> [0006](docs/architecture/0006-figma-consumer-sync.md) and
> [0007](docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md) for
> exactly what's confirmed-real vs. still-placeholder, and what's flagged
> rather than assumed. Two composed patterns (Action Card, Media Tile) and
> a possible Chip component remain — see
> [consumer-figma-gap-audit.md](docs/architecture/consumer-figma-gap-audit.md)
> for the living list. Enterprise has no components yet. Colour/typography
> outside what these six Consumer components touch is still placeholder —
> see [0004](docs/architecture/0004-figma-sync-status.md).

## Package layout

```
packages/
  foundations/
    tokens/          @goshi/foundations-tokens    primitive + semantic tokens (colour, spacing, sizing, radius, elevation, motion)
    icons/            @goshi/foundations-icons      shared icon token contract (size, stroke width, props)

  consumer/
    tokens/          @goshi/consumer-tokens        con.* — aliases foundations + con typography
    typography/      @goshi/consumer-typography    con.typography.* (React Native)
    react-native/    @goshi/consumer-react-native  ThemeProvider, useTheme, Icon (wraps lucide-react-native)
    components/
      loader/        @goshi/consumer-components-loader   indeterminate spinner
      shimmer/       @goshi/consumer-components-shimmer  skeleton-loading sweep highlight
      button/        @goshi/consumer-components-button   3 sizes x 2 shapes x 4 variants x 5 states
      tag/           @goshi/consumer-components-tag      non-interactive status/category label
      card/          @goshi/consumer-components-card     informational card
      tile/          @goshi/consumer-components-tile     selectable/navigational tile
    patterns/          reserved — not built yet (Action Card, Media Tile next)

  enterprise/
    tokens/          @goshi/enterprise-tokens      ent.* — aliases foundations + ent typography
    typography/      @goshi/enterprise-typography  ent.typography.* — empty placeholder, see its README
    nextjs/          @goshi/enterprise-nextjs      ThemeProvider, useTheme, Icon (wraps lucide-react)
    components/       reserved — not built yet
    patterns/          reserved — not built yet

tooling/
  style-dictionary-config/  @goshi/style-dictionary-config   internal, unpublished — shared Style Dictionary build helper

docs/
  architecture/       ADRs — read these before making structural changes
```

Every leaf package under `packages/*/*` (and `packages/*/components/*` /
`packages/*/patterns/*`, one level deeper for individual
components/patterns) is independently versioned (Changesets) and
independently built (Turborepo task graph). See
[0001 — Monorepo tooling](docs/architecture/0001-monorepo-tooling.md) for why.

## Getting started

Requires Node ≥22.13 and [Corepack](https://nodejs.org/api/corepack.html)
(`corepack enable`) so the pinned pnpm version resolves automatically.

```bash
pnpm install     # installs and links every workspace package
pnpm build       # tokens:build + tsc, in dependency order, across all packages
pnpm typecheck   # tsc --noEmit across all packages
pnpm lint        # eslint across all packages
pnpm test        # vitest across all packages
```

Working on tokens specifically:

```bash
pnpm tokens:build   # rebuild generated .ts/.css token output everywhere
```

## Naming convention

`<mode>.<category>.<role>` — e.g. `con.color.background.primary`,
`ent.typography.heading.lg`, `con.spacing['16']`. The dot-path *is* the
object-access path in code — see
[0002 — Token naming convention](docs/architecture/0002-token-naming-convention.md).

## Status / what's next

Not yet started: the Action Card and Media Tile composed patterns (both
buildable now — everything they're made of already exists as a package),
a possible Chip component (mentioned in Figma prose, no node located yet),
Enterprise components, Storybook, Figma Code Connect, visual regression
testing, and an actual publish/release CI job (Changesets is configured
but nothing has shipped a release yet). See the architecture docs for what
each of those will build on top of.
