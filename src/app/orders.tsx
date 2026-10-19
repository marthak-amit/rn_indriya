import { Ionicons } from '@expo/vector-icons';
import { useGoBack } from '@/hooks/useGoBack';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';
import { ProductImage } from '@/components/jewel/ProductImage';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { Reveal } from '@/components/ui/Reveal';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useAppSelector } from '@/store/hooks';
import type { Order } from '@/services/api/types';
import { colors, motion, radius, shadow } from '@/theme';
import { formatINR } from '@/utils/format';

const STAGES: Order['status'][] = ['confirmed', 'packed', 'shipped', 'delivered'];

function Timeline({ status }: { status: Order['status'] }) {
  const idx = STAGES.indexOf(status);
  const p = useDerivedValue(() => withSpring(idx / (STAGES.length - 1), motion.spring), [idx]);
  const fill = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  return (
    <View style={{ marginTop: 6 }}>
      <View style={styles.track}><Animated.View style={[styles.trackFill, fill]} /></View>
      <View style={styles.stages}>
        {STAGES.map((s, i) => (
          <View key={s} style={{ alignItems: i === 0 ? 'flex-start' : i === STAGES.length - 1 ? 'flex-end' : 'center', flex: 1 }}>
            <Text variant="caption" color={i <= idx ? 'primary' : 'muted'} style={{ textTransform: 'capitalize' }}>{s}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const rot = useDerivedValue(() => withSpring(open ? 180 : 0, motion.spring), [open]);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  return (
    <Reveal index={index}>
      <Animated.View layout={LinearTransition.springify().damping(22)} style={[styles.card, shadow.soft]}>
        <PressableScale onPress={() => setOpen((o) => !o)} haptic pressedScale={0.985} style={styles.head}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="bodyStrong">{order.id}</Text>
            <Text variant="caption" color="muted">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {formatINR(order.totals.total)}</Text>
          </View>
          <View style={styles.pill}><Text variant="caption" color="success" style={{ textTransform: 'capitalize', fontFamily: 'Jost_500Medium' }}>{order.status}</Text></View>
          <Animated.View style={chevron}><Ionicons name="chevron-down" size={20} color={colors.muted} /></Animated.View>
        </PressableScale>
        {open ? (
          <Reveal kind="fade">
            <View style={{ gap: 12, paddingTop: 12 }}>
              <Timeline status={order.status} />
              {order.lines.map((l) => (
                <View key={l.productId + (l.size ?? '')} style={styles.line}>
                  <ProductImage uri={l.imageUrl} shape={l.shape as never} tone={l.tone as never} gem={l.gem as never} padding={4} style={styles.thumb} />
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyStrong" numberOfLines={1}>{l.name}</Text>
                    <Text variant="caption" color="muted">Qty {l.qty}{l.size ? ` · Size ${l.size}` : ''}</Text>
                  </View>
                  <Text variant="price">{formatINR(l.unitPrice * l.qty)}</Text>
                </View>
              ))}
              <Text variant="caption" color="muted">Delivering to {order.address.name}, {order.address.city} – {order.address.pincode}</Text>
            </View>
          </Reveal>
        ) : null}
      </Animated.View>
    </Reveal>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const orders = useAppSelector((s) => s.orders.list);
  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-back" label="Back" onPress={goBack} />
        <Text variant="heading" style={{ flex: 1, textAlign: 'center' }}>My orders</Text>
        <View style={{ width: 42 }} />
      </View>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => <OrderCard order={item} index={index} />}
        ListEmptyComponent={<EmptyState icon="receipt-outline" title="No orders yet" message="When you place an order it will appear here with live status." actionLabel="Start shopping" onAction={() => router.replace('/shop')} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6 },
  list: { padding: 16, gap: 14, width: '100%', maxWidth: 640, alignSelf: 'center', flexGrow: 1 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pill: { backgroundColor: colors.successSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 48, height: 48, borderRadius: radius.sm },
  track: { height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' },
  trackFill: { height: '100%', backgroundColor: colors.primary },
  stages: { flexDirection: 'row', marginTop: 6 },
});
