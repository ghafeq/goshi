# 0004 — Figma sync status: why token values are placeholders, and how to replace them

## Status

Accepted, **blocking follow-up required** (stage 1 — foundations).

## Context

The brief names three Figma files as the source of truth for this stage:

- Colour Library — https://www.figma.com/design/BOyUIrMprCdEVlZg3ySkkD/1.-Foundations--Colour-Library
- Consumer Type Sets (Expressive) — https://www.figma.com/design/5tPTGd8uF7eqODTSun5FJZ/2.2-Foundations--Type-Sets--Expressive-
- (Enterprise typography: no Figma file yet — left empty by design, see `@goshi/enterprise-typography`'s README)

The Figma MCP connector available to this environment requires an
**interactive OAuth grant**. The session this foundation was built in is
non-interactive (an automated `/loop` run) and cannot complete that OAuth
flow, so `get_variable_defs` / `get_design_context` and friends were not
reachable — there was no way to read the actual colour or type values out of
those two files.

## Decision

Proceed with the full architecture — pipeline, naming, package structure —
using **clearly-flagged placeholder values**, rather than blocking the
entire foundation stage on Figma access:

- Every placeholder token carries a `"comment"` field in its JSON
  definition, e.g. `"comment": "PLACEHOLDER — pending export from Figma
  Colour Library"`. Grep for `PLACEHOLDER` to find every one.
- Affected files:
  - `packages/foundations/tokens/src/primitive/color.json` (all ramps —
    `neutral`, `blue`, `green`, `amber`, `red`)
  - `packages/foundations/tokens/src/semantic/color.light.json` and
    `color.dark.json` (values themselves are references, but many carry a
    `"comment"` noting the accessible-pairing intent still needs a real
    contrast audit against real values)
  - `packages/consumer/typography/src/type-scale.json` (the entire Consumer
    expressive type scale)
- Non-colour, non-typography primitives (`spacing`, `sizing`, `radius`,
  `elevation`, `motion`) are **not** placeholders — no Figma file was named
  for them, and a standard 4px-grid baseline scale is safe to build against
  and refine later without a naming/shape change.
- `@goshi/enterprise-typography` is left genuinely empty (not a placeholder
  scale, not a copy of Consumer's) per the brief's explicit instruction —
  see that package's README for the exact reasoning.

## How to replace the placeholders once Figma is reachable

1. Authorize the Figma MCP connector for an interactive session (`claude
   mcp` or `/mcp`, outside this automated run).
2. For colour: use `get_variable_defs` / `get_design_context` against the
   Colour Library file to pull the real primitive ramp and semantic
   pairings. Replace the `value` (and delete the `comment`) for each
   `PLACEHOLDER`-tagged token in `primitive/color.json` and
   `semantic/color.{light,dark}.json`, keeping the existing key structure —
   the pipeline, aliasing, and every downstream package are already wired
   to that shape and need no changes.
3. For Consumer typography: same process against the Type Sets (Expressive)
   file, replacing `type-scale.json` values.
4. Run `pnpm tokens:build` (or `pnpm build` at the root) to regenerate every
   downstream `.ts`/`.css` output.
5. Run a contrast audit (e.g. `polished`'s `getContrast`/`readableColor`, or
   `@adobe/leonardo-contrast-colors`) over every pairing flagged "AA on ..."
   / "Pairs with ..." in the semantic colour comments, **before** removing
   the placeholder flags — the current pairings are structurally correct
   (a background token and its intended foreground token) but the actual
   contrast ratios are unverified.
6. For Enterprise typography, there's no "replace" step yet — see
   `@goshi/enterprise-typography`'s README for adding the first real values
   once that Figma file exists.

## Consequences

- Nothing in this foundation should ship to a real product surface until
  step 5 (contrast audit) is done — the placeholder values are internally
  consistent (light/dark are structurally parallel, ramps are monotonic)
  but not validated against WCAG AA, and are not the brand's actual colours.
- Because the pipeline, naming and package structure don't change when real
  values land, this isn't a blocking dependency for *building on top of* the
  foundation (components can be scaffolded against the token *shape* today)
  — it blocks shipping visuals, not architecture work.
