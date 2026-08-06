# @goshi/consumer-components-tile

Selectable/navigational tile, translated 1:1 from the **Goshi Design
System (Consumer)** Figma file (`S1RGdp8FzeLvnBtxjnqBIb`, node `74:529`,
page "Cards & Tiles").

## Usage

```tsx
import { Tile } from '@goshi/consumer-components-tile';

<Tile title="Settings" body="Manage your account" icon="Settings" size="medium" onPress={openSettings} />
<Tile hierarchy="featured" title="Upgrade" onPress={openUpgrade} />
<Tile title="Coming soon" disabled />
<Tile skeleton size="medium" />
```

Same `hierarchy` / `size` / `alignment` axes as
[`@goshi/consumer-components-card`](../card) (Standard/Embedded/Featured,
Bare/Small/Medium/Large, Start/Center) — Tile adds real interaction:

- `disabled`: suppresses `onPress`; text and background both reflect it
  (see "Reduced contrast" below).
- **Focus has real Figma instances**, unlike Button's `Focused` (which has
  zero — see
  [0006](../../../../docs/architecture/0006-figma-consumer-sync.md)). The
  focus ring colour (`#0F62FE`) is driven by `./tokens.ts`'s colour table,
  not bolted on at runtime, and is identical across all three hierarchies.
- `skeleton`: loading placeholder, reuses
  [`@goshi/consumer-components-shimmer`](../shimmer). Not interactive while
  skeleton.
- No `hover` state — Tile's sibling pattern (Media Tile) has one, the base
  Tile doesn't, and RN has no native hover concept for touch anyway.

## Reduced contrast on Disabled — flagged, not fully realised

Figma's written description: "Disabled uses a dashed edge plus reduced
contrast so it does not rely on colour alone." **No built Figma instance
actually has a dashed border** — confirmed by grepping the full generated
variant set for `dashed`: zero matches, for any hierarchy. This component
follows the actual instances (reduced-contrast fill/text only, no dashed
edge), per the brief's instruction to treat variables/instances as source
of truth over prose. The accessibility intent behind the dashed edge is
real and worth revisiting with design — see
[docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md](../../../../docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md).

Also note: Standard/Embedded dim their *text* when disabled
(`text.base.inverse.subtle`); Featured keeps full-contrast light text and
lightens only the *background*. Two different strategies, both taken
directly from Figma, not reconciled into one rule here.

## Not yet covered

Render/interaction tests need the React Native Testing Library + a Jest
preset — not set up yet. `src/tokens.ts` is unit-tested against the real
`@goshi/consumer-tokens` output with exact hex values from Figma.
