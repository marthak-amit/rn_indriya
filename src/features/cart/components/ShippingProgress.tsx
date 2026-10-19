import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { colors, motion, radius } from '@/theme';
import { formatINR } from '@/utils/format';
import { freeShippingProgress } from '../pricing';

export function ShippingProgress({ amountAfterDiscount }: { amountAfterDiscount: number }) {
  const { remaining, progress } = freeShippingProgress(amountAfterDiscount);
  const p = useDerivedValue(() => withSpring(progress, motion.spring), [progress]);
  const bar = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  const done = remaining === 0;
  return (
    <View style={[styles.box, done && styles.done]}>
      <View style={styles.row}>
        <Ionicons name={done ? 'checkmark-circle' : 'cube-outline'} size={18} color={done ? colors.success : colors.primary} />
        <Animated.View key={String(done)} entering={FadeIn} style={{ flex: 1 }}>
          <Text variant="bodyStrong" style={{ fontSize: 14 }} color={done ? 'success' : 'ink'}>
            {done ? 'You’ve unlocked free shipping' : `Add ${formatINR(remaining)} more for free shipping`}
          </Text>
        </Animated.View>
      </View>
      <View style={styles.track}><Animated.View style={[styles.fill, bar, done && { backgroundColor: colors.success }]} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: 14, gap: 10 },
  done: { backgroundColor: colors.successSoft },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.07)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: colors.gold },
});
