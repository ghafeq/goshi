/**
 * Platform-agnostic icon contract shared by Consumer (react-native) and
 * Enterprise (nextjs). This package owns *tokens and types only* — no
 * rendering, no dependency on `lucide-react` or `lucide-react-native`. Each
 * platform package implements the actual `<Icon />` using its own Lucide
 * package and these tokens/types.
 */

/** Supported stroke widths, per design requirement: 1px / 1.5px / 2px. */
export const iconStrokeWidth = {
  thin: 1,
  regular: 1.5,
  bold: 2,
} as const;

export type IconStrokeWidthToken = keyof typeof iconStrokeWidth;

/** Icon size scale, in density-independent pixels. */
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSizeToken = keyof typeof iconSize;

/**
 * Props every platform `<Icon />` implementation accepts — this is the
 * "consistent icon API" the design requires. `size` and `strokeWidth` take
 * either a token name or a raw number (escape hatch); `color` takes a
 * resolved colour value (typically `con.color.icon.default` /
 * `ent.color.icon.default` or a feedback colour). `label` is the one prop
 * each platform maps to its own accessibility API internally
 * (`accessibilityLabel` on React Native, `aria-label` on the web) so callers
 * write the same prop name on both platforms.
 */
export interface IconTokenProps {
  size?: IconSizeToken | number;
  strokeWidth?: IconStrokeWidthToken | number;
  color?: string;
  /** Accessible label; omit to treat the icon as decorative. */
  label?: string;
}

export function resolveIconSize(size: IconSizeToken | number = 'md'): number {
  return typeof size === 'number' ? size : iconSize[size];
}

export function resolveIconStrokeWidth(strokeWidth: IconStrokeWidthToken | number = 'regular'): number {
  return typeof strokeWidth === 'number' ? strokeWidth : iconStrokeWidth[strokeWidth];
}
