# Loop: Consumer Figma gap audit

Owner: ghafeq
Status: live — 3 of 6 findings built (Tag, Card, Tile)
Created: 2026-08-02

## Job in one sentence

Compare the Goshi Design System (Consumer) Figma file against
`packages/consumer/components/*` and report which Figma components/patterns
have no corresponding implementation yet.

## Trigger

On-demand only — no cron. Re-run with:

```
/loop review the Figma file at https://www.figma.com/design/S1RGdp8FzeLvnBtxjnqBIb and update docs/architecture/consumer-figma-gap-audit.md with any components missing from packages/consumer/components
```

## Context the run reads

- Figma file `S1RGdp8FzeLvnBtxjnqBIb` ("Goshi Design System (Consumer)") —
  every page, via `get_metadata`/`get_design_context`. **The page listing
  tool is unreliable for this file** (see Guardrails) — don't trust it alone.
- `packages/consumer/components/*` — what's actually built, one directory
  per component.
- This file's own "Latest findings" section, from the previous run, to
  detect what's newly added on either side since last time.

## Work step

1. Enumerate every Figma page and every top-level component/pattern on it
   (not just what the page-listing tool reports — check component
   descriptions and cross-references too; see how Tag was found below).
2. For each, pull its variant matrix (`get_design_context` +
   `get_variable_defs`, `get_motion_context` if animated) — enough to state
   what it is and its rough size, not a full implementation-ready spec.
3. Diff against `packages/consumer/components/*`.
4. Overwrite "Latest findings" below. Append one row to "Run log".

## Check

Done means:
- [x] Every Figma page is accounted for (cross-checked beyond the
      unreliable page-listing tool)
- [x] Every top-level component AND every pattern/component referenced
      *within* another component's description is listed, not just
      page-level frames
- [x] Each Figma item is marked Built / Not built, with its
      `packages/consumer/components/<name>` path if built
- [x] Colour/typography tokens the new items reference but that don't
      exist yet in `@goshi/foundations-tokens`/`@goshi/consumer-typography`
      are called out

Verified by: manual re-read of each Figma node's description against the
actual `packages/consumer/components/` directory listing — no automated
script yet (see Guardrails).

## Stop rule

- Success: findings written, run log row appended.
- Cap: none set — a single run is a handful of Figma calls, not an
  open-ended loop.
- Escalate: if a Figma node can't be reached (auth, rate limit, deleted
  node), state that explicitly in the findings rather than silently
  omitting the item.

## Memory

File: this file (`docs/architecture/consumer-figma-gap-audit.md`).
Holds: the full findings from the most recent run, plus a log of every run.

## Guardrails

- Reversible by default: this loop only reads Figma and reads the repo —
  it never writes code or opens PRs. A human decides what to build from
  the findings.
- Never: silently trust the `get_metadata` top-level-page listing as
  complete. It has missed a real page twice now (an "Inputs" canvas, then
  a "Cards & Tiles" canvas) — always also check any node-id URL the user
  gives directly, and read every component description for
  cross-references to components that might not have their own page
  (this is exactly how **Tag** was found this run — it doesn't have a
  page, it's only referenced from inside the Action Card pattern's
  description).
- Cost check: each run costs roughly 5-10 Figma tool calls plus token
  budget for a couple of large `get_design_context` responses (100-250K
  chars each, handled via the saved-file + `jq`/`grep` extraction pattern,
  not read in full) — cheap enough to not need a cap.

## Run it

```
/loop review the Figma file at https://www.figma.com/design/S1RGdp8FzeLvnBtxjnqBIb and update docs/architecture/consumer-figma-gap-audit.md with any components missing from packages/consumer/components
```

Stop it: nothing to stop — it's on-demand, not scheduled. Just don't run it.

---

## Latest findings (as of 2026-08-02)

Reviewed pages: **Buttons** (`0:1`), **Skimmer & Loader** (`2:6340`),
**Cards & Tiles** (`64:2120`) — confirmed complete by asking the user
directly, since the page-listing tool undercounts (see Guardrails).
Also reviewed **Tag**, found only via cross-reference from within the
Action Card pattern's description, not from any page listing.

### Built (`packages/consumer/components/`)

| Figma component | Node | Package |
|---|---|---|
| Loader | `22:311` | `@goshi/consumer-components-loader` |
| Skeleton Shimmer | `23:209` | `@goshi/consumer-components-shimmer` |
| Buttons | `2:448` | `@goshi/consumer-components-button` |
| Tag | `2:6442` | `@goshi/consumer-components-tag` (5 of 6 documented tones — no `Caution` instance, see 0007) |
| Card | `73:282` | `@goshi/consumer-components-card` |
| Tile | `74:529` | `@goshi/consumer-components-tile` |

### Not built

| Figma component | Node | Variants | Notes |
|---|---|---|---|
| **Card/Pattern/Action Card** | `75:310` | Header: Media/None × State: Default/Skeleton | Composed pattern built from Card + two Buttons + a Tag (status badge) + eyebrow/favicon row. Everything it's built from now exists as a package — this is the next natural target. |
| **Tile/Pattern/Media Tile** | `75:460` | Orientation: Horizontal/Vertical × State: Default/Hover/Focus/Disabled/Skeleton | Composed pattern built from Tile. Focus border colour confirmed as `#0F62FE` — now the real, shared `con.color.action.entry.borderFocused` token (see 0007), not a placeholder. |
| **Chip** | *not located* | — | Mentioned only in prose in Tag's description ("use a Chip component for interactive or dismissible behaviour") — no node ID found, may not exist yet in Figma. Still not investigated further — a directed URL from the user would resolve this fast if it does exist. |

### Token-layer findings from the 2026-08-06 pass — now resolved

The findings listed after the first run (new font family, new text styles,
new surface/Entry/Warning tokens, the `blue.60` focus-ring value) were all
synced into `@goshi/foundations-tokens` and `@goshi/consumer-typography`
while building Tag/Card/Tile. Full detail in
[0007](0007-figma-consumer-sync-cards-tiles-tag.md), including what's
*still* unresolved (two parallel, unreconciled typography naming systems;
the general-purpose `background.primary` placeholder roles from ADR 0004
still not reconciled with the now-confirmed `surface.layer1.*` roles).

## Run log

| Date | Result | Notes |
|---|---|---|
| 2026-08-02 | Found 6 gaps | Tag, Card, Tile, Action Card pattern, Media Tile pattern not built; Chip mentioned but not located. First run — no prior findings to diff against. |
| 2026-08-06 | Built 3 of 6 | Tag, Card, Tile built (see 0007) — token layer extended with real green/yellow/blue primitives, new Action/surface/Tag semantic branches, and a second (Figma-real) typography namespace. Action Card pattern, Media Tile pattern, and Chip remain — not a fresh Figma re-review, just status updated against the 2026-08-02 findings. |
