# @goshi/consumer-components-tag

Non-interactive status/category/metadata label, translated from the
**Goshi Design System (Consumer)** Figma file (`S1RGdp8FzeLvnBtxjnqBIb`,
node `2:6442`). Not on any page — only discoverable by cross-reference
from within the Action Card pattern's description. See
[docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md](../../../../docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md).

## Usage

```tsx
import { Tag } from '@goshi/consumer-components-tag';

<Tag label="Delayed" tone="pending" icon="Clock" />
<Tag label="Confirmed" tone="positive" emphasis="subtle" shape="pill" />
<Tag skeleton skeletonWidth={90} />
```

- `tone`: `'positive' | 'critical' | 'neutral' | 'pending' | 'muted'` —
  **not** the 6th tone Figma's prose documents, `'caution'`, which has no
  built instance anywhere in the file. Flagged, not guessed.
- `size`: `'normal' | 'small'` (36px / 24px — the written Figma description
  says 30px/26px, the actual tokens say 36px/24px; the tokens win).
- `shape`: `'sharp' | 'pill'`.
- `emphasis`: `'solid' | 'subtle'`.
- `icon`: optional Lucide icon name, coloured to match the tag's text.
  Figma's own defaults per tone: `circle-check` (positive), `triangle-alert`
  (caution), `circle-alert` (critical), `info` (neutral), `clock`
  (pending), `minus` (muted) — pass these explicitly, they aren't wired up
  as tone-implied defaults here.
- `skeleton` / `skeletonWidth`: loading placeholder. **`skeletonWidth` has
  no Figma-derived default** — a skeleton tag has no label to size itself
  against, so the caller must say how wide the eventual tag is expected to
  be.

## Not interactive

No press/focus states — matches Figma's explicit description ("Not
interactive — no hover/pressed/focus; use a Chip component for interactive
or dismissible behaviour"). **Chip doesn't exist in the Figma file yet** —
mentioned only in this prose, no node found. If you need an interactive or
dismissible tag-like control today, this isn't it.

## Not yet covered

Render tests need the React Native Testing Library + a Jest preset — not
set up yet. `src/tokens.ts` is unit-tested against the real
`@goshi/consumer-tokens` output with exact hex values from Figma.
