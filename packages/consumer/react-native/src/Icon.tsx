import {
  iconSize as iconSizeTokens,
  iconStrokeWidth as iconStrokeWidthTokens,
  resolveIconSize,
  resolveIconStrokeWidth,
  type IconTokenProps,
} from '@goshi/foundations-icons';
import { icons } from 'lucide-react-native';
import React from 'react';

export type IconName = keyof typeof icons;

export interface IconProps extends IconTokenProps {
  name: IconName;
}

/**
 * Consumer icon component — wraps `lucide-react-native`. Size, colour,
 * stroke width and `label` are controlled via the shared
 * `@goshi/foundations-icons` tokens/props, matching
 * `@goshi/enterprise-nextjs`'s `Icon` API exactly. `label` maps to RN's own
 * accessibility props internally.
 */
export function Icon({ name, size = 'md', strokeWidth = 'regular', color, label }: IconProps) {
  const LucideIcon = icons[name];
  return (
    <LucideIcon
      size={resolveIconSize(size)}
      strokeWidth={resolveIconStrokeWidth(strokeWidth)}
      color={color}
      accessible={Boolean(label)}
      accessibilityLabel={label}
      accessibilityRole={label ? 'image' : undefined}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
    />
  );
}

export { iconSizeTokens, iconStrokeWidthTokens };
