import type { Con } from '@goshi/consumer-tokens';

export type CardSize = 'bare' | 'small' | 'medium' | 'large';
export type CardHierarchy = 'standard' | 'embedded' | 'featured';
export type CardAlignment = 'start' | 'center';

export interface CardFill {
  background: string;
  /** Only Featured has a visible border (same colour as its background — a subtle edge, not a contrast border). */
  border?: string;
  text: string;
  /** Skeleton placeholder-block colour — differs by hierarchy so it stays visible against that hierarchy's background (confirmed from Figma, not a single universal trough like Button's). */
  skeletonPlaceholder: string;
}

/**
 * Hierarchy -> {background, text, skeletonPlaceholder}, extracted 1:1 from
 * Figma (`get_design_context` on node 73:282, file S1RGdp8FzeLvnBtxjnqBIb).
 * Maps directly onto the confirmed `Background/Inverse/Layer 1/*` surface
 * roles: Standard=Surface, Embedded=Inline, Featured=Overlay.
 */
export function resolveCardFill(con: Con, hierarchy: CardHierarchy): CardFill {
  switch (hierarchy) {
    case 'standard':
      return {
        background: con.color.surface.layer1.surface,
        text: con.color.text.base.inverse.primary,
        skeletonPlaceholder: con.color.action.entry.backgroundDisabled,
      };
    case 'embedded':
      return {
        background: con.color.surface.layer1.inline,
        text: con.color.text.base.inverse.primary,
        skeletonPlaceholder: con.color.action.entry.backgroundDisabled,
      };
    case 'featured':
      return {
        background: con.color.surface.layer1.overlay,
        border: con.color.surface.layer1.overlay,
        text: con.color.text.base.inverse.low,
        skeletonPlaceholder: con.color.action.secondary.solid,
      };
  }
}

export interface CardSizeTokens {
  padding: number;
  gap: number;
  iconSize: number;
  titleTypography: Con['typography']['expressive']['heading02'];
  bodyTypography: Con['typography']['expressive']['bodyCompact02'];
}

/**
 * Size tokens, extracted 1:1 from Figma. Icon size (32px) and the gap
 * between icon/content (`spacing-04`, 12px) are constant across all 4
 * sizes — only padding scales. Heights shown in Figma (88/104/112/120px)
 * are the rendered height of the *default sample content*, not a fixed
 * token — real usage should let height be content-driven, so they're not
 * reproduced here.
 */
export function resolveCardSize(con: Con): Record<CardSize, CardSizeTokens> {
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

export const CARD_RADIUS = 8;
export const CARD_FEATURED_BORDER_WIDTH = 2;

function parsePx(value: string): number {
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid px value: ${value}`);
  }
  return n;
}
