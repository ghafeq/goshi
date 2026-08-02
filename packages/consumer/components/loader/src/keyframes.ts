/**
 * Keyframe data for the indeterminate Loader arc sweep, extracted 1:1 from
 * Figma's motion data (`get_motion_context` on node 22:196 "Arc", file
 * S1RGdp8FzeLvnBtxjnqBIb) — a `PATH_TRIM` animation, 1311ms, linear, looping.
 *
 * Values are fractions of total path length (Figma's reference used SVG
 * `pathLength={1}`): `LOADER_ARC_DASH_FRACTIONS[i]` is the arc's visible
 * length at `LOADER_ARC_TIMES[i]`, `LOADER_ARC_OFFSET_FRACTIONS[i]` is its
 * rotation offset. Do not hand-edit — if the Figma animation changes, re-run
 * `get_motion_context` and replace these arrays.
 */
export const LOADER_ARC_DURATION_MS = 1311;

export const LOADER_ARC_TIMES: number[] = [
  0, 0.062, 0.125, 0.187, 0.25, 0.312, 0.375, 0.437, 0.5, 0.563, 0.625, 0.688, 0.75, 0.813, 0.875, 0.938, 1,
];

export const LOADER_ARC_DASH_FRACTIONS: number[] = [
  0.01, 0.0189, 0.0507, 0.1158, 0.2222, 0.3464, 0.4378, 0.4849, 0.4998, 0.4933, 0.4633, 0.3948, 0.2721, 0.138, 0.0565,
  0.0197, 0.01,
];

export const LOADER_ARC_OFFSET_FRACTIONS: number[] = [
  0, -0.0225, -0.0472, -0.0742, -0.104, -0.1367, -0.1724, -0.2106, -0.2503, -0.2966, -0.3647, -0.4688, -0.6242,
  -0.788, -0.8964, -0.9578, -0.99,
];

/**
 * Linear-interpolates a keyframe track at a given progress (0-1). This is
 * the same math Reanimated's `interpolate` performs at runtime — pulled out
 * as a plain function so it can be unit-tested without rendering a
 * component.
 */
export function interpolateKeyframes(progress: number, times: number[], values: number[]): number {
  const last = times.length - 1;
  if (progress <= times[0]!) return values[0]!;
  if (progress >= times[last]!) return values[last]!;
  for (let i = 0; i < last; i += 1) {
    const t0 = times[i]!;
    const t1 = times[i + 1]!;
    if (progress >= t0 && progress <= t1) {
      const span = t1 - t0;
      const localT = span === 0 ? 0 : (progress - t0) / span;
      return values[i]! + (values[i + 1]! - values[i]!) * localT;
    }
  }
  return values[last]!;
}
