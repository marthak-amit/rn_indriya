import { useEffect } from 'react';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const CIRCLE_LEN = 2 * Math.PI * 44;
const CHECK_LEN = 62;

/** Circle draws itself, then the tick strokes in, then the whole badge settles with a spring. */
export function AnimatedCheck({ size = 120 }: { size?: number }) {
  const ring = useSharedValue(0);
  const tick = useSharedValue(0);
  const pop = useSharedValue(0.6);
  useEffect(() => {
    ring.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    tick.value = withDelay(550, withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) }));
    pop.value = withDelay(900, withSpring(1, { damping: 8, stiffness: 160 }));
  }, [ring, tick, pop]);
  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCLE_LEN * (1 - ring.value) }));
  const tickProps = useAnimatedProps(() => ({ strokeDashoffset: CHECK_LEN * (1 - tick.value) }));
  const scale = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  return (
    <Animated.View style={scale}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={44} stroke={colors.goldPale} strokeWidth={5} fill={colors.goldPale} fillOpacity={0.35} />
        <AnimatedCircle cx={50} cy={50} r={44} stroke={colors.gold} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={CIRCLE_LEN} animatedProps={ringProps} rotation={-90} origin="50, 50" />
        <AnimatedPath d="M30 52 L44 66 L71 36" stroke={colors.primary} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={CHECK_LEN} animatedProps={tickProps} />
      </Svg>
    </Animated.View>
  );
}
