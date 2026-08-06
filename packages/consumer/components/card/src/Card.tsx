import { Shimmer } from '@goshi/consumer-components-shimmer';
import { Icon, type IconName, useTheme } from '@goshi/consumer-react-native';
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { CARD_FEATURED_BORDER_WIDTH, CARD_RADIUS, resolveCardFill, resolveCardSize, type CardAlignment, type CardHierarchy, type CardSize } from './tokens.js';

export interface CardProps {
  title?: string;
  body?: string;
  /** Lucide icon name, rendered above/before the content at the card's resolved text colour. */
  icon?: IconName;
  /** @default 'standard' */
  hierarchy?: CardHierarchy;
  /** @default 'bare' */
  size?: CardSize;
  /** @default 'start' */
  alignment?: CardAlignment;
  /** Shows a loading placeholder instead of title/body/icon. */
  skeleton?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card — informational card, translated 1:1 from the Goshi Design System
 * (Consumer) Figma file (`S1RGdp8FzeLvnBtxjnqBIb`, node `73:282`, page
 * "Cards & Tiles"). 4 sizes x 3 hierarchies x 2 alignments x 2 states
 * (Default/Skeleton only — no interaction states; see
 * `@goshi/consumer-components-tile` for the selectable equivalent).
 */
export function Card({ title = 'Title', body, icon, hierarchy = 'standard', size = 'bare', alignment = 'start', skeleton = false, style }: CardProps) {
  const { con } = useTheme();
  const fill = resolveCardFill(con, hierarchy);
  const sizeTokens = resolveCardSize(con)[size];
  const isCentered = alignment === 'center';

  const containerStyle: StyleProp<ViewStyle> = [
    {
      backgroundColor: fill.background,
      borderRadius: CARD_RADIUS,
      padding: sizeTokens.padding,
      gap: sizeTokens.gap,
      alignItems: isCentered ? 'center' : 'flex-start',
      overflow: skeleton ? 'hidden' : 'visible',
    },
    fill.border != null && { borderWidth: CARD_FEATURED_BORDER_WIDTH, borderColor: fill.border },
    style,
  ];

  if (skeleton) {
    // Shimmer needs an explicit pixel height (it can't measure a flex-fill
    // parent) — computed from the same placeholder-block dimensions drawn
    // below, plus padding, rather than a magic number.
    const titleBlockHeight = 18;
    const bodyLineHeight = 12;
    const blockGap = 4;
    const contentHeight = titleBlockHeight + blockGap + bodyLineHeight + blockGap + bodyLineHeight;
    const skeletonHeight = sizeTokens.padding * 2 + sizeTokens.iconSize + sizeTokens.gap + contentHeight;

    return (
      <View style={containerStyle} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={{ width: sizeTokens.iconSize, height: sizeTokens.iconSize, borderRadius: 4, backgroundColor: fill.skeletonPlaceholder }} />
        <View style={{ gap: blockGap, alignItems: isCentered ? 'center' : 'flex-start', alignSelf: 'stretch' }}>
          <View style={{ width: 96, height: titleBlockHeight, borderRadius: 2, backgroundColor: fill.skeletonPlaceholder }} />
          <View style={{ alignSelf: 'stretch', height: bodyLineHeight, borderRadius: 2, backgroundColor: fill.skeletonPlaceholder }} />
          <View style={{ width: 106, height: bodyLineHeight, borderRadius: 2, backgroundColor: fill.skeletonPlaceholder }} />
        </View>
        <View style={StyleSheet.absoluteFill}>
          <Shimmer size={skeletonHeight} />
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
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
}
