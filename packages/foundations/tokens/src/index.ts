// `src/generated/**` is produced by `pnpm tokens:build` (Style Dictionary) — see scripts/build-tokens.mjs.
// Run the build before typechecking or importing this package locally.
import { semanticDark } from './generated/semanticDark.js';
import { semanticLight } from './generated/semanticLight.js';

export { primitives } from './generated/primitives.js';
export type { Primitives } from './generated/primitives.js';

export { semanticLight } from './generated/semanticLight.js';
export type { SemanticLight } from './generated/semanticLight.js';

export { semanticDark } from './generated/semanticDark.js';
export type { SemanticDark } from './generated/semanticDark.js';

export type ThemeMode = 'light' | 'dark';

/** Semantic color tokens keyed by theme mode — the basis for theme switching. */
export const semanticByMode = {
  light: semanticLight,
  dark: semanticDark,
} as const;

/**
 * Widens every literal leaf type in a token tree (`"#FFFFFF"` → `string`,
 * `16` → `number`, …) while preserving its nested shape. Every generated
 * token module is `as const`, so `typeof someLight` and `typeof someDark`
 * are each pinned to their own theme's literal values — without widening,
 * a type like `typeof someLight` can't accept `someDark` (or vice versa)
 * even though they're structurally identical. Used by `@goshi/consumer-tokens`
 * and `@goshi/enterprise-tokens` to type their light/dark-agnostic `Con` /
 * `Ent` exports.
 */
export type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly DeepWiden<U>[]
        : T extends object
          ? { readonly [K in keyof T]: DeepWiden<T[K]> }
          : T;
