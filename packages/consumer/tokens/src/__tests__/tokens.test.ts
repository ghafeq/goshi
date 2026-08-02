import { describe, expect, it } from 'vitest';
import { conByMode, conDark, conLight } from '../index.js';

describe('con tokens', () => {
  it('exposes the con.color namespace aliased from foundations', () => {
    expect(conLight.color.background.primary).toBe('#FFFFFF');
  });

  it('exposes the con.typography namespace', () => {
    expect(conLight.typography.heading.lg.fontSize).toBe(28);
  });

  it('exposes scale tokens identically across theme modes', () => {
    expect(conLight.spacing['16']).toBe(conDark.spacing['16']);
    expect(conLight.radius.md).toBe(conDark.radius.md);
  });

  it('varies colour tokens by theme mode', () => {
    expect(conLight.color.background.primary).not.toBe(conDark.color.background.primary);
  });

  it('is addressable via conByMode', () => {
    expect(conByMode.light).toBe(conLight);
    expect(conByMode.dark).toBe(conDark);
  });
});
