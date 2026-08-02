# @epds/enterprise-tokens

The `ent.*` namespace — colour, spacing, sizing, radius, elevation, motion
and typography tokens for Enterprise (Next.js), aliased from
[`@epds/foundations-tokens`](../../foundations/tokens) and
[`@epds/enterprise-typography`](../typography) (currently empty — see that
package's README).

```ts
import { entByMode } from '@epds/enterprise-tokens';

const ent = entByMode[theme]; // 'light' | 'dark'
ent.color.background.primary;
ent.spacing['16'];
```

In app code, prefer consuming this through
[`@epds/enterprise-nextjs`](../nextjs)'s `ThemeProvider` / `useTheme()`.

## What's aliased vs. Enterprise-only

Colour, spacing, sizing, radius, elevation and motion are 1:1 aliases of the
shared foundation — identical values to `@epds/consumer-tokens`' `con.*`
equivalents, just under the `ent` name (see
[docs/architecture/0005-consumer-enterprise-sharing-model.md](../../../docs/architecture/0005-consumer-enterprise-sharing-model.md)).
Typography is entirely Enterprise-owned and not yet defined.

Note: `@epds/enterprise-tokens` does **not** depend on `@epds/consumer-tokens`
(or vice versa) — both are independent siblings that each depend only on the
shared foundation. Keeping that edge absent is deliberate; see the ADR above.
