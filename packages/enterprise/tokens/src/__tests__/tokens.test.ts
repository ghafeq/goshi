import { describe, expect, it } from 'vitest';
import { entByMode, entDark, entLight } from '../index.js';

describe('ent tokens', () => {
  it('exposes the ent.color namespace aliased from foundations', () => {
    expect(entLight.color.background.primary).toBe('#FFFFFF');
  });

  it('exposes an (empty, for now) ent.typography namespace', () => {
    expect(entLight.typography).toEqual({});
  });

  it('exposes scale tokens identically across theme modes', () => {
    expect(entLight.spacing['16']).toBe(entDark.spacing['16']);
    expect(entLight.radius.md).toBe(entDark.radius.md);
  });

  it('varies colour tokens by theme mode', () => {
    expect(entLight.color.background.primary).not.toBe(entDark.color.background.primary);
  });

  it('is addressable via entByMode', () => {
    expect(entByMode.light).toBe(entLight);
    expect(entByMode.dark).toBe(entDark);
  });

  it('mirrors the shared semantic colour categories (con and ent alias the same foundation)', () => {
    expect(Object.keys(entLight.color)).toEqual([
      'background',
      'surface',
      'text',
      'border',
      'icon',
      'feedback',
      'interactive',
    ]);
  });
});
