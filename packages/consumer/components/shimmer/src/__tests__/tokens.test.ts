import { describe, expect, it } from 'vitest';
import { hexToRgba, parseCubicBezier, parsePx } from '../tokens.js';

describe('parseCubicBezier', () => {
  it('extracts the four control points', () => {
    expect(parseCubicBezier('cubic-bezier(0.4, 0, 0.2, 1)')).toEqual([0.4, 0, 0.2, 1]);
  });

  it('throws on a non-cubic-bezier string', () => {
    expect(() => parseCubicBezier('ease-in-out')).toThrow();
  });
});

describe('parsePx', () => {
  it('strips the trailing px', () => {
    expect(parsePx('48px')).toBe(48);
  });

  it('throws on a non-numeric value', () => {
    expect(() => parsePx('auto')).toThrow();
  });
});

describe('hexToRgba', () => {
  it('converts a hex colour to rgba at the given alpha', () => {
    expect(hexToRgba('#FFFFFF', 0.55)).toBe('rgba(255, 255, 255, 0.55)');
    expect(hexToRgba('#FFFFFF', 0)).toBe('rgba(255, 255, 255, 0)');
  });

  it('throws on a malformed hex colour', () => {
    expect(() => hexToRgba('#FFF', 0.5)).toThrow();
  });
});
