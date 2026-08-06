import { conLight } from '@goshi/consumer-tokens';
import { describe, expect, it } from 'vitest';
import { TAG_SHAPE_RADIUS, resolveTagFill, resolveTagSize } from '../tokens.js';

// Every expected hex value below was extracted directly from Figma's
// generated reference code (get_design_context / get_variable_defs on
// node 2:6442) — see docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md.
describe('resolveTagFill', () => {
  it('matches Figma exactly for Solid emphasis, every confirmed tone', () => {
    expect(resolveTagFill(conLight, 'positive', 'solid')).toEqual({ background: '#198038', border: '#198038', text: '#F4F4F4' });
    expect(resolveTagFill(conLight, 'critical', 'solid')).toEqual({ background: '#DA1E28', border: '#DA1E28', text: '#F4F4F4' });
    expect(resolveTagFill(conLight, 'neutral', 'solid')).toEqual({ background: '#0F62FE', border: '#0F62FE', text: '#F4F4F4' });
    expect(resolveTagFill(conLight, 'pending', 'solid')).toEqual({ background: '#8E6A00', border: '#8E6A00', text: '#F4F4F4' });
  });

  it("uses pure white text for Muted Solid, distinct from every other tone's off-white", () => {
    expect(resolveTagFill(conLight, 'muted', 'solid')).toEqual({ background: '#343A3F', border: '#343A3F', text: '#FFFFFF' });
  });

  it('matches Figma exactly for Subtle emphasis, every confirmed tone', () => {
    expect(resolveTagFill(conLight, 'positive', 'subtle')).toEqual({ background: '#DEFBE6', border: '#DEFBE6', text: '#044317' });
    expect(resolveTagFill(conLight, 'critical', 'subtle')).toEqual({ background: '#FFF1F1', border: '#FFF1F1', text: '#DA1E28' });
    expect(resolveTagFill(conLight, 'neutral', 'subtle')).toEqual({ background: '#EDF5FF', border: '#EDF5FF', text: '#002D9C' });
    expect(resolveTagFill(conLight, 'pending', 'subtle')).toEqual({ background: '#FCF4D6', border: '#FCF4D6', text: '#483700' });
    expect(resolveTagFill(conLight, 'muted', 'subtle')).toEqual({ background: '#F2F4F8', border: '#F2F4F8', text: '#161616' });
  });
});

describe('resolveTagSize', () => {
  const sizes = resolveTagSize(conLight);

  it('matches Figma exactly for Normal (36px, not the documented 30px)', () => {
    expect(sizes.normal).toMatchObject({ height: 36, paddingX: 12, paddingY: 8, gap: 4, iconSize: 16 });
    expect(sizes.normal.typography.fontSize).toBe(14);
  });

  it('matches Figma exactly for Small (24px, not the documented 26px)', () => {
    expect(sizes.small).toMatchObject({ height: 24, paddingX: 8, paddingY: 4, gap: 8, iconSize: 14 });
    expect(sizes.small.typography.fontSize).toBe(12);
  });
});

describe('TAG_SHAPE_RADIUS', () => {
  it('matches Figma exactly', () => {
    expect(TAG_SHAPE_RADIUS.sharp).toBe(4);
    expect(TAG_SHAPE_RADIUS.pill).toBe(999);
  });
});
