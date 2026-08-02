import type { Con } from '@goshi/consumer-tokens';
import type { ConTextStyle } from '@goshi/consumer-typography';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
export type ButtonSize = 'normal' | 'small' | 'bare';
export type ButtonShape = 'rectangle' | 'pill';
/**
 * "focused" is deliberately not part of this list — see `README.md` and
 * `docs/architecture/0006-figma-consumer-sync.md`. Figma's own component
 * description names it as one of 6 documented states (3 x 2 x 4 x 6 = 144
 * variants), but zero `State=Focused` instances exist among the 120 actually
 * built in the file (3 x 2 x 4 x 5). It's layered separately as a focus
 * ring on top of whichever of these 5 states is otherwise active.
 */
export type ButtonState = 'default' | 'pressed' | 'disabled' | 'loading' | 'skeleton';

/** Strips a trailing `px` from a foundation size/spacing token for React Native, which takes raw numbers. */
export function parsePx(value: string): number {
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid px value: ${value}`);
  }
  return n;
}

export interface ButtonFill {
  /** Flat colour, or a top-to-bottom gradient pair — Figma uses a gradient for Primary Default/Loading and Destructive Pressed. */
  background: string | { from: string; to: string };
  border: string;
  /**
   * Foreground for label/icons. During `loading`/`skeleton` this is never
   * actually visible (label and icons render at `opacity: 0`, replaced by
   * the Loader/Shimmer overlay) — Figma names distinct tokens for those
   * rows (`button-*-foreground-default`) but since they're invisible by
   * construction, this resolver reuses each variant's `default` text colour
   * rather than plumbing through values nothing ever renders.
   */
  text: string;
}

/**
 * Variant x State -> {background, border, text}, extracted 1:1 from Figma
 * (`get_design_context` on node 2:448, file S1RGdp8FzeLvnBtxjnqBIb — the
 * "Size=Normal, Shape=Rectangle" subset of the 120 built instances; colour
 * does not vary by Size/Shape, only by Variant x State). See
 * docs/architecture/0006-figma-consumer-sync.md for the full research trail.
 */
export function resolveButtonFill(con: Con, variant: ButtonVariant, state: ButtonState): ButtonFill {
  const action = con.color.action;
  const text = con.color.text;

  switch (variant) {
    case 'primary': {
      const defaultText = text.base.inverse.low;
      switch (state) {
        case 'default':
        case 'loading':
          return { background: action.primary.gradient, border: action.primary.gradient.from, text: defaultText };
        case 'pressed':
          return { background: action.primary.solid, border: action.primary.solid, text: defaultText };
        case 'disabled':
          return { background: action.primary.subtle, border: action.primary.subtle, text: text.base.inverse.subtle };
        case 'skeleton':
          return { background: action.skeleton.trough, border: action.skeleton.trough, text: defaultText };
      }
      break;
    }
    case 'secondary': {
      const defaultText = text.base.inverse.primary;
      switch (state) {
        case 'default':
        case 'loading':
          return { background: action.secondary.subtle, border: action.secondary.subtle, text: defaultText };
        case 'pressed':
          return { background: action.secondary.solid, border: action.secondary.solid, text: text.base.inverse.low };
        case 'disabled':
          return { background: action.secondary.subtle, border: action.secondary.subtle, text: text.base.inverse.subtle };
        case 'skeleton':
          return { background: action.skeleton.trough, border: action.skeleton.trough, text: defaultText };
      }
      break;
    }
    case 'tertiary': {
      const defaultText = text.base.inverse.primary;
      switch (state) {
        case 'default':
        case 'loading':
          // Transparent by default — Tertiary is the one variant that does NOT
          // share Secondary's solid resting fill (confirmed: rgba(..., 0)).
          return { background: 'transparent', border: 'transparent', text: defaultText };
        case 'pressed':
          // 25%-opacity overlay of the same colour as Secondary's solid, not a flat fill.
          return { background: withAlpha(action.tertiary.solid, 0.25), border: 'transparent', text: text.base.inverse.low };
        case 'disabled':
          return { background: 'transparent', border: 'transparent', text: text.base.inverse.subtle };
        case 'skeleton':
          return { background: action.skeleton.trough, border: action.skeleton.trough, text: defaultText };
      }
      break;
    }
    case 'destructive': {
      const defaultText = text.feedback.inverse.danger.strong;
      switch (state) {
        case 'default':
        case 'loading':
          return { background: action.danger.subtle, border: action.danger.subtle, text: defaultText };
        case 'pressed':
          return { background: action.danger.gradient, border: action.danger.gradient.from, text: text.base.inverse.low };
        case 'disabled':
          return { background: action.danger.subtle, border: action.danger.subtle, text: text.feedback.inverse.danger.low };
        case 'skeleton':
          return { background: action.skeleton.trough, border: action.skeleton.trough, text: defaultText };
      }
    }
  }
  // Unreachable — every ButtonState is handled in every branch above. Kept for exhaustiveness at runtime.
  throw new Error(`Unhandled button variant/state combination: ${variant}/${state}`);
}

/** Converts a `#rrggbb` hex colour to an `rgba(r, g, b, a)` string — used for Tertiary's Pressed overlay, the one non-opaque fill in the Button spec. */
function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface ButtonSizeTokens {
  /** Fixed content-box height, where Figma defines one (Normal/Small); Bare is content-driven — see `README.md`. */
  height?: number;
  paddingX: number;
  paddingY: number;
  gap: number;
  iconSize: number;
  borderWidth: number;
  /** `con.typography.button.lg` (Normal) or `.sm` (Small/Bare) — `Expressive/button-01`/`-02` in Figma. */
  typography: ConTextStyle;
}

/**
 * Size tokens, extracted 1:1 from Figma (button-size-* / control-height-* /
 * spacing-* variables, `Expressive/button-01` and `-02` text styles). See
 * docs/architecture/0006-figma-consumer-sync.md — the written component
 * description says Bare is "content-height, zero padding", but the actual
 * built instances use 6px padding/gap on every side; the tokens (not the
 * prose) are followed here, per the brief's own instruction to treat
 * variables as the source of truth.
 */
export function resolveButtonSize(con: Con): Record<ButtonSize, ButtonSizeTokens> {
  return {
    normal: {
      height: 48,
      paddingX: parsePx(con.spacing['16']),
      paddingY: parsePx(con.spacing['16']),
      gap: parsePx(con.spacing['8']),
      iconSize: 24,
      borderWidth: 2,
      typography: con.typography.button.lg,
    },
    small: {
      height: 38,
      paddingX: 12,
      paddingY: parsePx(con.spacing['8']),
      gap: parsePx(con.spacing['8']),
      iconSize: 18,
      borderWidth: 2,
      typography: con.typography.button.sm,
    },
    bare: {
      // No fixed height token — Bare hugs its content (icon/label + 6px padding + 1px border).
      paddingX: 6,
      paddingY: 6,
      gap: 6,
      iconSize: 16,
      borderWidth: 1,
      typography: con.typography.button.sm,
    },
  };
}

export const BUTTON_SHAPE_RADIUS: Record<ButtonShape, number> = {
  rectangle: 0,
  pill: 999,
};
