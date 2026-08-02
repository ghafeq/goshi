import { iconSize } from '@goshi/foundations-icons';
import React, { useEffect } from 'react';
import { View, type AccessibilityProps } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { LOADER_ARC_DASH_FRACTIONS, LOADER_ARC_DURATION_MS, LOADER_ARC_OFFSET_FRACTIONS, LOADER_ARC_TIMES } from './keyframes.js';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Small=16 / Medium=20 / Large=24 in the Figma "Loader" component — identical to `@goshi/foundations-icons`' sm/md/lg scale, reused directly rather than redefined. */
export type LoaderSize = 'sm' | 'md' | 'lg';

const SIZE_PX: Record<LoaderSize, number> = {
  sm: iconSize.sm,
  md: iconSize.md,
  lg: iconSize.lg,
};

/** Confirmed from the exported Track asset SVG (`stroke-width="1.5"`). */
const STROKE_WIDTH = 1.5;
/** "Track is the static 10% ring" — Figma component description for node 22:311. */
const TRACK_OPACITY = 0.1;

export interface LoaderProps extends AccessibilityProps {
  /** @default 'md' */
  size?: LoaderSize | number;
  /**
   * Arc (and, at 10% opacity, track) colour. Required: Loader has no theme
   * dependency of its own — pass the colour the caller's theme resolved
   * (e.g. `con.color.text.base.inverse.primary` inside a dark button, or
   * any other resolved foreground colour for standalone use).
   */
  color: string;
  /** Accessible label read by screen readers. @default 'Loading' */
  label?: string;
}

/**
 * Indeterminate spinner. Arc sweeps via animated `strokeDasharray` /
 * `strokeDashoffset` over 1311ms, linear, looping — 1:1 with Figma's
 * `PATH_TRIM` animation (see `./keyframes.ts`). The Loader always animates;
 * unlike `Shimmer`, Figma's own component description for this node does
 * not call for reduced-motion handling, and a small contained spinner is
 * broadly considered outside the vestibular-trigger category that
 * prefers-reduced-motion guidance targets.
 */
export function Loader({ size = 'md', color, label = 'Loading', ...accessibilityProps }: LoaderProps) {
  const dimension = typeof size === 'number' ? size : SIZE_PX[size];
  const radius = (dimension - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = dimension / 2;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: LOADER_ARC_DURATION_MS, easing: Easing.linear }), -1, false);
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const dash = interpolate(progress.value, LOADER_ARC_TIMES, LOADER_ARC_DASH_FRACTIONS);
    const offset = interpolate(progress.value, LOADER_ARC_TIMES, LOADER_ARC_OFFSET_FRACTIONS);
    return {
      strokeDasharray: [dash * circumference, (1 - dash) * circumference],
      strokeDashoffset: offset * circumference,
    };
  });

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={{ width: dimension, height: dimension }}
      {...accessibilityProps}
    >
      <Svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <Circle cx={center} cy={center} r={radius} stroke={color} strokeWidth={STROKE_WIDTH} opacity={TRACK_OPACITY} fill="none" />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
}
