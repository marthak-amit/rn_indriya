import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, SlideOutUp, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming, interpolate } from 'react-native-reanimated';
import Svg, { Path, Polygon } from 'react-native-svg';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { brand } from '@/config/brand';
import { colors, fonts } from '@/theme';
import { Text } from '@/components/ui/Text';
import { splashFinished } from './uiSlice';

const LETTERS = brand.name.toUpperCase().split('');

/** Brand intro: gem facets bloom, wordmark rises letter by letter, a light sweeps across, then the curtain lifts. */
export function AnimatedSplash() {
  const dispatch = useAppDispatch();
  const done = useAppSelector((s) => s.ui.splashDone);
  const gem = useSharedValue(0);
  const line = useSharedValue(0);
  const sweep = useSharedValue(0);

  useEffect(() => {
    gem.value = withTiming(1, { duration: 1100, easing: Easing.out(Easing.back(1.4)) });
    line.value = withDelay(900, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    sweep.value = withDelay(1300, withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }), 1, false));
    const id = setTimeout(() => dispatch(splashFinished()), 2900);
    return () => clearTimeout(id);
  }, [dispatch, gem, line, sweep]);

  const gemStyle = useAnimatedStyle(() => ({ opacity: gem.value, transform: [{ scale: interpolate(gem.value, [0, 1], [0.4, 1]) }, { rotate: `${interpolate(gem.value, [0, 1], [-30, 0])}deg` }] }));
  const lineStyle = useAnimatedStyle(() => ({ width: 160 * line.value, opacity: line.value }));
  const sweepStyle = useAnimatedStyle(() => ({ opacity: sweep.value > 0 && sweep.value < 1 ? 1 : 0, transform: [{ translateX: interpolate(sweep.value, [0, 1], [-200, 200]) }, { rotate: '18deg' }] }));

  if (done) return null;
  return (
    <Animated.View exiting={SlideOutUp.duration(650).easing(Easing.inOut(Easing.cubic))} style={[StyleSheet.absoluteFill, { zIndex: 999 }]} pointerEvents="auto">
      <LinearGradient colors={[colors.primaryDark, colors.primary, '#0B47A3']} style={styles.fill} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}>
        <Animated.View style={gemStyle}>
          <Svg width={96} height={96} viewBox="-50 -50 100 100">
            <Polygon points="0,-40 28,-24 40,4 16,40 -16,40 -40,4 -28,-24" fill="none" stroke={colors.goldLight} strokeWidth={2.4} strokeLinejoin="round" />
            <Path d="M-40 4 L40 4 M-28 -24 L-16 40 M28 -24 L16 40 M0 -40 L0 40 M-28 -24 L28 -24" stroke={colors.gold} strokeOpacity={0.8} strokeWidth={1.4} />
            <Polygon points="-28,-24 0,-40 28,-24 0,4" fill={colors.goldLight} fillOpacity={0.28} />
          </Svg>
        </Animated.View>
        <View style={styles.letters}>
          {LETTERS.map((l, i) => (
            <Animated.View key={i} entering={FadeInDown.delay(500 + i * 90).duration(600).springify().damping(16)}>
              <Text color="white" style={{ fontFamily: fonts.displayBold, fontSize: 44, letterSpacing: 8, lineHeight: 52 }}>{l}</Text>
            </Animated.View>
          ))}
          <Animated.View pointerEvents="none" style={[styles.sweep, sweepStyle]}>
            <LinearGradient colors={['transparent', 'rgba(255,255,255,0.55)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          </Animated.View>
        </View>
        <Animated.View style={[styles.line, lineStyle]} />
        <Animated.View entering={FadeIn.delay(1400).duration(700)}>
          <Text variant="overline" color="goldLight" style={{ letterSpacing: 3.5 }}>{brand.tagline}</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 },
  letters: { flexDirection: 'row', overflow: 'hidden' },
  sweep: { position: 'absolute', top: -20, bottom: -20, width: 60 },
  line: { height: 1.5, backgroundColor: colors.gold },
});
