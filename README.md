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

> **Stage 1 of the design system (current).** Foundations only — tokens,
> typography, icons. No components or patterns yet. Colour and Consumer
> typography values are **placeholders pending Figma sync** — see
> [0004 — Figma sync status](docs/architecture/0004-figma-sync-status.md)
> before using any colour or Consumer typography value in a real product
> surface.

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
    components/       reserved — not built yet
    patterns/          reserved — not built yet

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

Every leaf package under `packages/*/*` is independently versioned
(Changesets) and independently built (Turborepo task graph). See
[0001 — Monorepo tooling](docs/architecture/0001-monorepo-tooling.md) for why.

## Getting started

Requires Node ≥18.18 and [Corepack](https://nodejs.org/api/corepack.html)
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

This stage covers foundations only, per the brief. Not yet started:
components, patterns, Storybook, Figma Code Connect, visual regression
testing, and an actual publish/release CI job (Changesets is configured but
nothing has shipped a release yet). See the architecture docs for what each
of those will build on top of.
