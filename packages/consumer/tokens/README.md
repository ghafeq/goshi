# @goshi/consumer-tokens

The `con.*` namespace — colour, spacing, sizing, radius, elevation, motion
and typography tokens for Consumer (React Native), aliased from
[`@goshi/foundations-tokens`](../../foundations/tokens) and
[`@goshi/consumer-typography`](../typography).

```ts
import { conByMode } from '@goshi/consumer-tokens';

const con = conByMode[colorScheme]; // 'light' | 'dark'
con.color.background.primary;
con.typography.heading.lg;
con.spacing['16'];
```

In app code, prefer consuming this through
[`@goshi/consumer-react-native`](../react-native)'s `ThemeProvider` /
`useTheme()`, which picks the right mode automatically.

## What's aliased vs. Consumer-only

Colour, spacing, sizing, radius, elevation and motion are 1:1 aliases of the
shared foundation (see
[docs/architecture/0005-consumer-enterprise-sharing-model.md](../../../docs/architecture/0005-consumer-enterprise-sharing-model.md)).
Typography is entirely Consumer-owned — see
[`@goshi/consumer-typography`](../typography)'s README for its placeholder
status pending Figma sync.
