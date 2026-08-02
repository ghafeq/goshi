# 0003 — Token pipeline: Style Dictionary + a custom nested-output format

## Status

Accepted (stage 1 — foundations).

## Context

Tokens need to reach two very different runtimes from one source of truth:
React Native (plain JS numbers/strings, no CSS) and Next.js (CSS custom
properties for zero-JS theming, plus TS for typed access). They also need to
survive being regenerated repeatedly as real values arrive from Figma
(automated token generation, future Figma variable mapping — both called
out as requirements this architecture must support).

## Decision

**Style Dictionary v4** as the build pipeline, driven by a small shared
package, `@goshi/style-dictionary-config` (`tooling/style-dictionary-config`,
unpublished), used by every tokens package
(`foundations/tokens`, `consumer/tokens`, `consumer/typography`,
`enterprise/tokens`, `enterprise/typography`). It was factored out once a
fourth package needed the identical custom format — see "three similar
files, then extract" in the repo's working style.

### Source → output layering

```
foundations/tokens/src/primitive/*.json      (color ramps, spacing, sizing, radius, elevation, motion)
        │
        ▼
foundations/tokens/src/semantic/color.{light,dark}.json   (background/text/border/... — references primitives)
        │
        ├──────────────────────────────┐
        ▼                              ▼
consumer/tokens/src/alias.*.json   enterprise/tokens/src/alias.*.json
   (con.* — references semantic)      (ent.* — references semantic)
```

Each package's `scripts/build-tokens.mjs` calls
`buildTokenVariant()` once per "variant" it needs (e.g. light/dark), passing
Style Dictionary `source` globs — including, for `consumer/tokens` and
`enterprise/tokens`, a **relative path into `foundations/tokens/src/`**.
This is a build-time-only coupling (reading source JSON directly, not
importing built output), declared as a `workspace:*` dependency in
`package.json` mainly for documentation/graph-correctness, not because the
build strictly requires package-level build ordering.

### The custom `nested/module` format

Style Dictionary's built-in JS/TS formats flatten and camelCase token names
(`ColorBackgroundPrimary`). That's incompatible with the dot-path convention
in ADR 0002 — `con.color.background.primary` needs to survive as *nested
object access*, not become one flattened identifier. `nested/module`
(`tooling/style-dictionary-config/src/index.mjs`) instead walks
`dictionary.allTokens` and rebuilds a plain nested object from each token's
`path` array, optionally stripping a prefix (`stripPrefix: ['con']` so the
generated `conLight.ts` starts at `color`/`spacing`/…, not
`conLight.con.color`).

It builds from `allTokens`, not `dictionary.tokens` — Style Dictionary's
per-file `filter` option is only reliably guaranteed to filter
`allTokens`; the nested `tokens` tree handed to a format callback is not
guaranteed pre-filtered. Building from `allTokens` + each token's `path`
sidesteps that ambiguity entirely.

### Two outputs per variant

- **TypeScript** (`src/generated/<name>.ts`) — `export const <name> = {...} as const` plus a matching type, for RN inline styles and any TS/JS consumer.
- **CSS custom properties** (`build/css/<name>.css`, via the built-in
  `css/variables` format, `outputReferences: true` so semantic tokens emit
  `var(--goshi-color-blue-500)` rather than a duplicated hex value) — for
  Next.js, scoped by a `[data-goshi-theme="light|dark"]` selector.

Both are generated, gitignored (`src/generated/`, `build/`), and rebuilt by
`pnpm tokens:build` — never hand-edited.

## Consequences

- Any package building tokens needs `pnpm tokens:build` to run before
  `tsc`/tests can see `src/generated/*.ts` — encoded once in each package's
  own `build`/`typecheck`/`test` scripts, and in `turbo.json`'s task
  dependencies (`typecheck`/`test` depend on `["^build", "build"]`, i.e.
  upstream packages' build *and* the package's own build/tokens step).
- Composite token values (e.g. a typography role's
  `{fontFamily, fontSize, lineHeight, fontWeight, letterSpacing}` object)
  work with this pipeline as-is — Style Dictionary resolves `{...}`
  references anywhere inside a composite value, and the custom format
  passes the resolved object through unchanged.
- Automated Figma → token sync (a named future requirement) becomes "write
  a script that overwrites the `value`/`comment` fields in the primitive and
  semantic JSON, then run the existing `tokens:build`" — no pipeline changes
  needed, only a new input source. See ADR 0004.
