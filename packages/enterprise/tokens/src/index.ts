// `src/generated/**` is produced by `pnpm tokens:build` (Style Dictionary) — see scripts/build-tokens.mjs.
import type { DeepWiden } from '@epds/foundations-tokens';
import { entTypography } from '@epds/enterprise-typography';

import { entDark as entDarkScale } from './generated/entDark.js';
import { entLight as entLightScale } from './generated/entLight.js';

/** The full `ent.*` namespace, light mode — colour + scale tokens aliased from foundations, plus typography (currently empty). */
export const entLight = { ...entLightScale, typography: entTypography } as const;

/** The full `ent.*` namespace, dark mode. */
export const entDark = { ...entDarkScale, typography: entTypography } as const;

export type ThemeMode = 'light' | 'dark';

/** `ent.*`, keyed by theme mode — pick with `@epds/enterprise-nextjs`'s `ThemeProvider`. */
export const entByMode = {
  light: entLight,
  dark: entDark,
} as const;

/** Structural type of `ent.*` — widened so it fits both `entLight` and `entDark` (see `DeepWiden`). */
export type Ent = DeepWiden<typeof entLight>;
