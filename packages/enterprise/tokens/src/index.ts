// `src/generated/**` is produced by `pnpm tokens:build` (Style Dictionary) — see scripts/build-tokens.mjs.
import type { DeepWiden } from '@goshi/foundations-tokens';
import { entTypography } from '@goshi/enterprise-typography';

import { entDark as entDarkScale } from './generated/entDark.js';
import { entLight as entLightScale } from './generated/entLight.js';

/** The full `ent.*` namespace, light mode — colour + scale tokens aliased from foundations, plus typography (currently empty). */
export const entLight = { ...entLightScale, typography: entTypography } as const;

/** The full `ent.*` namespace, dark mode. */
export const entDark = { ...entDarkScale, typography: entTypography } as const;

export type ThemeMode = 'light' | 'dark';

/** `ent.*`, keyed by theme mode — pick with `@goshi/enterprise-nextjs`'s `ThemeProvider`. */
export const entByMode = {
  light: entLight,
  dark: entDark,
} as const;

/** Structural type of `ent.*` — widened so it fits both `entLight` and `entDark` (see `DeepWiden`). */
export type Ent = DeepWiden<typeof entLight>;
