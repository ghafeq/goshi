import { conLight } from '@goshi/consumer-tokens';
import { describe, expect, it } from 'vitest';
import { TILE_RADIUS, resolveTileFill, resolveTileSize } from '../tokens.js';

// Every expected value below was extracted directly from Figma's generated
// reference code (get_design_context on node 74:529, the "Size=Bare"
// subset) — see docs/architecture/0007-figma-consumer-sync-cards-tiles-tag.md.
describe('resolveTileFill', () => {
  it('matches Figma exactly for Standard, every state', () => {
    expect(resolveTileFill(conLight, 'standard', 'default')).toEqual({ background: '#FFFFFF', text: '#161616' });
    expect(resolveTileFill(conLight, 'standard', 'pressed')).toEqual({ background: '#F2F4F8', text: '#161616' });
    expect(resolveTileFill(conLight, 'standard', 'focus')).toEqual({ background: '#FFFFFF', border: '#0F62FE', borderWidth: 2, text: '#161616' });
    expect(resolveTileFill(conLight, 'standard', 'disabled')).toEqual({ background: '#DDE1E6', text: '#878D96' });
  });

  it('matches Figma exactly for Embedded, every state', () => {
    expect(resolveTileFill(conLight, 'embedded', 'default')).toEqual({ background: '#F7F3F2', text: '#161616' });
    expect(resolveTileFill(conLight, 'embedded', 'pressed')).toEqual({ background: '#F2F4F8', text: '#161616' });
    expect(resolveTileFill(conLight, 'embedded', 'focus')).toEqual({ background: '#F7F3F2', border: '#0F62FE', borderWidth: 2, text: '#161616' });
    expect(resolveTileFill(conLight, 'embedded', 'disabled')).toEqual({ background: '#DDE1E6', text: '#878D96' });
  });

  it('matches Figma exactly for Featured, every state — including full-contrast text even when disabled', () => {
    expect(resolveTileFill(conLight, 'featured', 'default')).toEqual({ background: '#21272A', border: '#21272A', borderWidth: 2, text: '#F4F4F4' });
    expect(resolveTileFill(conLight, 'featured', 'pressed')).toEqual({ background: '#343A3F', border: '#343A3F', borderWidth: 2, text: '#F4F4F4' });
    expect(resolveTileFill(conLight, 'featured', 'focus')).toEqual({ background: '#21272A', border: '#0F62FE', borderWidth: 2, text: '#F4F4F4' });
    expect(resolveTileFill(conLight, 'featured', 'disabled')).toEqual({ background: '#878D96', text: '#F4F4F4' });
  });

  it('uses the same real focus-ring colour across every hierarchy', () => {
    expect(resolveTileFill(conLight, 'standard', 'focus').border).toBe('#0F62FE');
    expect(resolveTileFill(conLight, 'embedded', 'focus').border).toBe('#0F62FE');
    expect(resolveTileFill(conLight, 'featured', 'focus').border).toBe('#0F62FE');
  });
});

describe('resolveTileSize', () => {
  it('matches Card exactly — same Size axis, same tokens', () => {
    const sizes = resolveTileSize(conLight);
    expect(sizes.bare.padding).toBe(0);
    expect(sizes.small.padding).toBe(8);
    expect(sizes.medium.padding).toBe(12);
    expect(sizes.large.padding).toBe(16);
    for (const size of Object.values(sizes)) {
      expect(size.iconSize).toBe(32);
      expect(size.gap).toBe(12);
    }
  });
});

describe('TILE_RADIUS', () => {
  it('matches Figma exactly', () => {
    expect(TILE_RADIUS).toBe(8);
  });
});
