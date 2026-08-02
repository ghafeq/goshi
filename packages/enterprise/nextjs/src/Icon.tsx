'use client';

import {
  iconSize as iconSizeTokens,
  iconStrokeWidth as iconStrokeWidthTokens,
  resolveIconSize,
  resolveIconStrokeWidth,
  type IconTokenProps,
} from '@epds/foundations-icons';
import { icons } from 'lucide-react';
import React from 'react';

export type IconName = keyof typeof icons;

export interface IconProps extends IconTokenProps {
  name: IconName;
}

/**
 * Enterprise icon component — wraps `lucide-react`. Size, colour, stroke
 * width and `label` are controlled via the shared `@epds/foundations-icons`
 * tokens/props, matching `@epds/consumer-react-native`'s `Icon` API exactly.
 * `label` maps to `aria-label` internally.
 */
export function Icon({ name, size = 'md', strokeWidth = 'regular', color, label }: IconProps) {
  const LucideIcon = icons[name];
  return (
    <LucideIcon
      size={resolveIconSize(size)}
      strokeWidth={resolveIconStrokeWidth(strokeWidth)}
      color={color}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable={false}
    />
  );
}

export { iconSizeTokens, iconStrokeWidthTokens };
