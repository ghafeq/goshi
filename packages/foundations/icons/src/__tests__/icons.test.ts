import { describe, expect, it } from 'vitest';
import { iconSize, iconStrokeWidth, resolveIconSize, resolveIconStrokeWidth } from '../index.js';

describe('icon tokens', () => {
  it('supports the three required stroke widths', () => {
    expect(Object.values(iconStrokeWidth)).toEqual([1, 1.5, 2]);
  });

  it('resolves a token name to its numeric value', () => {
    expect(resolveIconStrokeWidth('bold')).toBe(2);
    expect(resolveIconSize('lg')).toBe(iconSize.lg);
  });

  it('passes raw numbers through unchanged', () => {
    expect(resolveIconStrokeWidth(3)).toBe(3);
    expect(resolveIconSize(40)).toBe(40);
  });
});
