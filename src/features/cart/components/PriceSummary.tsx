import { StyleSheet, View } from 'react-native';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/theme';
import type { OrderTotals } from '@/services/api/types';

function Row({ label, value, tone }: { label: string; value: number | 'free'; tone?: 'success' }) {
  return (
    <View style={styles.row}>
      <Text variant="body" color="inkSoft">{label}</Text>
      {value === 'free' ? <Text variant="bodyStrong" color="success">Free</Text> : <AnimatedPrice value={value} variant="bodyStrong" color={tone ?? 'ink'} />}
    </View>
  );
}

export function PriceSummary({ totals }: { totals: OrderTotals }) {
  return (
    <View style={styles.box}>
      <Row label="Subtotal" value={totals.subtotal} />
      {totals.discount > 0 ? <Row label="Coupon discount" value={-totals.discount} tone="success" /> : null}
      <Row label="Shipping" value={totals.shipping === 0 ? 'free' : totals.shipping} />
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text variant="subheading">Total</Text>
        <AnimatedPrice value={totals.total} style={{ fontSize: 22, lineHeight: 28 }} variant="price" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 2 },
});
