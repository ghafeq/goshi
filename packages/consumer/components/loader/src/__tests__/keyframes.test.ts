import { describe, expect, it } from 'vitest';
import { LOADER_ARC_DASH_FRACTIONS, LOADER_ARC_OFFSET_FRACTIONS, LOADER_ARC_TIMES, interpolateKeyframes } from '../keyframes.js';

describe('loader keyframes', () => {
  it('matches Figma keyframe values exactly at each defined time', () => {
    LOADER_ARC_TIMES.forEach((t, i) => {
      expect(interpolateKeyframes(t, LOADER_ARC_TIMES, LOADER_ARC_DASH_FRACTIONS)).toBeCloseTo(LOADER_ARC_DASH_FRACTIONS[i]!, 10);
    });
  });

  it('interpolates linearly between two keyframes', () => {
    // Between t=0 (dash 0.01) and t=0.062 (dash 0.0189), the midpoint should be the average.
    const mid = (0 + 0.062) / 2;
    const expected = (0.01 + 0.0189) / 2;
    expect(interpolateKeyframes(mid, LOADER_ARC_TIMES, LOADER_ARC_DASH_FRACTIONS)).toBeCloseTo(expected, 10);
  });

  it('clamps progress outside [0, 1] to the first/last keyframe', () => {
    expect(interpolateKeyframes(-1, LOADER_ARC_TIMES, LOADER_ARC_OFFSET_FRACTIONS)).toBe(LOADER_ARC_OFFSET_FRACTIONS[0]);
    expect(interpolateKeyframes(2, LOADER_ARC_TIMES, LOADER_ARC_OFFSET_FRACTIONS)).toBe(
      LOADER_ARC_OFFSET_FRACTIONS[LOADER_ARC_OFFSET_FRACTIONS.length - 1],
    );
  });

  it('keeps every keyframe track the same length as the times track', () => {
    expect(LOADER_ARC_DASH_FRACTIONS).toHaveLength(LOADER_ARC_TIMES.length);
    expect(LOADER_ARC_OFFSET_FRACTIONS).toHaveLength(LOADER_ARC_TIMES.length);
  });
});
