// `src/generated/**` is produced by `pnpm tokens:build` (Style Dictionary) — see scripts/build-tokens.mjs.
export { conTypography } from './generated/conTypography.js';
export type { ConTypography } from './generated/conTypography.js';

/** Shape of a single resolved text style — matches React Native's `TextStyle` subset. */
export interface ConTextStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: string;
  letterSpacing: number;
}
