import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme';

/** Cheap integer hash → [0,1). Good enough to decorrelate particle parameters. */
const hash = (n: number): number => {
  let x = (n + 0x9e3779b9) | 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};
const PALETTE = [colors.gold, colors.goldLight, colors.primary, colors.rose, '#FFFFFF'];

function Piece({ i, w, h }: { i: number; w: number; h: number }) {
  const cfg = useMemo(() => {
    const r = (n: number) => hash(i * 31 + n);
    return { x: r(1) * w, drift: (r(2) - 0.5) * 140, delay: r(3) * 500, dur: 1800 + r(4) * 1400, spin: (r(5) - 0.5) * 900, size: 6 + r(6) * 8, color: PALETTE[i % PALETTE.length], round: r(7) > 0.6 };
  }, [i, w]);
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(cfg.delay, withTiming(1, { duration: cfg.dur, easing: Easing.out(Easing.quad) }));
  }, [cfg, p]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - Math.max(0, p.value - 0.7) / 0.3,
    transform: [{ translateX: cfg.drift * p.value }, { translateY: -h * 0.18 + h * 0.75 * p.value * p.value + Math.sin(p.value * 8) * 6 }, { rotate: `${cfg.spin * p.value}deg` }],
  }));
  return <Animated.View style={[{ position: 'absolute', left: cfg.x, top: 0, width: cfg.size, height: cfg.round ? cfg.size : cfg.size * 0.5, borderRadius: cfg.round ? cfg.size : 1, backgroundColor: cfg.color }, style]} />;
}

/** One-shot celebratory burst (order success). */
export function Confetti({ count = 46 }: { count?: number }) {
  const { width, height } = useWindowDimensions();
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: count }, (_, i) => (
        <Piece key={i} i={i} w={width} h={height} />
      ))}
    </View>
  );
}
