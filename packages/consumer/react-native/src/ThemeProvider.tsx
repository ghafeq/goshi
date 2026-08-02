import { conByMode, type Con, type ThemeMode } from '@goshi/consumer-tokens';
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextValue {
  con: Con;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  /** Force a mode instead of following the OS colour scheme (e.g. an in-app theme toggle). */
  mode?: ThemeMode;
  children: React.ReactNode;
}

export function ThemeProvider({ mode, children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const resolvedMode: ThemeMode = mode ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const value = useMemo<ThemeContextValue>(
    () => ({ con: conByMode[resolvedMode], mode: resolvedMode }),
    [resolvedMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Returns the resolved `con.*` token tree for the current theme mode. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() must be called within a <ThemeProvider>.');
  }
  return ctx;
}
