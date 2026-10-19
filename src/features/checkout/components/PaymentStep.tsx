import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, interpolateColor, useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import type { PaymentMethod } from '@/services/api/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, motion, radius } from '@/theme';
import { setPayment, setStep } from '../checkoutSlice';

export const PAYMENT_LABELS: Record<PaymentMethod, string> = { upi: 'UPI', card: 'Credit / Debit card', cod: 'Pay on delivery' };
const OPTIONS: { key: PaymentMethod; icon: keyof typeof Ionicons.glyphMap; note: string }[] = [
  { key: 'upi', icon: 'phone-portrait-outline', note: 'Pay instantly with any UPI app' },
  { key: 'card', icon: 'card-outline', note: 'Visa, Mastercard, RuPay' },
  { key: 'cod', icon: 'cash-outline', note: 'Pay when your order arrives' },
];

function Option({ opt, selected, onPress }: { opt: (typeof OPTIONS)[number]; selected: boolean; onPress: () => void }) {
  const p = useDerivedValue(() => withTiming(selected ? 1 : 0, { duration: 240 }), [selected]);
  const radio = useDerivedValue(() => withSpring(selected ? 1 : 0, motion.springSnappy), [selected]);
  const box = useAnimatedStyle(() => ({ borderColor: interpolateColor(p.value, [0, 1], [colors.line, colors.primary]), backgroundColor: interpolateColor(p.value, [0, 1], [colors.surface, colors.primarySoft]) }));
  const dot = useAnimatedStyle(() => ({ transform: [{ scale: radio.value }] }));
  return (
    <PressableScale onPress={onPress} haptic pressedScale={0.98} accessibilityState={{ selected }} accessibilityLabel={PAYMENT_LABELS[opt.key]}>
      <Animated.View style={[styles.opt, box]}>
        <Ionicons name={opt.icon} size={24} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text variant="subheading">{PAYMENT_LABELS[opt.key]}</Text>
          <Text variant="caption" color="muted">{opt.note}</Text>
        </View>
        <View style={styles.radio}><Animated.View style={[styles.radioDot, dot]} /></View>
      </Animated.View>
    </PressableScale>
  );
}

export function PaymentStep() {
  const dispatch = useAppDispatch();
  const payment = useAppSelector((s) => s.checkout.payment);
  return (
    <View style={{ gap: 14 }}>
      <Text variant="heading">How would you like to pay?</Text>
      {OPTIONS.map((o) => <Option key={o.key} opt={o} selected={payment === o.key} onPress={() => dispatch(setPayment(o.key))} />)}
      <Animated.View entering={FadeIn} style={styles.note}>
        <Ionicons name="information-circle-outline" size={18} color={colors.gold} />
        <Text variant="caption" color="inkSoft" style={{ flex: 1 }}>This is a demo checkout — no payment is processed.</Text>
      </Animated.View>
      <View style={styles.actions}>
        <Button label="Back" variant="secondary" onPress={() => dispatch(setStep(0))} style={{ flex: 1 }} size="lg" />
        <Button label="Review order" onPress={() => dispatch(setStep(2))} style={{ flex: 2 }} size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  opt: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, borderWidth: 1.5 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  note: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 4 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 4 },
});
