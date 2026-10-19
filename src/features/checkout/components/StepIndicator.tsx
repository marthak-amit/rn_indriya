import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { colors, motion } from '@/theme';
import { CHECKOUT_STEPS } from '../checkoutSlice';

function Dot({ i, step }: { i: number; step: number }) {
  const p = useDerivedValue(() => withTiming(step >= i ? 1 : 0, { duration: 300 }), [step]);
  const pop = useDerivedValue(() => withSpring(step === i ? 1.12 : 1, motion.springSnappy), [step]);
  const dot = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.surface, colors.primary]),
    borderColor: interpolateColor(p.value, [0, 1], [colors.line, colors.primary]),
    transform: [{ scale: pop.value }],
  }));
  return (
    <Animated.View style={[styles.dot, dot]}>
      {step > i ? <Ionicons name="checkmark" size={16} color={colors.white} /> : <Text variant="caption" style={{ color: step >= i ? colors.white : colors.muted, fontFamily: 'BricolageGrotesque_600SemiBold' }}>{i + 1}</Text>}
    </Animated.View>
  );
}

/** Dots joined by a progress bar that fills with a spring as the user advances. */
export function StepIndicator({ step }: { step: number }) {
  const progress = useDerivedValue(() => withSpring(step / (CHECKOUT_STEPS.length - 1), motion.spring), [step]);
  const fill = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  return (
    <View style={styles.wrap}>
      <View style={styles.track}><Animated.View style={[styles.fill, fill]} /></View>
      <View style={styles.row}>
        {CHECKOUT_STEPS.map((label, i) => (
          <View key={label} style={styles.step}>
            <Dot i={i} step={step} />
            <Text variant="caption" color={step >= i ? 'primary' : 'muted'} style={{ fontFamily: 'BricolageGrotesque_500Medium' }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 36, paddingVertical: 8 },
  track: { position: 'absolute', left: 36 + 60, right: 36 + 60, top: 8 + 15, height: 3, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  step: { alignItems: 'center', gap: 6, width: 72 },
  dot: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
