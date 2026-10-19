import { TextStyle } from 'react-native';

export const fonts = {
  display: 'CormorantGaramond_500Medium',
  displayBold: 'CormorantGaramond_600SemiBold',
  displayItalic: 'CormorantGaramond_500Medium_Italic',
  body: 'Jost_400Regular',
  bodyLight: 'Jost_300Light',
  bodyMedium: 'Jost_500Medium',
  bodySemi: 'Jost_600SemiBold',
} as const;

export type TextVariant =
  | 'hero'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'overline'
  | 'price'
  | 'button';

export const textVariants: Record<TextVariant, TextStyle> = {
  hero: { fontFamily: fonts.display, fontSize: 40, lineHeight: 44, letterSpacing: 0.2 },
  title: { fontFamily: fonts.displayBold, fontSize: 30, lineHeight: 34 },
  heading: { fontFamily: fonts.displayBold, fontSize: 24, lineHeight: 28 },
  subheading: { fontFamily: fonts.bodyMedium, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17 },
  overline: { fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 14, letterSpacing: 2, textTransform: 'uppercase' },
  price: { fontFamily: fonts.bodySemi, fontSize: 16, lineHeight: 22 },
  button: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 18, letterSpacing: 1.1, textTransform: 'uppercase' },
};
