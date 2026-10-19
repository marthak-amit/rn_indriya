import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme';
import { Button } from './Button';
import { Text } from './Text';

export interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const float = useSharedValue(0);
  const pulse = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(withSequence(withTiming(-8, { duration: 1600, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) })), -1);
    pulse.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.out(Easing.ease) }), -1);
  }, [float, pulse]);
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ translateY: float.value }] }));
  const ring = useAnimatedStyle(() => ({ opacity: 0.5 * (1 - pulse.value), transform: [{ scale: 1 + pulse.value * 0.7 }] }));

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Animated.View style={[styles.ring, ring]} />
        <Animated.View style={[styles.badge, iconStyle]}><Ionicons name={icon} size={34} color={colors.primary} /></Animated.View>
      </View>
      <Text variant="heading" align="center">{title}</Text>
      <Text variant="body" color="muted" align="center" style={{ maxWidth: 300 }}>{message}</Text>
      {actionLabel ? <Button label={actionLabel} onPress={onAction} style={{ marginTop: 8 }} /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10, paddingHorizontal: 32, paddingVertical: 48 },
  iconWrap: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  ring: { position: 'absolute', width: 84, height: 84, borderRadius: 42, backgroundColor: colors.goldLight },
  badge: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});
