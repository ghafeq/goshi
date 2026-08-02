# @goshi/consumer-typography

`con.typography.*` — the Consumer (React Native) expressive type scale:
`display`, `heading`, `body`, `label`, `caption`, each resolving to an
RN-`TextStyle`-compatible object (`fontFamily`, `fontSize`, `lineHeight`,
`fontWeight`, `letterSpacing` — numbers, not `px` strings).

## ⚠️ Placeholder values

Every value in `src/type-scale.json` is a **placeholder pending sync from the
Figma Type Sets (Expressive) library**
([source file](https://www.figma.com/design/5tPTGd8uF7eqODTSun5FJZ/2.2-Foundations--Type-Sets--Expressive-)).
Figma access requires an interactive OAuth grant that wasn't available when
this foundation was scaffolded — see
[docs/architecture/0004-figma-sync-status.md](../../../docs/architecture/0004-figma-sync-status.md).
Every token is tagged with a `"comment"` field; grep for `PLACEHOLDER` before
shipping.

## Usage

```ts
import { conTypography } from '@goshi/consumer-typography';
import { Text } from 'react-native';

<Text style={conTypography.heading.lg}>Title</Text>;
```

`@goshi/consumer-tokens` re-exports this under `con.typography` so app code
can use the single `con.*` namespace end to end
(`con.typography.heading.lg`, per the Goshi naming convention).
