import { View } from 'react-native';
import { fonts } from '@/theme';
import { Text } from './Text';

/** Text wordmark. Swap for the official logo asset once available. */
export function Wordmark({ size = 22, color = 'primary' as const, spacing = 6 }: { size?: number; color?: 'primary' | 'white' | 'gold'; spacing?: number }) {
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="Indriya">
      <Text color={color} style={{ fontFamily: fonts.displayBold, fontSize: size, letterSpacing: spacing, lineHeight: size * 1.2 }}>INDRIYA</Text>
    </View>
  );
}
