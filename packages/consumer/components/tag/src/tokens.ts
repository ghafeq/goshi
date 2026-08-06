import type { Con } from '@goshi/consumer-tokens';
import { primitives } from '@goshi/foundations-tokens';

/**
 * Figma's Tag component documents 6 tones (Positive / Caution / Critical /
 * Neutral / Pending / Muted) but only 5 have built instances — "Caution"
 * appears nowhere in the generated reference code across the full variant
 * set. Flagged, not guessed — see
 * docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md.
 */
export type TagTone = 'positive' | 'critical' | 'neutral' | 'pending' | 'muted';
export type TagSize = 'normal' | 'small';
export type TagShape = 'sharp' | 'pill';
export type TagEmphasis = 'solid' | 'subtle';

export interface TagFill {
  background: string;
  border: string;
  text: string;
}

/**
 * Tone x Emphasis -> {background, border, text}, extracted 1:1 from Figma
 * (`get_design_context` / `get_variable_defs` on node 2:6442, file
 * S1RGdp8FzeLvnBtxjnqBIb). Border always matches background exactly in
 * every reviewed instance. Muted's Solid text is pure white
 * (`tag-muted-solid-foreground`), distinct from every other tone's Solid
 * text (`gray.10`, an off-white) — both are real, confirmed, different
 * values, not a rounding choice.
 */
export function resolveTagFill(con: Con, tone: TagTone, emphasis: TagEmphasis): TagFill {
  const t = con.color.tag[tone];
  const background = emphasis === 'solid' ? t.solid : t.subtle;

  if (emphasis === 'subtle') {
    return { background, border: background, text: con.color.text.tag[tone] };
  }

  const text = tone === 'muted' ? primitives.color.white : con.color.text.base.inverse.low;
  return { background, border: background, text };
}

export interface TagSizeTokens {
  height: number;
  paddingX: number;
  paddingY: number;
  gap: number;
  iconSize: number;
  typography: Con['typography']['expressive']['label01'];
}

/**
 * Size tokens, extracted 1:1 from Figma. Note: the written component
 * description says "Size (Normal 30px / Small 26px)" — the actual built
 * instances are 36px/24px. The tokens (not the prose) are followed here,
 * consistent with how Button's Bare-size discrepancy was handled — see
 * docs/architecture/0006 and 0007.
 */
export function resolveTagSize(con: Con): Record<TagSize, TagSizeTokens> {
  return {
    normal: {
      height: 36,
      paddingX: parsePx(con.spacing['12']),
      paddingY: parsePx(con.spacing['8']),
      gap: parsePx(con.spacing['4']),
      iconSize: 16,
      typography: con.typography.expressive.label01,
    },
    small: {
      height: 24,
      paddingX: parsePx(con.spacing['8']),
      paddingY: parsePx(con.spacing['4']),
      gap: parsePx(con.spacing['8']),
      iconSize: 14,
      typography: con.typography.expressive.labelCompact,
    },
  };
}

export const TAG_SHAPE_RADIUS: Record<TagShape, number> = {
  sharp: 4,
  pill: 999,
};

export const TAG_BORDER_WIDTH = 1;

function parsePx(value: string): number {
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid px value: ${value}`);
  }
  return n;
}
