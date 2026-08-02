// `src/generated/**` is produced by `pnpm tokens:build` (Style Dictionary) — see scripts/build-tokens.mjs.
import type { DeepWiden } from '@epds/foundations-tokens';
import { conTypography } from '@epds/consumer-typography';

import { conDark as conDarkScale } from './generated/conDark.js';
import { conLight as conLightScale } from './generated/conLight.js';

/** The full `con.*` namespace, light mode — colour + scale tokens aliased from foundations, plus typography. */
export const conLight = { ...conLightScale, typography: conTypography } as const;

/** The full `con.*` namespace, dark mode. */
export const conDark = { ...conDarkScale, typography: conTypography } as const;

export type ThemeMode = 'light' | 'dark';

/** `con.*`, keyed by theme mode — pick with `@epds/consumer-react-native`'s `ThemeProvider`. */
export const conByMode = {
  light: conLight,
  dark: conDark,
} as const;

/** Structural type of `con.*` — widened so it fits both `conLight` and `conDark` (see `DeepWiden`). */
export type Con = DeepWiden<typeof conLight>;
