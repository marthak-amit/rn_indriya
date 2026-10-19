import { forwardRef, type ComponentRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { colors, textVariants, type ColorToken, type TextVariant } from '@/theme';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: ColorToken;
  align?: TextStyle['textAlign'];
}

export const Text = forwardRef<ComponentRef<typeof RNText>, TextProps>(function Text({ variant = 'body', color = 'ink', align, style, ...rest }, ref) {
  return <RNText ref={ref} {...rest} style={[textVariants[variant], { color: colors[color] }, align ? { textAlign: align } : null, style]} />;
});
