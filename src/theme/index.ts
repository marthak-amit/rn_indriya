import { Platform, ViewStyle } from 'react-native';
export { colors } from './colors';
export type { ColorToken } from './colors';
export { fonts, textVariants } from './typography';
export type { TextVariant } from './typography';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 6, md: 12, lg: 18, xl: 28, pill: 999 } as const;

export const shadow = {
  soft: Platform.select<ViewStyle>({
    web: { boxShadow: '0 6px 20px rgba(60,30,20,0.08)' } as ViewStyle,
    default: { shadowColor: '#3C1E14', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  }) as ViewStyle,
  lifted: Platform.select<ViewStyle>({
    web: { boxShadow: '0 14px 36px rgba(60,30,20,0.16)' } as ViewStyle,
    default: { shadowColor: '#3C1E14', shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  }) as ViewStyle,
} as const;

/** Shared animation constants so motion feels consistent across the app. */
export const motion = {
  spring: { damping: 18, stiffness: 180, mass: 0.9 },
  springSnappy: { damping: 14, stiffness: 320, mass: 0.7 },
  fast: 180,
  base: 320,
  slow: 600,
  stagger: 70,
} as const;
