import { primitives } from '@goshi/foundations-tokens';
import React, { useEffect, useState } from 'react';
import { type LayoutChangeEvent, type ViewStyle, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import { hexToRgba, parseCubicBezier, parsePx } from './tokens.js';
import { useReducedMotion } from './useReducedMotion.js';

/** Small=32 / Medium=48 / Large=56 in the Figma "Skeleton Shimmer" component — matches `@goshi/foundations-tokens`' sizing scale exactly (32px/48px/56px), reused directly. */
export type ShimmerSize = 'sm' | 'md' | 'lg';

const ROW_HEIGHT_PX: Record<ShimmerSize, number> = {
  sm: parsePx(primitives.sizing['32']),
  md: parsePx(primitives.sizing['48']),
  lg: parsePx(primitives.sizing['56']),
};

/** Confirmed from Figma motion data (node 23:195 "Highlight", file S1RGdp8FzeLvnBtxjnqBIb): band width 70px, sweep 1.6s. */
const BAND_WIDTH_PX = 70;
const SWEEP_DURATION_MS = 1600;
const SWEEP_BEZIER = parseCubicBezier(primitives.motion.easing.standard);

/** How the sweep behaves when the OS "reduce motion" setting is on — Figma's own component description explicitly calls for one of these two, unlike Loader. */
export type ShimmerMotionFallback = 'pulse' | 'static';

export interface ShimmerProps {
  /** @default 'md' */
  size?: ShimmerSize | number;
  /**
   * Highlight gradient peak colour. Figma's reference used white at 55%
   * opacity — that's the default, confirmed only against the dark
   * (warmGray/coolGray) trough colours used in Button's Skeleton state.
   * Override if placing Shimmer over a light trough.
   */
  highlightColor?: string;
  /** @default 0.55 */
  highlightOpacity?: number;
  /** Behaviour when the OS "reduce motion" setting is on. @default 'pulse' */
  motionFallback?: ShimmerMotionFallback;
  style?: ViewStyle;
}

/**
 * Sweeping highlight for skeleton-loading states. Transparent — place it
 * over the trough/placeholder surface (e.g. `con.color.action.*.subtle`);
 * Shimmer draws no background of its own.
 *
 * Figma's reference animates a fixed +480px translate calibrated for its
 * 340px example row. That doesn't generalise — a real skeleton row can be
 * any width, and the point of a sweep is to fully clear the row on each
 * pass. This implementation measures its own width via `onLayout` and
 * travels `width + 2 * bandWidth` instead, which reduces to the same
 * geometry (band starts and ends fully off-screen) at any size.
 */
export function Shimmer({ size = 'md', highlightColor = '#FFFFFF', highlightOpacity = 0.55, motionFallback = 'pulse', style }: ShimmerProps) {
  const height = typeof size === 'number' ? size : ROW_HEIGHT_PX[size];
  const [width, setWidth] = useState(0);
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (width <= 0) return;

    if (reducedMotion) {
      if (motionFallback === 'pulse') {
        progress.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          false,
        );
      } else {
        progress.value = 0;
      }
      return;
    }

    progress.value = withRepeat(withTiming(1, { duration: SWEEP_DURATION_MS, easing: Easing.bezier(...SWEEP_BEZIER) }), -1, false);
  }, [width, reducedMotion, motionFallback, progress]);

  const travel = width + BAND_WIDTH_PX * 2;
  const restingTranslateX = width / 2 - BAND_WIDTH_PX / 2;
  const sweeps = !reducedMotion;

  const animatedStyle = useAnimatedStyle(() => {
    if (sweeps) {
      return {
        opacity: 1,
        transform: [{ translateX: interpolate(progress.value, [0, 1], [-BAND_WIDTH_PX, travel - BAND_WIDTH_PX]) }],
      };
    }
    if (motionFallback === 'pulse') {
      return {
        opacity: interpolate(progress.value, [0, 1], [0.3, 0.7]),
        transform: [{ translateX: restingTranslateX }],
      };
    }
    return {
      opacity: 0.5,
      transform: [{ translateX: restingTranslateX }],
    };
  });

  const transparent = hexToRgba(highlightColor, 0);
  const peak = hexToRgba(highlightColor, highlightOpacity);

  return (
    <View
      onLayout={handleLayout}
      style={[{ height, width: '100%', overflow: 'hidden' }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {width > 0 && (
        <Animated.View style={[{ position: 'absolute', top: 0, bottom: 0, width: BAND_WIDTH_PX }, animatedStyle]}>
          <LinearGradient
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 0.5, 1]}
            colors={[transparent, peak, transparent]}
          />
        </Animated.View>
      )}
    </View>
  );
}
