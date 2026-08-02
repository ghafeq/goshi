# 0006 — Figma Consumer sync: Shimmer, Loader, Buttons

## Status

Accepted. Partial sync — scoped to the three components reviewed, not a
full Colour Library audit. **Tags could not be built — no Figma design
exists for it (see "Flagged" below).**

## Context

Stage 1 (ADR 0004) built the foundation with placeholder token values,
because the Figma MCP connector needed an interactive OAuth grant that
wasn't available in that session. This stage's session *does* have Figma
access (confirmed via `whoami`), so the brief was to review the actual
**Goshi Design System (Consumer)** Figma file
(`S1RGdp8FzeLvnBtxjnqBIb`) and translate what's there — Shimmer/Loader,
Buttons, and Tags — using its existing colour styles, text styles,
semantic tokens, variable collections, and variants as source of truth,
flagging anything missing or inconsistent rather than inventing it.

## What was reviewed

The file has exactly two top-level pages: **Buttons** (`0:1`) and
**Skimmer & Loader** (`2:6340`). No **Tags** page exists anywhere in the
file — confirmed by listing top-level pages twice and by `get_metadata`
returning the same two canvases both times. (The URL given at the start of
this task, node `30:3218`, turned out to belong to a third canvas —
"Inputs" — not top-level-listed either, and unrelated to any of the three
requested components. It wasn't investigated further since Inputs wasn't
part of the ask.)

**Buttons** (node `2:448`): 144 documented variants (3 sizes x 2 shapes x
4 variants x 6 states), of which **120 are actually built** — see
"Focused" below. Extracted via `get_design_context` (forced past the
size-based context limit) plus `get_variable_defs` for the full token set,
then cross-checked by downloading and grepping the generated reference
code for every `Size=Normal, Shape=Rectangle` state combination per
variant (the subset that isolates colour from structural sizing).

**Loader** (node `22:311`) and **Skeleton Shimmer** (node `23:209`):
extracted via `get_design_context` plus `get_motion_context` for exact
keyframe/easing/duration data, and by downloading the actual exported
Track SVG asset to confirm `stroke-width="1.5"` rather than estimate it
from the screenshot.

## Decision: sync what was confirmed, flag the rest, don't fabricate

### Token layer changes

- **Primitive colour families renamed and re-valued.** Stage 1's
  placeholder `neutral`/`blue`/`green`/`amber`/`red` scale used invented
  Tailwind-style names and 50–950 steps. The real file uses Carbon-style
  families (`Gray`, `Warm Gray`, `Cool Gray`, `Red`) at `10`–`100` steps.
  `gray`, `warmGray`, `coolGray` are new; `red` was re-stepped. Every step
  actually referenced by Buttons/Loader/Shimmer is tagged `"Confirmed from
  Figma..."` in its `comment`; every other step is a `PLACEHOLDER`
  interpolated between confirmed anchors (needed so the semantic layer,
  which spans the full ramp, still resolves — see
  `packages/foundations/tokens/src/primitive/color.json`). `blue`/`green`/
  `amber` are untouched — not reviewed this pass, since no component here
  referenced them.
- **New semantic "Action" branch** (`color.action.*`, `color.text.base.*`,
  `color.text.feedback.*` in
  `packages/foundations/tokens/src/semantic/color.action.json`, aliased to
  `con.color.action.*` / `con.color.text.base.*` /
  `con.color.text.feedback.*`) — the actual named Figma variables Buttons
  uses (`Background/Inverse/Layer 2/Action/Primary.Solid`,
  `Text/Base/Inverse/Primary`, etc.), kept **separate** from Stage 1's
  generic `background.primary`/`text.primary` placeholders rather than
  force-mapped onto them — those roles aren't the same thing, and there's
  no evidence for what the generic roles' real values should be.
- **`motion.easing.standard` was wrong, now fixed.** Stage 1 invented
  `cubic-bezier(0.2, 0, 0, 1)`; Shimmer's confirmed easing is
  `cubic-bezier(0.4, 0, 0.2, 1)`. Corrected in place since this is
  unambiguously a placeholder being replaced by real data, not a new
  concept.
- **`con.typography.button.{lg,sm}` added** — Figma's `Expressive/button-01`
  (16/24/600) and `button-02` (14/22/600) text styles, confirmed and
  distinct from every placeholder role Stage 1 invented (none matched).
  `con.typography.fontFamily.base` ("Inter") is also now confirmed rather
  than placeholder — it's the same `copy` variable Buttons uses.

### Theme-mode ambiguity — flagged, not resolved

Every token Buttons/Loader/Shimmer reference lives under Figma's
**"Inverse"** branch (`Background/Inverse/...`, `Text/Base/Inverse/...`).
No non-Inverse counterpart was found in the nodes reviewed. Three readings
are equally plausible: (a) "Inverse" *is* Consumer's default treatment for
these controls, (b) a separate light-mode token set exists elsewhere in
the file or design system that wasn't surfaced by reviewing just these two
pages, or (c) "Inverse" denotes something else entirely (e.g., these
controls are meant to always render on a dark surface regardless of app
theme). **This implementation does not guess — `color.action.*` is
theme-mode-invariant** (identical in both `semanticLight`/`semanticDark`
builds, see `packages/foundations/tokens/scripts/build-tokens.mjs`), which
is the only choice that doesn't fabricate an answer to an open question.
If Goshi's dark app theme needs different button colours, that's a
separate Figma export this session didn't have.

### New dependencies

Both introduced because approximating what they provide would be a
visible fidelity loss, not because they were convenient:

- **`react-native-linear-gradient`** — Primary's Default/Loading fill and
  Destructive's Pressed fill are true gradients in Figma, not flat
  colours. Used by `@goshi/consumer-components-button` and (for the
  shimmer highlight's 3-stop transparent→white→transparent gradient)
  `@goshi/consumer-components-shimmer`.
- **`react-native-reanimated`** (+ **`react-native-svg`**, already present)
  — drives the Loader's exact 17-keyframe arc sweep and the Shimmer's
  translate/opacity animations.

### Workspace structure

`pnpm-workspace.yaml`'s `packages` glob only reached
`packages/<mode>/<name>` (two levels). Component packages live one level
deeper (`packages/consumer/components/<name>`), so the glob gained
`packages/*/components/*` and `packages/*/patterns/*`.

## Flagged: do not assume these

1. **Tags has no Figma design.** Not built. Building it would mean
   inventing values with no source of truth, which the brief explicitly
   said to avoid. Needs a Figma page before it can be translated.
2. **`Focused` is documented (144 variants) but not built (120 instances).**
   Every `Size × Shape × Variant × State` combination was enumerated from
   the actual generated code; zero `State=Focused` instances exist.
   Implemented as a runtime focus ring instead (see the Button README's
   Accessibility section) — a reasonable accessible default, not a design
   extraction.
3. **Bare's padding is 6px in the tokens, "zero" in the prose.** The
   Buttons component's written Figma description says Bare is
   "content-height, zero padding"; the actual `button-size-bare-padding-x/y`
   tokens are `6px`. Followed the tokens (per the brief's own instruction
   that variables are the source of truth), but the two sources disagree —
   worth a design sanity-check.
4. **Two empty tokens.** `Background/Inverse/Layer 2/Action/Primary.Core`
   and `...Danger.Core` resolve to an empty value and are never used by any
   of the 120 built instances — likely an incomplete/abandoned token in the
   Figma file, not something needed here.
5. **Skeleton state's text colour is never actually visible** (label
   renders at `opacity: 0`, replaced by the Shimmer overlay), so
   `resolveButtonFill`'s `skeleton` branches reuse each variant's `default`
   text colour rather than plumbing through Figma's distinct
   `button-*-foreground-default` tokens for a value nothing renders.

## Consequences

- Colour and Consumer-typography values outside the `action`/`button`
  branches touched here are still Stage 1 placeholders — this sync didn't
  touch them, and ADR 0004's guidance still applies to them.
- Building Tags is blocked on a Figma design existing, not on engineering
  capacity.
- The next component built against this same Figma file should re-check
  whether a non-Inverse token branch has surfaced elsewhere before
  continuing to treat `action.*` as theme-invariant.
