'use client';

import { entByMode, type Ent, type ThemeMode } from '@goshi/enterprise-tokens';
import React, { createContext, useContext, useMemo } from 'react';

interface ThemeContextValue {
  ent: Ent;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  /**
   * Enterprise targets SSR (Next.js), so the mode is explicit rather than
   * detected client-side — pass whatever your app's theme mechanism
   * resolves (cookie, `next-themes`, etc.) to avoid a hydration mismatch.
   */
  mode: ThemeMode;
  children: React.ReactNode;
}

/**
 * Provides typed `ent.*` token access via `useTheme()`. This does **not**
 * set the `data-goshi-theme` attribute that scopes the generated CSS custom
 * properties (`@goshi/enterprise-tokens/css/ent-light.css` /
 * `.../ent-dark.css`) — set that on `<html>`/`<body>` in your root layout,
 * server-side, so there's no flash of the wrong theme. See this package's
 * README for a copy-pasteable snippet.
 */
export function ThemeProvider({ mode, children }: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(() => ({ ent: entByMode[mode], mode }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Returns the resolved `ent.*` token tree for the current theme mode. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() must be called within a <ThemeProvider>.');
  }
  return ctx;
}
