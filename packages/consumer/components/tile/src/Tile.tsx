import { Shimmer } from '@goshi/consumer-components-shimmer';
import { Icon, type IconName, useTheme } from '@goshi/consumer-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { TILE_RADIUS, resolveTileFill, resolveTileSize, type TileAlignment, type TileHierarchy, type TileSize } from './tokens.js';

export interface TileProps extends Omit<PressableProps, 'children' | 'style' | 'disabled'> {
  title?: string;
  body?: string;
  /** Lucide icon name, rendered above/before the content at the tile's resolved text colour. */
  icon?: IconName;
  /** @default 'standard' */
  hierarchy?: TileHierarchy;
  /** @default 'bare' */
  size?: TileSize;
  /** @default 'start' */
  alignment?: TileAlignment;
  disabled?: boolean;
  /** Shows a loading placeholder instead of title/body/icon. Suppresses interaction. */
  skeleton?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Tile — selectable/navigational tile, translated 1:1 from the Goshi
 * Design System (Consumer) Figma file (`S1RGdp8FzeLvnBtxjnqBIb`, node
 * `74:529`, page "Cards & Tiles"). 4 sizes x 3 hierarchies x 2 alignments
 * x 5 states (Default/Pressed/Focus/Disabled/Skeleton) — unlike Button,
 * Focus has real built Figma instances here, so it's driven by
 * `./tokens.ts`'s colour table rather than a bolted-on runtime ring.
 *
 * Figma's written description calls for a dashed border on Disabled ("so
 * it does not rely on colour alone") that no built instance actually has —
 * implemented without it, flagged in `./tokens.ts` and the README.
 */
export function Tile({
  title = 'Title',
  body,
  icon,
  hierarchy = 'standard',
  size = 'bare',
  alignment = 'start',
  disabled = false,
  skeleton = false,
  onPress,
  onFocus,
  onBlur,
  style,
  accessibilityLabel,
  ...pressableProps
}: TileProps) {
  const { con } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const sizeTokens = resolveTileSize(con)[size];
  const isCentered = alignment === 'center';
  const isInteractive = !disabled && !skeleton;

  if (skeleton) {
    const titleBlockHeight = 16;
    const bodyLineHeight = 12;
    const blockGap = 4;
    const contentHeight = titleBlockHeight + blockGap + bodyLineHeight;
    const skeletonHeight = sizeTokens.padding * 2 + sizeTokens.iconSize + sizeTokens.gap + contentHeight;
    const trough = resolveTileFill(con, hierarchy, 'disabled').background;

    return (
      <View
        style={[
          {
            backgroundColor: con.color.surface.layer1.surface,
            borderRadius: TILE_RADIUS,
            padding: sizeTokens.padding,
            gap: sizeTokens.gap,
            alignItems: isCentered ? 'center' : 'flex-start',
            overflow: 'hidden',
          },
          style,
        ]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={{ width: sizeTokens.iconSize, height: sizeTokens.iconSize, borderRadius: 4, backgroundColor: trough }} />
        <View style={{ gap: blockGap, alignItems: isCentered ? 'center' : 'flex-start', alignSelf: 'stretch' }}>
          <View style={{ width: 110, height: titleBlockHeight, borderRadius: 2, backgroundColor: trough }} />
          <View style={{ alignSelf: 'stretch', height: bodyLineHeight, borderRadius: 2, backgroundColor: trough }} />
        </View>
        <View style={StyleSheet.absoluteFill}>
          <Shimmer size={skeletonHeight} />
        </View>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      disabled={!isInteractive}
      onPress={onPress}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      style={style}
      {...pressableProps}
    >
      {({ pressed }) => {
        const state = disabled ? 'disabled' : isFocused ? 'focus' : pressed ? 'pressed' : 'default';
        const fill = resolveTileFill(con, hierarchy, state);

        return (
          <View
            style={[
              {
                backgroundColor: fill.background,
                borderRadius: TILE_RADIUS,
                padding: sizeTokens.padding,
                gap: sizeTokens.gap,
                alignItems: isCentered ? 'center' : 'flex-start',
              },
              fill.border != null && { borderWidth: fill.borderWidth ?? 1, borderColor: fill.border },
            ]}
          >
            {icon && <Icon name={icon} size={sizeTokens.iconSize} color={fill.text} />}
            <View style={{ gap: 4, alignItems: isCentered ? 'center' : 'flex-start', alignSelf: 'stretch' }}>
              {title != null && (
                <Text style={[sizeTokens.titleTypography as TextStyle, { color: fill.text, textAlign: isCentered ? 'center' : 'left', alignSelf: 'stretch' }]}>
                  {title}
                </Text>
              )}
              {body != null && (
                <Text style={[sizeTokens.bodyTypography as TextStyle, { color: fill.text, textAlign: isCentered ? 'center' : 'left', alignSelf: 'stretch' }]}>
                  {body}
                </Text>
              )}
            </View>
          </View>
        );
      }}
    </Pressable>
  );
}
