# 0005 — Consumer/Enterprise sharing & override model

## Status

Accepted (stage 1 — foundations).

## Context

Consumer (`con`, React Native) and Enterprise (`ent`, Next.js) must "share
the same core foundation libraries wherever possible," while their
"typography, components and interaction patterns may differ based on their
platforms and user needs." This ADR is the explicit answer to "what exactly
is shared, what's platform-owned, and where's the line."

## Decision

### Dependency direction (one-way, no exceptions)

```
@goshi/foundations-tokens  @goshi/foundations-icons
        ▲                          ▲
        │                          │
@goshi/consumer-tokens       @goshi/enterprise-tokens
        ▲                          ▲
@goshi/consumer-react-native  @goshi/enterprise-nextjs
```

`consumer/*` and `enterprise/*` packages depend **only** downward, on
`foundations/*` — never on each other. `@goshi/enterprise-tokens` does not
depend on `@goshi/consumer-tokens`, and vice versa, even for tests (an
earlier draft of the enterprise-tokens test suite imported consumer-tokens
for a "parity check" and that dependency was deliberately removed — see the
test file's history). This is what makes "Enterprise gets its own
typography system, not a copy of Consumer's" structurally true rather than
a convention someone has to remember.

### What's shared (identical values, same source)

| Category | Shared? | Where defined |
|---|---|---|
| Colour (primitive + semantic) | Yes, 1:1 | `foundations/tokens/src/{primitive,semantic}` |
| Spacing / sizing / radius / elevation | Yes, 1:1 | `foundations/tokens/src/primitive` |
| Motion (duration/easing) | Yes, 1:1 | `foundations/tokens/src/primitive/motion.json` |
| Icon tokens (size, stroke width, prop contract) | Yes, 1:1 | `foundations/icons` |

`con.color.background.primary` and `ent.color.background.primary` resolve
to the **exact same value** — both are aliases (Style Dictionary references)
into the one semantic definition. There is currently no per-platform colour
override mechanism, by design: a colour override would mean the same
semantic intent ("primary background") looks different per platform, which
isn't a documented product requirement. If that need arises, it should be a
new ADR (a `con`-only or `ent`-only semantic addition), not a silent
divergence in the alias files.

### What's platform-owned (may diverge completely)

| Category | Shared? | Where defined |
|---|---|---|
| Typography | No | `consumer/typography` vs. `enterprise/typography` — separate packages, separate token sources, no shared values (enterprise's is currently empty — ADR 0004) |
| Components | No (not built yet) | `consumer/components/*` vs. `enterprise/components/*` |
| Patterns | No (not built yet) | `consumer/patterns/*` vs. `enterprise/patterns/*` |
| Icon *rendering* | No — same contract, different implementation | `consumer/react-native` wraps `lucide-react-native`; `enterprise/nextjs` wraps `lucide-react` |

Icons are the interesting middle case: the **contract** (`IconTokenProps`,
`iconSize`, `iconStrokeWidth`) is fully shared from `@goshi/foundations-icons`
so both platforms expose an identical `<Icon name="..." size="md"
strokeWidth="regular" color={...} label="..." />` API — but the concrete
`<Icon>` component is implemented separately per platform because bundling
both `lucide-react` and `lucide-react-native` into either platform would be
dead weight, and RN/DOM rendering are fundamentally different anyway.

### "Override," concretely

There is no runtime override mechanism (no theme-merging, no
`extendTokens()`) — because there's nothing to override yet. Each
`consumer/*` or `enterprise/*` alias file (`alias.color.json`,
`alias.scale.json`) explicitly re-declares every token it exposes, even
though today the value is always a straight reference to the shared
semantic/primitive token. That's deliberate: the day a platform genuinely
needs a different value for one token, the fix is a one-line change in that
platform's alias file (a literal value instead of a `{color.x.y.value}`
reference) — no new mechanism, no new package, no change to the pipeline in
ADR 0003. The architecture is already override-ready without speculative
override *code* existing today.

## Consequences

- Reviewers can rely on "no cross-imports between `consumer/*` and
  `enterprise/*`" as a structural invariant, not just a guideline — it shows
  up as a missing edge in `pnpm-workspace.yaml`'s dependency graph, catchable
  by `pnpm why` / a future `pnpm -r exec` lint check.
- Adding a genuinely platform-specific *semantic* colour token (not just
  typography/components) is possible without restructuring — add it only to
  the one platform's `alias.color.json` — but should be treated as a
  deliberate exception worth a line in this ADR's changelog, since the
  starting assumption is "colour is shared."
