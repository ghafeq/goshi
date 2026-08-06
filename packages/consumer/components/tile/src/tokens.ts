import type { Con } from '@goshi/consumer-tokens';
import { primitives } from '@goshi/foundations-tokens';

export type TileSize = 'bare' | 'small' | 'medium' | 'large';
export type TileHierarchy = 'standard' | 'embedded' | 'featured';
export type TileAlignment = 'start' | 'center';
/**
 * "hover" is part of Tile's sibling pattern (Media Tile) but has no
 * standalone instance on the base Tile component itself in Figma, and RN
 * has no native hover concept for touch anyway — omitted here. "focus" DOES
 * have real built Tile instances (unlike Button's Focused), so it's a
 * first-class state, not a bolted-on ring like Button's.
 */
export type TileState = 'default' | 'pressed' | 'focus' | 'disabled';

export interface TileFill {
  background: string;
  border?: string;
  borderWidth?: number;
  text: string;
}

/**
 * Hierarchy x State -> {background, border, text}, extracted 1:1 from
 * Figma (`get_design_context` on node 74:529, file S1RGdp8FzeLvnBtxjnqBIb
 * — the "Size=Bare" subset, representative since colour doesn't vary by
 * size). Figma's written description says "Disabled uses a dashed edge
 * plus reduced contrast so it does not rely on colour alone" — no built
 * instance actually has a dashed border (confirmed: zero `dashed` classes
 * anywhere in the generated code for any Disabled variant). Implemented
 * per the actual instances (reduced contrast only); the dashed edge is
 * flagged, not fabricated. See
 * docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md.
 */
export function resolveTileFill(con: Con, hierarchy: TileHierarchy, state: TileState): TileFill {
  const entry = con.color.action.entry;

  switch (hierarchy) {
    case 'standard': {
      switch (state) {
        case 'default':
          return { background: con.color.surface.layer1.surface, text: con.color.text.base.inverse.primary };
        case 'pressed':
          return { background: con.color.action.secondary.subtle, text: con.color.text.base.inverse.primary };
        case 'focus':
          return {
            background: con.color.surface.layer1.surface,
            border: entry.borderFocused,
            borderWidth: 2,
            text: con.color.text.base.inverse.primary,
          };
        case 'disabled':
          return { background: entry.backgroundDisabled, text: con.color.text.base.inverse.subtle };
      }
      break;
    }
    case 'embedded': {
      switch (state) {
        case 'default':
          return { background: con.color.surface.layer1.inline, text: con.color.text.base.inverse.primary };
        case 'pressed':
          return { background: con.color.action.secondary.subtle, text: con.color.text.base.inverse.primary };
        case 'focus':
          return {
            background: con.color.surface.layer1.inline,
            border: entry.borderFocused,
            borderWidth: 2,
            text: con.color.text.base.inverse.primary,
          };
        case 'disabled':
          return { background: entry.backgroundDisabled, text: con.color.text.base.inverse.subtle };
      }
      break;
    }
    case 'featured': {
      // Featured keeps full-contrast light text even when disabled — its "reduced
      // contrast" comes entirely from lightening the background, unlike
      // Standard/Embedded, which dim the text instead. Confirmed from Figma, not
      // a simplification.
      const text = con.color.text.base.inverse.low;
      switch (state) {
        case 'default':
          return { background: con.color.surface.layer1.overlay, border: con.color.surface.layer1.overlay, borderWidth: 2, text };
        case 'pressed':
          return { background: con.color.action.secondary.solid, border: con.color.action.secondary.solid, borderWidth: 2, text };
        case 'focus':
          return { background: con.color.surface.layer1.overlay, border: entry.borderFocused, borderWidth: 2, text };
        case 'disabled':
          // No dedicated semantic token for this one value — it's not reused
          // anywhere else Tag/Card/Button touch, unlike every other colour here.
          return { background: primitives.color.coolGray['50'], text };
      }
    }
  }
}

export interface TileSizeTokens {
  padding: number;
  gap: number;
  iconSize: number;
  titleTypography: Con['typography']['expressive']['heading02'];
  bodyTypography: Con['typography']['expressive']['bodyCompact02'];
}

/** Identical structural scale to `@goshi/consumer-components-card` — same Size axis, same tokens. */
export function resolveTileSize(con: Con): Record<TileSize, TileSizeTokens> {
  const gap = parsePx(con.spacing['12']);
  const titleTypography = con.typography.expressive.heading02;
  const bodyTypography = con.typography.expressive.bodyCompact02;
  return {
    bare: { padding: parsePx(con.spacing['0']), gap, iconSize: 32, titleTypography, bodyTypography },
    small: { padding: parsePx(con.spacing['8']), gap, iconSize: 32, titleTypography, bodyTypography },
    medium: { padding: parsePx(con.spacing['12']), gap, iconSize: 32, titleTypography, bodyTypography },
    large: { padding: parsePx(con.spacing['16']), gap, iconSize: 32, titleTypography, bodyTypography },
  };
}

export const TILE_RADIUS = 8;

function parsePx(value: string): number {
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid px value: ${value}`);
  }
  return n;
}
