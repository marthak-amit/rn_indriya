import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import type { GemType, JewelShape, MetalTone } from '@/features/catalog/types';
import { JewelArt } from './JewelArt';
import { backdropStops } from './palettes';

export interface ProductImageProps {
  uri?: string;
  shape: JewelShape;
  tone: MetalTone;
  gem: GemType;
  /** Adds a slow light sweep across the artwork. */
  shimmer?: boolean;
  padding?: number;
  /** Magnify the artwork (cropped) — used for the close-up gallery view. */
  artScale?: number;
  style?: StyleProp<ViewStyle>;
}

/** Remote photo when available, otherwise tone-matched vector artwork. */
export function ProductImage({ uri, shape, tone, gem, shimmer = false, padding = 18, artScale = 1, style }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const t = useSharedValue(0);
  useEffect(() => {
    if (!shimmer) return;
    t.value = withRepeat(withDelay(1400, withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.ease) })), -1, false);
  }, [shimmer, t]);
  const sweep = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(t.value, [0, 1], [-260, 460]) }, { rotate: '18deg' }] }));

  const showPhoto = !!uri && !failed;
  return (
    <View style={[styles.box, style]}>
      <LinearGradient colors={backdropStops[tone]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      {showPhoto ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={350} onError={() => setFailed(true)} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { padding, transform: [{ scale: artScale }] }]}><JewelArt shape={shape} tone={tone} gem={gem} /></View>
      )}
      {shimmer ? (
        <Animated.View pointerEvents="none" style={[styles.sweep, sweep]}>
          <LinearGradient colors={['transparent', 'rgba(255,255,255,0.55)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', backgroundColor: '#F5EFE6' },
  sweep: { position: 'absolute', top: -60, bottom: -60, width: 90 },
});
