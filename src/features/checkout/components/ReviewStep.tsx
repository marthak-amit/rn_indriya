import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ProductImage } from '@/components/jewel/ProductImage';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { PriceSummary } from '@/features/cart/components/PriceSummary';
import { selectCartCoupon, selectCartLines, selectCartTotals } from '@/features/catalog/selectors';
import { showToast } from '@/features/ui/uiSlice';
import { usePlaceOrderMutation } from '@/services/api/indriyaApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, radius } from '@/theme';
import { formatINR } from '@/utils/format';
import { setStep } from '../checkoutSlice';
import { PAYMENT_LABELS } from './PaymentStep';

export function ReviewStep() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lines = useAppSelector(selectCartLines);
  const totals = useAppSelector(selectCartTotals);
  const coupon = useAppSelector(selectCartCoupon);
  const { address, payment } = useAppSelector((s) => s.checkout);
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  const submit = async () => {
    const res = await placeOrder({
      lines: lines.map((l) => ({ productId: l.productId, name: l.product.name, qty: l.qty, size: l.size, unitPrice: l.product.price, shape: l.product.shape, tone: l.product.tone, gem: l.product.gem, imageUrl: l.product.imageUrls[0] })),
      totals, address, payment, couponCode: coupon?.code,
    });
    if (!('error' in res)) router.replace({ pathname: '/order-success/[id]', params: { id: res.data.id } });
    else dispatch(showToast({ kind: 'error', message: 'We couldn’t place your order. Please try again.' }));
  };

  return (
    <View style={{ gap: 14 }}>
      <Text variant="heading">Review your order</Text>
      <View style={styles.card}>
        {lines.map((l) => (
          <View key={l.key} style={styles.line}>
            <ProductImage uri={l.product.imageUrls[0]} shape={l.product.shape} tone={l.product.tone} gem={l.product.gem} padding={4} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong" numberOfLines={1}>{l.product.name}</Text>
              <Text variant="caption" color="muted">Qty {l.qty}{l.size ? ` · Size ${l.size}` : ''}</Text>
            </View>
            <Text variant="price">{formatINR(l.lineTotal)}</Text>
          </View>
        ))}
      </View>
      <InfoCard icon="location-outline" title="Deliver to" onEdit={() => dispatch(setStep(0))}>
        <Text variant="body">{address.name} · {address.phone}</Text>
        <Text variant="caption" color="muted">{address.line1}, {address.city} – {address.pincode}</Text>
      </InfoCard>
      <InfoCard icon="card-outline" title="Payment" onEdit={() => dispatch(setStep(1))}>
        <Text variant="body">{PAYMENT_LABELS[payment]}</Text>
      </InfoCard>
      <PriceSummary totals={totals} />
      <View style={styles.actions}>
        <Button label="Back" variant="secondary" onPress={() => dispatch(setStep(1))} style={{ flex: 1 }} size="lg" disabled={isLoading} />
        <Button label={`Place order · ${formatINR(totals.total)}`} onPress={submit} loading={isLoading} style={{ flex: 2.4 }} size="lg" />
      </View>
    </View>
  );
}

function InfoCard({ icon, title, onEdit, children }: { icon: keyof typeof Ionicons.glyphMap; title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <View style={[styles.card, styles.info]}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="overline" color="muted">{title}</Text>
        {children}
      </View>
      <PressableScale onPress={onEdit} haptic><Text variant="bodyStrong" color="primary">Edit</Text></PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, gap: 12, borderWidth: 1, borderColor: colors.line },
  info: { flexDirection: 'row', alignItems: 'flex-start' },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 52, height: 52, borderRadius: radius.sm },
  actions: { flexDirection: 'row', gap: 12 },
});
