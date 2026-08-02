import { describe, expect, it } from 'vitest';
import { conTypography } from '../index.js';

describe('con typography', () => {
  it('resolves the font family reference', () => {
    expect(conTypography.heading.lg.fontFamily).toBe('Inter');
  });

  it('produces RN-compatible numeric fontSize/lineHeight', () => {
    expect(typeof conTypography.body.md.fontSize).toBe('number');
    expect(typeof conTypography.body.md.lineHeight).toBe('number');
  });

  it('produces RN-compatible string fontWeight', () => {
    expect(conTypography.heading.lg.fontWeight).toBe('700');
  });

  it('covers every expressive type role', () => {
    expect(Object.keys(conTypography)).toEqual(
      expect.arrayContaining(['fontFamily', 'display', 'heading', 'body', 'label', 'caption']),
    );
  });
});
