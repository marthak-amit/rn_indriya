import { TextStyle } from 'react-native';

// Indriya's site uses Bricolage Grotesque (body/UI). Headings use Begum Sans (commercial), approximated with Bricolage.
export const fonts = {
  display: 'BricolageGrotesque_400Regular',
  displayBold: 'BricolageGrotesque_600SemiBold',
  displayItalic: 'BricolageGrotesque_400Regular',
  body: 'BricolageGrotesque_400Regular',
  bodyLight: 'BricolageGrotesque_400Regular',
  bodyMedium: 'BricolageGrotesque_500Medium',
  bodySemi: 'BricolageGrotesque_600SemiBold',
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
  hero: { fontFamily: fonts.display, fontSize: 38, lineHeight: 44, letterSpacing: -0.3 },
  title: { fontFamily: fonts.displayBold, fontSize: 28, lineHeight: 34, letterSpacing: -0.4 },
  heading: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  subheading: { fontFamily: fonts.bodyMedium, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17 },
  overline: { fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 14, letterSpacing: 2, textTransform: 'uppercase' },
  price: { fontFamily: fonts.bodySemi, fontSize: 16, lineHeight: 22 },
  button: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 18, letterSpacing: 1.1, textTransform: 'uppercase' },
};
