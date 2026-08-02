import { Loader } from '@goshi/consumer-components-loader';
import { Shimmer } from '@goshi/consumer-components-shimmer';
import { Icon, type IconName, useTheme } from '@goshi/consumer-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { BUTTON_SHAPE_RADIUS, resolveButtonFill, resolveButtonSize, type ButtonShape, type ButtonSize, type ButtonVariant } from './tokens.js';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style' | 'disabled'> {
  /** @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'normal' */
  size?: ButtonSize;
  /** @default 'rectangle' */
  shape?: ButtonShape;
  label?: string;
  /** Lucide icon name, rendered before the label at the size/colour the button's current state resolves to. */
  leadingIcon?: IconName;
  /** Lucide icon name, rendered after the label. */
  trailingIcon?: IconName;
  disabled?: boolean;
  /** Shows the Loader overlay and suppresses interaction, without changing the button's size (label/icons stay laid out at `opacity: 0`). */
  loading?: boolean;
  /** Shows the Shimmer skeleton-loading placeholder instead of real content. */
  skeleton?: boolean;
  /** Fills the width of its container instead of hugging content — Figma: "Hug width; use native Fill container for full width." @default false */
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Button, translated 1:1 from the Goshi Design System (Consumer) Figma file
 * (`S1RGdp8FzeLvnBtxjnqBIb`, node `2:448`). 3 sizes x 2 shapes x 4 variants x
 * 5 built states — see `./tokens.ts` for the exact per-variant/state colour
 * table and `docs/architecture/0006-figma-consumer-sync.md` for the full
 * research trail, including what's flagged rather than assumed (no `Tags`
 * design exists yet; `Focused` has no Figma instance and is implemented
 * here as a runtime focus ring instead).
 */
export function Button({
  variant = 'primary',
  size = 'normal',
  shape = 'rectangle',
  label,
  leadingIcon,
  trailingIcon,
  disabled = false,
  loading = false,
  skeleton = false,
  fullWidth = false,
  onPress,
  onFocus,
  onBlur,
  style,
  accessibilityLabel,
  ...pressableProps
}: ButtonProps) {
  const { con } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const sizeTokens = resolveButtonSize(con)[size];
  const radius = BUTTON_SHAPE_RADIUS[shape];
  const isInteractive = !disabled && !loading && !skeleton;
  const showsOverlay = loading || skeleton;
  const restingState = skeleton ? 'skeleton' : loading ? 'loading' : disabled ? 'disabled' : 'default';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading || skeleton, busy: loading }}
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
        const state = pressed && isInteractive ? 'pressed' : restingState;
        const fill = resolveButtonFill(con, variant, state);

        const containerStyle: StyleProp<ViewStyle> = [
          styles.base,
          {
            paddingHorizontal: sizeTokens.paddingX,
            paddingVertical: sizeTokens.paddingY,
            gap: sizeTokens.gap,
            borderRadius: radius,
            borderWidth: sizeTokens.borderWidth,
            borderColor: fill.border,
            overflow: skeleton ? 'hidden' : 'visible',
          },
          sizeTokens.height != null && { minHeight: sizeTokens.height },
          fullWidth && styles.fullWidth,
          isFocused && { ...styles.focusRing, borderColor: con.color.border.focus },
        ];

        const children = (
          <>
            <View
              style={[styles.content, { gap: sizeTokens.gap }, showsOverlay && styles.hidden]}
              // The real content stays laid out (not removed) during loading/skeleton so the
              // button doesn't change size — matches Figma's own technique (opacity: 0, not display: none).
            >
              {leadingIcon && <Icon name={leadingIcon} size={sizeTokens.iconSize} color={fill.text} />}
              {label != null && (
                <Text style={[sizeTokens.typography as TextStyle, { color: fill.text }]}>{label}</Text>
              )}
              {trailingIcon && <Icon name={trailingIcon} size={sizeTokens.iconSize} color={fill.text} />}
            </View>

            {loading && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={styles.centered}>
                  <Loader size={sizeTokens.iconSize} color={fill.text} label="Loading" />
                </View>
              </View>
            )}

            {skeleton && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Shimmer size={sizeTokens.height ?? sizeTokens.iconSize + sizeTokens.paddingY * 2 + sizeTokens.borderWidth * 2} />
              </View>
            )}
          </>
        );

        if (typeof fill.background === 'string') {
          return <View style={[containerStyle, { backgroundColor: fill.background }]}>{children}</View>;
        }

        return (
          <LinearGradient
            style={containerStyle}
            colors={[fill.background.from, fill.background.to]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {children}
          </LinearGradient>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderStyle: 'solid',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusRing: {
    borderWidth: 2,
  },
});
