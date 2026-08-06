import { Shimmer } from '@goshi/consumer-components-shimmer';
import { Icon, type IconName, useTheme } from '@goshi/consumer-react-native';
import React from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { TAG_BORDER_WIDTH, TAG_SHAPE_RADIUS, resolveTagFill, resolveTagSize, type TagEmphasis, type TagShape, type TagSize, type TagTone } from './tokens.js';

export interface TagProps {
  label?: string;
  /** @default 'positive' */
  tone?: TagTone;
  /** @default 'normal' */
  size?: TagSize;
  /** @default 'sharp' */
  shape?: TagShape;
  /** @default 'solid' */
  emphasis?: TagEmphasis;
  /** Lucide icon name, rendered before the label at the tag's resolved size/colour. Figma's defaults per tone: circle-check (positive), triangle-alert (caution), circle-alert (critical), info (neutral), clock (pending), minus (muted). */
  icon?: IconName;
  /**
   * Shows a loading placeholder instead of the label/icon. A skeleton tag
   * has no content to size itself against, so its width must be supplied —
   * there's no Figma-derived default to fall back to.
   */
  skeleton?: boolean;
  skeletonWidth?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Tag — non-interactive status/category/metadata label, translated 1:1
 * from the Goshi Design System (Consumer) Figma file
 * (`S1RGdp8FzeLvnBtxjnqBIb`, node `2:6442`). 2 sizes x 2 shapes x 2
 * emphases x 5 confirmed tones (a documented 6th, "Caution", has no built
 * Figma instance — see `./tokens.ts`).
 *
 * Not interactive — no press/focus handling. For interactive or
 * dismissible use, Figma's own description points to "a Chip component,"
 * which doesn't exist in the file yet (flagged, not built).
 */
export function Tag({ label, tone = 'positive', size = 'normal', shape = 'sharp', emphasis = 'solid', icon, skeleton = false, skeletonWidth = 80, style }: TagProps) {
  const { con } = useTheme();
  const sizeTokens = resolveTagSize(con)[size];
  const radius = TAG_SHAPE_RADIUS[shape];

  if (skeleton) {
    return (
      <View
        style={[
          {
            height: sizeTokens.height,
            width: skeletonWidth,
            borderRadius: radius,
            backgroundColor: con.color.action.entry.backgroundDisabled,
            overflow: 'hidden',
          },
          style,
        ]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Shimmer size={sizeTokens.height} />
      </View>
    );
  }

  const fill = resolveTagFill(con, tone, emphasis);

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: sizeTokens.gap,
          paddingHorizontal: sizeTokens.paddingX,
          paddingVertical: sizeTokens.paddingY,
          borderRadius: radius,
          borderWidth: TAG_BORDER_WIDTH,
          borderColor: fill.border,
          backgroundColor: fill.background,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={sizeTokens.iconSize} color={fill.text} />}
      {label != null && <Text style={[sizeTokens.typography as TextStyle, { color: fill.text }]}>{label}</Text>}
    </View>
  );
}
