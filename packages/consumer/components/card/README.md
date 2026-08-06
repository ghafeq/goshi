# @goshi/consumer-components-card

Informational card, translated 1:1 from the **Goshi Design System
(Consumer)** Figma file (`S1RGdp8FzeLvnBtxjnqBIb`, node `73:282`, page
"Cards & Tiles").

## Usage

```tsx
import { Card } from '@goshi/consumer-components-card';

<Card title="Sibu, Sarawak" body="Kuala Lumpur to Sibu" icon="MapPin" size="medium" />
<Card hierarchy="featured" alignment="center" title="Featured" body="Dark surface, centred content." />
<Card skeleton size="medium" />
```

- `hierarchy`: `'standard' | 'embedded' | 'featured'` — maps to Figma's
  confirmed `Background/Inverse/Layer 1/{Surface,Inline,Overlay}` surface
  roles. Featured is a dark surface with inverted (light) text and a
  visible border.
- `size`: `'bare' | 'small' | 'medium' | 'large'` — only padding scales;
  icon size (32px) and content gap are constant. Figma's shown heights
  (88–120px) are just the rendered height of the *default sample content*
  — this component lets height be content-driven instead of reproducing
  those as fixed values.
- `alignment`: `'start' | 'center'`.
- `skeleton`: loading placeholder, reuses
  [`@goshi/consumer-components-shimmer`](../shimmer). Placeholder colour
  differs by hierarchy (confirmed from Figma — light hierarchies use one
  shade, Featured's dark surface uses a different, lighter one for
  contrast) rather than one universal trough colour.

## No interaction states

Card is purely informational — Default and Skeleton only, no
hover/pressed/focus. For the selectable/navigational equivalent (same
Size/Hierarchy/Alignment axes, plus Pressed/Focus/Disabled), see
[`@goshi/consumer-components-tile`](../tile).

## Not yet covered

Render tests need the React Native Testing Library + a Jest preset — not
set up yet. `src/tokens.ts` is unit-tested against the real
`@goshi/consumer-tokens` output with exact values from Figma.
