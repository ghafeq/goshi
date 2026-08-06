import { conLight } from '@goshi/consumer-tokens';
import { describe, expect, it } from 'vitest';
import { CARD_RADIUS, resolveCardFill, resolveCardSize } from '../tokens.js';

// Every expected value below was extracted directly from Figma's generated
// reference code (get_design_context on node 73:282) — see
// docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md.
describe('resolveCardFill', () => {
  it('matches Figma exactly for Standard (Layer 1 / Surface)', () => {
    const fill = resolveCardFill(conLight, 'standard');
    expect(fill.background).toBe('#FFFFFF');
    expect(fill.border).toBeUndefined();
    expect(fill.text).toBe('#161616');
    expect(fill.skeletonPlaceholder).toBe('#DDE1E6');
  });

  it('matches Figma exactly for Embedded (Layer 1 / Inline)', () => {
    const fill = resolveCardFill(conLight, 'embedded');
    expect(fill.background).toBe('#F7F3F2');
    expect(fill.border).toBeUndefined();
    expect(fill.text).toBe('#161616');
    expect(fill.skeletonPlaceholder).toBe('#DDE1E6');
  });

  it('matches Figma exactly for Featured (Layer 1 / Overlay — dark, bordered, inverted text)', () => {
    const fill = resolveCardFill(conLight, 'featured');
    expect(fill.background).toBe('#21272A');
    expect(fill.border).toBe('#21272A');
    expect(fill.text).toBe('#F4F4F4');
    expect(fill.skeletonPlaceholder).toBe('#343A3F');
  });
});

describe('resolveCardSize', () => {
  const sizes = resolveCardSize(conLight);

  it('matches Figma exactly across all 4 sizes (padding scales, icon/gap constant)', () => {
    expect(sizes.bare.padding).toBe(0);
    expect(sizes.small.padding).toBe(8);
    expect(sizes.medium.padding).toBe(12);
    expect(sizes.large.padding).toBe(16);
    for (const size of Object.values(sizes)) {
      expect(size.iconSize).toBe(32);
      expect(size.gap).toBe(12);
    }
  });

  it('uses heading-02 for title and body-compact-02 for body, per Figma', () => {
    expect(sizes.medium.titleTypography.fontSize).toBe(18);
    expect(sizes.medium.bodyTypography.fontSize).toBe(14);
    expect(sizes.medium.bodyTypography.lineHeight).toBe(18);
  });
});

describe('CARD_RADIUS', () => {
  it('matches Figma exactly', () => {
    expect(CARD_RADIUS).toBe(8);
  });
});
