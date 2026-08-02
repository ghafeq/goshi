import { describe, expect, it } from 'vitest';
import { primitives, semanticByMode } from '../index.js';

describe('foundation tokens', () => {
  it('resolves the primitive colour ramp', () => {
    expect(primitives.color.blue['500']).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(primitives.color.neutral['900']).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('resolves the primitive spacing scale', () => {
    expect(primitives.spacing['16']).toBe('16px');
  });

  it('resolves semantic colour references for both theme modes', () => {
    expect(semanticByMode.light.color.background.primary).toBe('#FFFFFF');
    expect(semanticByMode.dark.color.background.primary).toBe(primitives.color.neutral['950']);
  });

  it('keeps light and dark semantic trees structurally identical', () => {
    expect(Object.keys(semanticByMode.light.color)).toEqual(Object.keys(semanticByMode.dark.color));
  });
});
