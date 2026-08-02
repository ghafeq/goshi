/** Extracts the four control points from a `cubic-bezier(x1, y1, x2, y2)` CSS string, so the animation stays driven by `@goshi/foundations-tokens`' `primitives.motion.easing.standard` rather than a hand-duplicated constant. */
export function parseCubicBezier(css: string): [number, number, number, number] {
  const match = css.match(/cubic-bezier\(([^)]+)\)/);
  if (!match) {
    throw new Error(`Not a cubic-bezier() value: ${css}`);
  }
  const parts = match[1]!.split(',').map((n) => Number.parseFloat(n.trim()));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`Invalid cubic-bezier() value: ${css}`);
  }
  return parts as [number, number, number, number];
}

/** Strips a trailing `px` from a foundation size token (e.g. `"48px"` -> `48`) for React Native, which takes raw numbers. */
export function parsePx(value: string): number {
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid px value: ${value}`);
  }
  return n;
}

/** Converts a `#rrggbb` hex colour to an `rgba(r, g, b, a)` string, for gradient stops that need to fade to transparent *at the same hue* rather than a generic transparent black. */
export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    throw new Error(`Expected a 6-digit hex colour, got: ${hex}`);
  }
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
