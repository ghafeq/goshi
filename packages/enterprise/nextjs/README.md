# @epds/enterprise-nextjs

Next.js platform integration for EPDS Enterprise.

```tsx
// app/layout.tsx (Server Component)
import '@epds/enterprise-tokens/css/ent-light.css';
import '@epds/enterprise-tokens/css/ent-dark.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const mode = getThemeModeFromCookie(); // your app's own logic
  return (
    <html lang="en" data-epds-theme={mode}>
      <body>
        <ThemeProvider mode={mode}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

```tsx
'use client';
import { useTheme, Icon } from '@epds/enterprise-nextjs';

function Card() {
  const { ent } = useTheme();
  return (
    <div style={{ background: ent.color.background.primary, padding: ent.spacing['16'] }}>
      <Icon name="Check" size="md" strokeWidth="regular" color={ent.color.icon.default} />
    </div>
  );
}
```

- `ThemeProvider` / `useTheme` — typed `ent.*` token access. Takes an
  explicit `mode` prop (SSR-safe) rather than detecting it client-side.
- **Setting `data-epds-theme`** (which scopes the generated CSS custom
  properties) is the app's responsibility, done server-side in the root
  layout, to avoid a flash of the wrong theme — this provider does not do it
  for you.
- `Icon` — wraps `lucide-react`, using
  [`@epds/foundations-icons`](../../foundations/icons) tokens so its prop
  API is identical to
  [`@epds/consumer-react-native`](../../consumer/react-native)'s `Icon`.

## Not yet covered

Visual regression / component tests need Storybook + a browser runner,
deferred to the components stage — see
[docs/architecture](../../../docs/architecture).
