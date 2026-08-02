import { describe, expect, it } from 'vitest';
import { entTypography } from '../index.js';

describe('ent typography (placeholder)', () => {
  it('builds successfully with no roles defined yet', () => {
    expect(entTypography).toEqual({});
  });

  it('proves the pipeline works — same mechanism as con typography, no shared values', () => {
    expect(Object.keys(entTypography)).toHaveLength(0);
  });
});
