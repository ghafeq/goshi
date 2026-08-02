# @goshi/consumer-react-native

React Native platform integration for Goshi Consumer.

```tsx
import { ThemeProvider, useTheme, Icon } from '@goshi/consumer-react-native';

function App() {
  return (
    <ThemeProvider>
      <Screen />
    </ThemeProvider>
  );
}

function Screen() {
  const { con } = useTheme();
  return (
    <View style={{ backgroundColor: con.color.background.primary, padding: con.spacing['16'] }}>
      <Text style={con.typography.heading.lg}>Hello</Text>
      <Icon name="Check" size="md" strokeWidth="regular" color={con.color.icon.default} />
    </View>
  );
}
```

- `ThemeProvider` / `useTheme` — resolves `con.*` for the current colour
  scheme (`useColorScheme()`), or a forced `mode` prop for an in-app toggle.
- `Icon` — wraps `lucide-react-native`, using
  [`@goshi/foundations-icons`](../../foundations/icons) tokens for `size` and
  `strokeWidth` so its prop API is identical to
  [`@goshi/enterprise-nextjs`](../../enterprise/nextjs)'s `Icon`.

## Not yet covered

Component/interaction tests for this package need a React Native testing
preset (`jest-expo` or `@testing-library/react-native` + RN's jest preset),
which is out of scope for this foundation stage — see
[docs/architecture](../../../docs/architecture) for what's deferred to the
components stage.
