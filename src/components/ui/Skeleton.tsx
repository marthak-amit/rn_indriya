import { useEffect } from 'react';
import { StyleSheet, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '@/theme';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Loading placeholder with a travelling highlight. */
export function Skeleton({ width = '100%', height = 16, radius: r = radius.md, style }: SkeletonProps) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.ease) }), -1, false);
  }, [t]);
  const sweep = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(t.value, [0, 1], [-220, 220]) }] }));
  return (
    <Animated.View style={[{ width, height, borderRadius: r, backgroundColor: colors.surfaceAlt, overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { width: 160 }, sweep]}>
        <LinearGradient colors={['transparent', 'rgba(255,255,255,0.75)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </Animated.View>
  );
}
