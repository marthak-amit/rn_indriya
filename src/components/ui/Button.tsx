import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { colors, radius } from '@/theme';
import { PressableScale, type PressableScaleProps } from './PressableScale';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost';

export interface ButtonProps extends Omit<PressableScaleProps, 'children' | 'style'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

const palette: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, fg: colors.white, border: colors.primary },
  gold: { bg: colors.gold, fg: colors.white, border: colors.gold },
  secondary: { bg: colors.surface, fg: colors.primary, border: colors.primary },
  ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
};

export function Button({ label, variant = 'primary', loading, icon, size = 'md', disabled, onPress, style, ...rest }: ButtonProps) {
  const p = palette[variant];
  return (
    <PressableScale
      {...rest}
      haptic
      disabled={disabled || loading}
      onPress={onPress}
      accessibilityLabel={label}
      style={[styles.base, size === 'lg' && styles.lg, { backgroundColor: p.bg, borderColor: p.border }, style]}
    >
      <Animated.View layout={LinearTransition.duration(220)} style={styles.row}>
        {loading ? (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <ActivityIndicator color={p.fg} size="small" />
          </Animated.View>
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={18} color={p.fg} /> : null}
            <Text variant="button" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={{ color: p.fg, flexShrink: 1 }}>
              {label}
            </Text>
          </>
        )}
      </Animated.View>
      {loading ? <View pointerEvents="none" /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 48, paddingHorizontal: 18, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  lg: { minHeight: 56, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
