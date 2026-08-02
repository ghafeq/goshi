import { describe, expect, it } from 'vitest';
import { primitives, semanticByMode } from '../index.js';

describe('foundation tokens', () => {
  it('resolves the primitive colour ramp', () => {
    expect(primitives.color.blue['500']).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(primitives.color.gray['100']).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('resolves the confirmed Figma-sourced primitive families', () => {
    expect(primitives.color.gray['10']).toBe('#F4F4F4');
    expect(primitives.color.warmGray['90']).toBe('#272525');
    expect(primitives.color.coolGray['50']).toBe('#878D96');
    expect(primitives.color.red['60']).toBe('#DA1E28');
  });

  it('resolves the primitive spacing scale', () => {
    expect(primitives.spacing['16']).toBe('16px');
  });

  it('resolves semantic colour references for both theme modes', () => {
    expect(semanticByMode.light.color.background.primary).toBe('#FFFFFF');
    expect(semanticByMode.dark.color.background.primary).toBe(primitives.color.gray['100']);
  });

  it('resolves the Action (button) semantic tokens, shared across both theme modes', () => {
    expect(semanticByMode.light.color.action.primary.solid).toBe(primitives.color.warmGray['60']);
    expect(semanticByMode.dark.color.action.primary.solid).toBe(primitives.color.warmGray['60']);
  });

  it('keeps light and dark semantic trees structurally identical', () => {
    expect(Object.keys(semanticByMode.light.color)).toEqual(Object.keys(semanticByMode.dark.color));
  });
});
