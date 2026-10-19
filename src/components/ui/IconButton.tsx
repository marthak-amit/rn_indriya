import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, shadow } from '@/theme';
import { PressableScale, type PressableScaleProps } from './PressableScale';

export interface IconButtonProps extends Omit<PressableScaleProps, 'children' | 'style'> {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  filled?: boolean;
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({ name, size = 22, color = colors.ink, filled = true, label, style, ...rest }: IconButtonProps) {
  return (
    <PressableScale {...rest} haptic accessibilityLabel={label} style={[styles.base, filled && styles.filled, style]}>
      <Ionicons name={name} size={size} color={color} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  filled: { backgroundColor: colors.surface, ...shadow.soft },
});
