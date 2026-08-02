# @goshi/enterprise-typography

`ent.typography.*` — **intentionally empty for now.**

Per the Goshi brief, the Enterprise type scale must come from its own Figma
type system once one exists — it must **not** be a copy of
[`@goshi/consumer-typography`](../../consumer/typography)'s expressive scale.
Consumer and Enterprise serve different platforms (React Native vs. Next.js)
and user needs, so their type systems are expected to diverge.

## What's already wired up

The full pipeline is proven end-to-end even though the output is empty:

- `src/type-scale.json` — valid token source, zero tokens defined
  (`{ "ent": { "typography": {} } }`)
- `scripts/build-tokens.mjs` — runs the same Style Dictionary pipeline as
  every other tokens package
- `src/index.ts` — exports `entTypography` (currently `{}`) and a
  documentation-only `EntTextStyle` interface describing the *shape* future
  tokens are expected to take (web/CSS-oriented — rem `fontSize`, numeric
  CSS `fontWeight` — deliberately different from Consumer's RN-oriented
  `ConTextStyle`)
- A passing test suite and full TypeScript build

## Adding real tokens later

1. Get the Enterprise type system from Figma (see
   [docs/architecture/0004-figma-sync-status.md](../../../docs/architecture/0004-figma-sync-status.md)).
2. Populate `src/type-scale.json` following the same token shape pattern as
   [`@goshi/consumer-typography`'s `src/type-scale.json`](../../consumer/typography/src/type-scale.json)
   (composite `{ fontFamily, fontSize, lineHeight, fontWeight, letterSpacing }`
   values) — using Enterprise's own role names and values, not Consumer's.
3. Run `pnpm tokens:build`. No changes to the build script, package
   structure, or `@goshi/enterprise-tokens`' consumption of this package are
   required.
