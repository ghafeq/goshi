# @goshi/foundations-tokens

Shared primitive and semantic design tokens for Goshi. Platform-agnostic — plain
TypeScript objects and CSS custom properties, no React or React Native
dependency. Consumed by `@goshi/consumer-tokens` and `@goshi/enterprise-tokens`,
which alias these into the `con.*` / `ent.*` namespaces.

## ⚠️ Colour values are placeholders

Every primitive and semantic colour token in `src/primitive/color.json` and
`src/semantic/color.*.json` is a **placeholder pending sync from the Figma
Colour Library**
([source file](https://www.figma.com/design/BOyUIrMprCdEVlZg3ySkkD/1.-Foundations--Colour-Library)).
Figma access requires an interactive OAuth grant that wasn't available when
this foundation was scaffolded — see
[docs/architecture/0004-figma-sync-status.md](../../../docs/architecture/0004-figma-sync-status.md)
for the exact blocker and the process to replace these values once Figma
variables can be read. Every placeholder is tagged with a `"comment"` field
in its token definition so it's easy to grep for `PLACEHOLDER` and confirm
nothing placeholder-y ships un-reviewed.

Spacing, sizing, radius, elevation and motion primitives are **not**
placeholders — they're a standard 4px-grid baseline scale, safe to build
against today and to refine later.

## Structure

```
src/
  primitive/   # color, spacing, sizing, radius, elevation, motion — context-free values
  semantic/    # color.light.json / color.dark.json — intent-based tokens (background, text,
               # border, icon, feedback, interactive) that alias primitives
  generated/   # gitignored — output of `pnpm tokens:build` (Style Dictionary)
build/css/     # gitignored — generated CSS custom properties
```

## Naming & accessibility

Semantic tokens follow `color.<category>.<role>`, e.g. `color.background.primary`,
`color.feedback.danger.foreground`. Tokens intended to pair for accessible
contrast (a background with the text/icon colour meant to sit on it) are
documented via inline `"comment"` fields — search for "Pairs with" and "AA on".
Once real values land from Figma, run a contrast audit (e.g. via
`@adobe/leonardo-contrast-colors` or `polished`'s `readableColor`/`getContrast`)
before removing the placeholder flags.

## Build

```bash
pnpm tokens:build   # Style Dictionary → src/generated/*.ts + build/css/*.css
pnpm build          # tokens:build + tsc
pnpm test           # vitest sanity checks over the resolved token tree
```
