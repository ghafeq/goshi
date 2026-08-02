// `entTypography` is currently `{}` — see README.md for why, and the exact
// steps to populate it once the Enterprise Figma type system is available.
export { entTypography } from './generated/entTypography.js';
export type { EntTypography } from './generated/entTypography.js';

/**
 * Target shape for a resolved Enterprise text style, once real tokens land.
 * Deliberately NOT the same shape as `@epds/consumer-typography`'s
 * `ConTextStyle` — Enterprise targets Next.js/CSS, so units and property
 * names are expected to differ (e.g. rem-based `fontSize`, numeric CSS
 * `fontWeight`) once the real values are known. This is a documentation aid
 * only; the (currently empty) generated tokens don't reference it.
 */
export interface EntTextStyle {
  fontFamily: string;
  fontSize: string;
  lineHeight: string | number;
  fontWeight: number;
  letterSpacing?: string;
}
