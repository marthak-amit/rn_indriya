import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { CartRow } from '@/features/cart/components/CartRow';
import { CouponBox } from '@/features/cart/components/CouponBox';
import { PriceSummary } from '@/features/cart/components/PriceSummary';
import { ShippingProgress } from '@/features/cart/components/ShippingProgress';
import { selectCartCount, selectCartLines, selectCartTotals } from '@/features/catalog/selectors';
import { useAppSelector } from '@/store/hooks';
import { pluralize } from '@/utils/format';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lines = useAppSelector(selectCartLines);
  const totals = useAppSelector(selectCartTotals);
  const count = useAppSelector(selectCartCount);

  return (
    <Screen>
      <View style={styles.center}>
        <View style={styles.head}>
          <Text variant="overline" color="gold">Your selection</Text>
          <Text variant="title">Shopping bag</Text>
          {count > 0 ? <Text variant="body" color="muted">{pluralize(count, 'item')}</Text> : null}
        </View>
        {lines.length === 0 ? (
          <EmptyState icon="bag-handle-outline" title="Your bag is empty" message="Pieces you add will wait for you here." actionLabel="Start shopping" onAction={() => router.push('/shop')} />
        ) : (
          <>
            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 230 + insets.bottom }]} showsVerticalScrollIndicator={false}>
              <ShippingProgress amountAfterDiscount={totals.subtotal - totals.discount} />
              <Animated.View layout={LinearTransition} style={{ gap: 12 }}>
                {lines.map((l, i) => <CartRow key={l.key} line={l} index={i} />)}
              </Animated.View>
              <Text variant="caption" color="muted" align="center">Swipe an item left to remove it</Text>
              <CouponBox />
              <PriceSummary totals={totals} />
            </ScrollView>
            <Animated.View entering={FadeInDown.springify().damping(18)} style={[styles.cta, { bottom: 92 + insets.bottom * 0 }]}>
              <Button label={`Checkout`} icon="lock-closed-outline" size="lg" onPress={() => router.push('/checkout')} style={{ width: '100%' }} />
            </Animated.View>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center' },
  head: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 },
  content: { paddingHorizontal: 16, gap: 14 },
  cta: { position: 'absolute', left: 16, right: 16 },
});
