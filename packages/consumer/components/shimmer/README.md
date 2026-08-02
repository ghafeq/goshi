# @goshi/consumer-components-shimmer

Sweeping skeleton-loading highlight, translated from the **Goshi Design
System (Consumer)** Figma file (`S1RGdp8FzeLvnBtxjnqBIb`, node `23:209`
"Skeleton Shimmer" — page "Skimmer & Loader"). Standalone use, and used
internally by [`@goshi/consumer-components-button`](../button)'s `Skeleton`
state.

## Usage

```tsx
import { Shimmer } from '@goshi/consumer-components-shimmer';
import { useTheme } from '@goshi/consumer-react-native';
import { View } from 'react-native';

function SkeletonRow() {
  const { con } = useTheme();
  return (
    <View style={{ backgroundColor: con.color.action.secondary.subtle, borderRadius: con.radius.md }}>
      <Shimmer size="md" />
    </View>
  );
}
```

- `size`: `'sm' | 'md' | 'lg'` (32 / 48 / 56px row height — Figma's
  Small/Medium/Large) or a raw number.
- **Transparent by design.** Shimmer draws no background — place it over
  whatever trough/placeholder surface colour your skeleton state uses.
- `highlightColor` / `highlightOpacity`: default to white at 55% opacity
  (Figma's confirmed value), which reads correctly against the dark
  (`warmGray`/`coolGray`) trough colours seen in Button's Skeleton state.
  Override for a light trough.
- `motionFallback`: `'pulse'` (default) or `'static'` — see below.

## Implementation notes

- **Gradient travel is measured, not fixed.** Figma's reference animates a
  literal `+480px` translate calibrated for its 340px example row. A real
  skeleton row can be any width, so this component measures itself via
  `onLayout` and travels `width + 2 * bandWidth` instead — the same
  geometry (the band starts and ends fully off-screen) generalised to any
  size, rather than copying a pixel constant that only worked for one
  reference width.
- **New dependency: `react-native-linear-gradient`.** Figma's highlight is a
  true 3-stop gradient (transparent → white 55% → transparent). React
  Native has no built-in gradient primitive, and approximating it with a
  flat semi-transparent block would be a real visual deviation from the
  design — so this package adds `react-native-linear-gradient` as a peer
  dependency rather than fake the effect. Flagged per the brief's
  instruction to document any new dependency/value introduced.
- **Reduced motion — Figma explicitly calls for this one** ("Honour
  motion/reduced-motion by holding static or pulsing opacity instead" — a
  note present on Shimmer's component description but *not* on Loader's,
  which is why Loader doesn't have equivalent handling). `motionFallback`
  implements both options Figma named:
  - `'pulse'` (default): band holds its centred resting position, opacity
    breathes 0.3↔0.7 over 900ms.
  - `'static'`: band holds its centred resting position at a fixed 50%
    opacity, no animation at all.
- Easing (`cubic-bezier(0.4, 0, 0.2, 1)`) and duration (1600ms) are
  confirmed from Figma's motion data and pulled from
  `@goshi/foundations-tokens`' `primitives.motion.easing.standard` — see
  [docs/architecture/0006-figma-consumer-sync.md](../../../../docs/architecture/0006-figma-consumer-sync.md)
  for why that token's value changed during this sync (it was a different,
  incorrect placeholder before).

## Not yet covered

Render/interaction tests need the React Native Testing Library + a Jest
preset — not set up yet. `src/tokens.ts`'s pure helpers (bezier parsing, px
parsing, hex-to-rgba) are unit-tested with Vitest in the meantime.
