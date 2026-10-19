import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedCheck } from '@/components/ui/AnimatedCheck';
import { Button } from '@/components/ui/Button';
import { Confetti } from '@/components/ui/Confetti';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/theme';
import { formatINR } from '@/utils/format';
import { useAppSelector } from '@/store/hooks';

export default function OrderSuccessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const order = useAppSelector((s) => s.orders.list.find((o) => o.id === id));
  return (
    <Screen edges={['top', 'bottom']}>
      <Confetti />
      <View style={styles.body}>
        <AnimatedCheck />
        <Animated.View entering={FadeInDown.delay(1000).springify().damping(18)} style={styles.copy}>
          <Text variant="overline" color="gold">Order confirmed</Text>
          <Text variant="title" align="center">Thank you{order?.address.name ? `, ${order.address.name.split(' ')[0]}` : ''}</Text>
          <Text variant="body" color="muted" align="center">Your jewellery is being prepared with care. We’ll keep you posted at every step.</Text>
        </Animated.View>
        {order ? (
          <Animated.View entering={FadeInDown.delay(1200).springify().damping(18)} style={styles.card}>
            <Row label="Order ID" value={order.id} />
            <Row label="Items" value={String(order.lines.reduce((n, l) => n + l.qty, 0))} />
            <Row label="Total paid" value={formatINR(order.totals.total)} strong />
          </Animated.View>
        ) : null}
        <Animated.View entering={FadeInDown.delay(1400)} style={styles.actions}>
          <Button label="View my orders" variant="secondary" onPress={() => router.replace('/orders')} style={{ flex: 1 }} size="lg" />
          <Button label="Keep shopping" onPress={() => router.replace('/shop')} style={{ flex: 1 }} size="lg" />
        </Animated.View>
      </View>
    </Screen>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text variant="body" color="muted">{label}</Text>
      <Text variant={strong ? 'price' : 'bodyStrong'}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24, width: '100%', maxWidth: 520, alignSelf: 'center' },
  copy: { alignItems: 'center', gap: 8 },
  card: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 12, width: '100%' },
});
