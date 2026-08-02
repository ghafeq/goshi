# @goshi/consumer-components-loader

Indeterminate spinner, translated 1:1 from the **Goshi Design System
(Consumer)** Figma file (`S1RGdp8FzeLvnBtxjnqBIb`, node `22:311` — page
"Skimmer & Loader"). Standalone use, and used internally by
[`@goshi/consumer-components-button`](../button)'s `Loading` state.

## Usage

```tsx
import { Loader } from '@goshi/consumer-components-loader';
import { useTheme } from '@goshi/consumer-react-native';

function Example() {
  const { con } = useTheme();
  return <Loader size="md" color={con.color.text.base.inverse.primary} label="Loading results" />;
}
```

- `size`: `'sm' | 'md' | 'lg'` (16 / 20 / 24px — Figma's Small/Medium/Large,
  reusing `@goshi/foundations-icons`' size scale directly) or a raw number.
- `color`: **required**. Loader has no theme dependency of its own — it's a
  pure/presentational primitive, so it stays reusable outside any specific
  themed context. The arc renders at full opacity; the track renders at the
  same colour, per Figma's spec ("Track is the static 10% ring").
- `label`: accessible label (`accessibilityRole="progressbar"`), defaults to
  `"Loading"`.

## Implementation notes

- Arc sweep is driven by `react-native-reanimated` (`useAnimatedProps` on an
  animated `react-native-svg` `<Circle>`), interpolating through the exact
  17-keyframe `strokeDasharray`/`strokeDashoffset` track pulled from Figma's
  motion data (1311ms, linear, looping) — see `src/keyframes.ts`, which is
  unit-tested in isolation from rendering.
- Stroke width (`1.5`) was confirmed by downloading and inspecting the
  actual exported Track SVG asset, not estimated from the screenshot.
- **No reduced-motion gating.** Figma's component description for the
  Loader (unlike Shimmer) doesn't call for one, and a small contained
  spinner is broadly outside the class of motion prefers-reduced-motion
  guidance targets. Flagged in
  [docs/architecture/0006-figma-consumer-sync.md](../../../../docs/architecture/0006-figma-consumer-sync.md)
  if this needs revisiting.

## Not yet covered

Render/interaction tests need the React Native Testing Library + a Jest
preset (`jest-expo` or RN's own preset) — not set up yet, see the root
README's architecture notes. `src/keyframes.ts`'s pure interpolation math is
unit-tested with Vitest in the meantime.
