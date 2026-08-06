# 0007 — Figma Consumer sync: Cards & Tiles, Tag

## Status

Accepted. Second Figma sync pass (see [0006](0006-figma-consumer-sync.md)
for the first — Shimmer, Loader, Buttons). Builds on the gap analysis in
[consumer-figma-gap-audit.md](consumer-figma-gap-audit.md).

## Context

The gap audit found three Figma pieces with no implementation: **Tag**
(48 variants, non-interactive, found only by cross-reference from inside
the Action Card pattern — no page of its own), **Card** (48 variants,
informational), and **Tile** (120 variants, interactive — same axes as
Card plus Pressed/Focus/Disabled). This ADR covers building all three.

## Decision

### Token layer: a second real-data pass

- **Three new confirmed primitive families**: `green`, `yellow` (renamed
  from the still-placeholder `amber` — Figma's actual family name),
  `blue` (fully re-stepped from its old 50–950 Tailwind-style placeholder
  to Carbon-style 10–100, now with real confirmed values). Same pattern as
  0006: confirmed steps tagged `"Confirmed from Figma..."`, the rest
  Carbon-pattern-informed placeholders. `coolGray.90` — previously an
  *interpolated placeholder* in 0006 — turned out to already be exactly
  right (`#21272A`), confirmed this pass via Card/Tile's Featured
  hierarchy. That's the second time an interpolated placeholder matched
  the real value exactly, reinforcing that "Carbon Design System"
  really is this file's underlying reference palette — still not treated
  as certainty for *unconfirmed* steps, but worth naming as the working
  hypothesis.
- **`color.action.{success,info,warning}`** and **`color.action.entry`**
  (`backgroundDisabled`, `borderFocused`) added to the existing Action
  semantic branch from 0006.
- **New `color.surface.layer1.{surface,inline,overlay}`** — a semantic
  category 0006 didn't touch (Button only used Layer 2). Maps directly:
  Standard hierarchy → Surface, Embedded → Inline, Featured → Overlay.
- **New `color.tag.*` branch**, separate from `color.action.*` — Tag's
  Critical tone uses `red.60`, which is *not* the same value as Button's
  `action.danger.solid` (`red.50`). These are genuinely different Figma
  "collections" (Tag collection vs. Button collection) that both alias the
  same primitives at different steps — conflating them into one token
  would have been wrong, not just untidy.
- **Second font family confirmed: "headline" (Plus Jakarta Sans)** —
  Consumer typography was Inter-only until now.
- **New `con.typography.expressive.*` namespace** (`heading01`,
  `heading02`, `body01`, `body02`, `bodyCompact02`, `label01`,
  `labelCompact`) — Figma's own text-style names, kept deliberately
  separate from the `display`/`heading`/`body`/`label` scale added in
  Stage 1 (before Figma access), which uses a different, incompatible
  naming convention (adjective tiers like `lg`/`md`/`sm` vs. Figma's
  numbered `-01`/`-02` suffixes) and is still full of unconfirmed
  placeholder values. **These two typography namespaces are not
  reconciled** — see Consequences.

### Component decisions

- **Card and Tile share no code**, despite near-identical structure (same
  Size/Hierarchy/Alignment axes, same padding/gap/icon-size tokens). They're
  documented as separate Figma components with a real behavioural split
  (Tile is interactive, Card isn't), so each got its own package rather than
  one wrapping/extending the other — consistent with 0005's package-per-
  component philosophy. The resulting duplication (near-identical
  `resolveXSize` functions, near-identical skeleton-placeholder JSX) is
  small and contained to two files; flagged here rather than abstracted
  away, since a shared base would need to anticipate how far Tile's
  interactive requirements diverge from Card's before it's clear whether
  that abstraction holds up.
- **Skeleton placeholder colour is contextual, not universal.** Unlike
  Button (one trough colour for every variant), Card/Tile/Tag each reuse
  an *existing* semantic token for their skeleton trough rather than
  inventing a new one: light hierarchies reuse `action.entry.backgroundDisabled`,
  Featured reuses `action.secondary.solid`, Tag reuses the same
  `backgroundDisabled` value too. No new "skeleton" token was added — the
  values were already there for a different purpose and happened to match
  exactly, confirmed from Figma rather than assumed.
- **`Shimmer` needs an explicit pixel height** it can't derive from a
  flex-filled parent (documented in 0006 already) — Card/Tile/Tag's
  skeleton states compute that height from their own placeholder-block
  dimensions rather than hardcoding a guessed constant.
- **`react-native-linear-gradient` and `react-native-reanimated`**
  (introduced in 0006) needed no further additions this pass — none of
  Tag/Card/Tile use gradients or novel animation beyond the already-built
  Shimmer.

## Flagged: do not assume these

1. **Tag's 6th documented tone, "Caution," has no built Figma instance.**
   Confirmed by exhaustively checking Figma's own generated code for the
   full Tag variant set — `Caution` appears nowhere, only in the prose
   description. Implemented with 5 tones.
2. **A "Chip" component is mentioned in Tag's description** ("use a Chip
   component for interactive or dismissible behaviour") but no node was
   found for it. Not investigated exhaustively — a directed Figma URL
   would resolve this quickly if it exists.
3. **Tile's written "dashed edge" for Disabled has no built instance.**
   Grepped the full generated variant set for `dashed`: zero matches,
   across every hierarchy. The accessibility intent ("does not rely on
   colour alone") is real and worth a design follow-up, but this
   implementation doesn't fabricate a visual that isn't in the file.
4. **Tag and Card/Tile's documented sizes don't match their tokens** —
   same pattern as Button's Bare padding in 0006. Tag: written "30px
   Normal / 26px Small," actual `36px`/`24px`. Followed the tokens.

## Consequences

- **Two parallel, unreconciled typography systems now exist**:
  `con.typography.{display,heading,body,label,caption,button}` (Stage-1
  placeholder naming, values partially confirmed by 0006) and
  `con.typography.expressive.*` (Figma's real naming, fully confirmed this
  pass). A future pass should either migrate the placeholder scale onto
  Figma's real naming convention once *it's* fully confirmed, or
  explicitly document why both should stay — right now this is
  unresolved tension, not a settled design.
- Building on Card/Tile's `surface.layer1.*` tokens revealed the pattern
  Stage 1 got only two-thirds right: the general-purpose
  `background.primary/secondary/tertiary` roles from ADR 0004 are *still*
  full placeholders, now sitting alongside a *confirmed* three-surface
  system (`layer1.surface/inline/overlay`) that describes almost the same
  concept with real values. These haven't been merged — same reasoning as
  0006's Action-tokens decision: don't force-fit confirmed data into an
  unconfirmed placeholder without evidence they're the same thing.
- `packages/consumer/components/` now has 6 packages (`loader`, `shimmer`,
  `button`, `tag`, `card`, `tile`) sharing no component code but a common
  internal pattern (`resolve<X>Fill`/`resolve<X>Size` pure functions,
  tested against real `@goshi/consumer-tokens` output with exact Figma
  hex values, not mocked). Any future component should follow the same
  shape.
