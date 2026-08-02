# @goshi/consumer-components-button

Button, translated 1:1 from the **Goshi Design System (Consumer)** Figma
file (`S1RGdp8FzeLvnBtxjnqBIb`, node `2:448` — page "Buttons"). 3 sizes x 2
shapes x 4 variants x 5 built states.

## Usage

```tsx
import { Button } from '@goshi/consumer-components-button';
import { ThemeProvider } from '@goshi/consumer-react-native';

function Example() {
  return (
    <ThemeProvider>
      <Button variant="primary" size="normal" shape="rectangle" label="Continue" leadingIcon="Check" onPress={handleContinue} />
      <Button variant="destructive" label="Delete account" onPress={handleDelete} />
      <Button variant="tertiary" size="bare" leadingIcon="X" accessibilityLabel="Close" onPress={handleClose} />
      <Button variant="primary" label="Saving…" loading />
      <Button variant="secondary" label="Loading placeholder" skeleton />
    </ThemeProvider>
  );
}
```

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive'` | `'primary'` | |
| `size` | `'normal' \| 'small' \| 'bare'` | `'normal'` | 48 / 38 / content-height |
| `shape` | `'rectangle' \| 'pill'` | `'rectangle'` | |
| `label` | `string` | — | |
| `leadingIcon` / `trailingIcon` | `IconName` (from `@goshi/consumer-react-native`) | — | Rendered via the shared `Icon` at the button's resolved size/colour — you don't size or colour icons yourself. |
| `disabled` | `boolean` | `false` | |
| `loading` | `boolean` | `false` | Shows the `Loader` overlay; label/icons stay laid out at `opacity: 0` so the button doesn't resize. Suppresses interaction. |
| `skeleton` | `boolean` | `false` | Shows the `Shimmer` skeleton placeholder. Suppresses interaction. |
| `fullWidth` | `boolean` | `false` | Figma: "Hug width; use native Fill container for full width." |
| ...rest | `PressableProps` | — | Anything else (`onPress`, `onLongPress`, `accessibilityLabel` override, etc.) passes through to the underlying `Pressable`. |

## Composition

Button composes two sibling primitives rather than reimplementing their
animations:

- [`@goshi/consumer-components-loader`](../loader) for the `loading` overlay
- [`@goshi/consumer-components-shimmer`](../shimmer) for the `skeleton`
  overlay

Both are usable standalone too — see their own READMEs.

## Accessibility

- `accessibilityRole="button"`, `accessibilityLabel` (defaults to `label`,
  override for icon-only buttons — see the `Close` example above),
  `accessibilityState={{ disabled, busy: loading }}`.
- Interaction (`onPress`, `Pressable`'s ripple/highlight) is suppressed
  whenever `disabled`, `loading`, or `skeleton` is true.
- **Focus ring.** No Figma design exists for a `Focused` state (see below),
  so this is a from-scratch implementation: a 2px ring recoloured to
  `con.color.border.focus` on `onFocus`/`onBlur`, replacing rather than
  augmenting the button's own border. This is a reasonable, WCAG-compliant
  approach (a visible, sufficient-contrast state change) but hasn't been
  reviewed by design — flag it if a different treatment is wanted.

## Flagged: what's *not* a direct Figma translation

Everything below is called out because the brief asked to flag rather than
silently assume. Full detail in
[docs/architecture/0006-figma-consumer-sync.md](../../../../docs/architecture/0006-figma-consumer-sync.md).

1. **`Focused` has no Figma instance.** The component description documents
   144 variants (3 size x 2 shape x 4 variant x 6 state, including
   `Focused`), but only 120 are actually built in the file (state = Default
   / Pressed / Disabled / Loading / Skeleton). `Focused` is a from-scratch
   focus ring, not extracted from a design.
2. **`Bare`'s padding is 6px, not "zero".** The component's written Figma
   description says Bare is "content-height, zero padding," but the actual
   `button-size-bare-padding-x/y` tokens are `6px`. The tokens win, per the
   brief's own instruction — but the two sources disagree, worth a design
   sanity-check.
3. **Bare has no fixed height token.** Normal (48px) and Small (38px) both
   have one; Bare is genuinely content-driven. The Skeleton overlay's height
   for Bare is *computed* (`icon + 2×padding + 2×border`), not read from a
   token — an approximation, not an extraction.
4. **Gradients, not flat fills.** Primary's Default/Loading and
   Destructive's Pressed are gradients, not flat colours — rendered with
   `react-native-linear-gradient` (a new dependency this package
   introduces, for the same reason Shimmer does: approximating a gradient
   as a flat colour would be a visible fidelity loss).
5. **The two empty "Core" tokens** (`Background/Inverse/Layer 2/Action/Primary.Core`
   and `...Danger.Core`) in Figma's variable set were never used by any of
   the 120 built instances and resolve to an empty value — likely an
   incomplete/abandoned token in the Figma file itself, not something this
   implementation needed.

## Not yet covered

Render/interaction tests need the React Native Testing Library + a Jest
preset — not set up yet. `src/tokens.ts` (the full colour/size resolver
logic, the part with real behaviour to get wrong) is unit-tested against
the actual `@goshi/consumer-tokens` output with Vitest, asserting exact hex
values extracted from Figma — see `src/__tests__/tokens.test.ts`.
