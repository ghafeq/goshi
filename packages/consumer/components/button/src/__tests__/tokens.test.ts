import { conLight } from '@goshi/consumer-tokens';
import { describe, expect, it } from 'vitest';
import { BUTTON_SHAPE_RADIUS, resolveButtonFill, resolveButtonSize } from '../tokens.js';

// Every expected hex value below was extracted directly from Figma's
// generated reference code (get_design_context on node 2:448, the
// "Size=Normal, Shape=Rectangle" subset) — see
// docs/architecture/0006-figma-consumer-sync.md for the extraction method.
describe('resolveButtonFill', () => {
  it('matches Figma exactly for every Primary state', () => {
    expect(resolveButtonFill(conLight, 'primary', 'default')).toEqual({
      background: { from: '#272525', to: '#3C3838' },
      border: '#272525',
      text: '#F4F4F4',
    });
    expect(resolveButtonFill(conLight, 'primary', 'pressed')).toEqual({ background: '#726E6E', border: '#726E6E', text: '#F4F4F4' });
    expect(resolveButtonFill(conLight, 'primary', 'loading')).toEqual(resolveButtonFill(conLight, 'primary', 'default'));
    expect(resolveButtonFill(conLight, 'primary', 'disabled')).toEqual({ background: '#F7F3F2', border: '#F7F3F2', text: '#878D96' });
    expect(resolveButtonFill(conLight, 'primary', 'skeleton').background).toBe('#F2F4F8');
  });

  it('matches Figma exactly for every Secondary state', () => {
    expect(resolveButtonFill(conLight, 'secondary', 'default')).toEqual({ background: '#F2F4F8', border: '#F2F4F8', text: '#161616' });
    expect(resolveButtonFill(conLight, 'secondary', 'pressed')).toEqual({ background: '#343A3F', border: '#343A3F', text: '#F4F4F4' });
    expect(resolveButtonFill(conLight, 'secondary', 'loading')).toEqual(resolveButtonFill(conLight, 'secondary', 'default'));
    expect(resolveButtonFill(conLight, 'secondary', 'disabled')).toEqual({ background: '#F2F4F8', border: '#F2F4F8', text: '#878D96' });
  });

  it('matches Figma exactly for every Tertiary state (transparent by default, unlike Secondary)', () => {
    expect(resolveButtonFill(conLight, 'tertiary', 'default')).toEqual({ background: 'transparent', border: 'transparent', text: '#161616' });
    expect(resolveButtonFill(conLight, 'tertiary', 'pressed')).toEqual({
      background: 'rgba(52, 58, 63, 0.25)',
      border: 'transparent',
      text: '#F4F4F4',
    });
    expect(resolveButtonFill(conLight, 'tertiary', 'disabled')).toEqual({ background: 'transparent', border: 'transparent', text: '#878D96' });
  });

  it('matches Figma exactly for every Destructive state', () => {
    expect(resolveButtonFill(conLight, 'destructive', 'default')).toEqual({ background: '#F2F4F8', border: '#F2F4F8', text: '#DA1E28' });
    expect(resolveButtonFill(conLight, 'destructive', 'pressed')).toEqual({
      background: { from: '#FA4D56', to: '#FF8389' },
      border: '#FA4D56',
      text: '#F4F4F4',
    });
    expect(resolveButtonFill(conLight, 'destructive', 'disabled')).toEqual({ background: '#F2F4F8', border: '#F2F4F8', text: '#FFB3B8' });
  });

  it('uses the same universal skeleton trough colour for every variant', () => {
    const troughs = (['primary', 'secondary', 'tertiary', 'destructive'] as const).map(
      (variant) => resolveButtonFill(conLight, variant, 'skeleton').background,
    );
    expect(new Set(troughs).size).toBe(1);
    expect(troughs[0]).toBe('#F2F4F8');
  });
});

describe('resolveButtonSize', () => {
  const sizes = resolveButtonSize(conLight);

  it('matches Figma exactly for Normal', () => {
    expect(sizes.normal).toMatchObject({ height: 48, paddingX: 16, paddingY: 16, gap: 8, iconSize: 24, borderWidth: 2 });
    expect(sizes.normal.typography.fontSize).toBe(16);
    expect(sizes.normal.typography.lineHeight).toBe(24);
  });

  it('matches Figma exactly for Small', () => {
    expect(sizes.small).toMatchObject({ height: 38, paddingX: 12, paddingY: 8, gap: 8, iconSize: 18, borderWidth: 2 });
    expect(sizes.small.typography.fontSize).toBe(14);
    expect(sizes.small.typography.lineHeight).toBe(22);
  });

  it('matches Figma exactly for Bare (padding is 6px per the tokens, not "zero" per the written description)', () => {
    expect(sizes.bare).toMatchObject({ paddingX: 6, paddingY: 6, gap: 6, iconSize: 16, borderWidth: 1 });
    expect(sizes.bare.height).toBeUndefined();
  });
});

describe('BUTTON_SHAPE_RADIUS', () => {
  it('matches Figma exactly', () => {
    expect(BUTTON_SHAPE_RADIUS.rectangle).toBe(0);
    expect(BUTTON_SHAPE_RADIUS.pill).toBe(999);
  });
});
