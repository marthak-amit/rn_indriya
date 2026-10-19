import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeInDown, LinearTransition, SlideOutLeft, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { ProductImage } from '@/components/jewel/ProductImage';
import { PressableScale } from '@/components/ui/PressableScale';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Text } from '@/components/ui/Text';
import { useAppDispatch } from '@/store/hooks';
import { colors, motion, radius, shadow } from '@/theme';
import { formatINR } from '@/utils/format';
import { MAX_QTY, removeFromCart, setQty } from '../cartSlice';
import type { CartLine } from '../pricing';

const REVEAL = 88;

/** Cart line with swipe-left-to-remove, a quantity stepper and layout-animated siblings. */
export function CartRow({ line, index }: { line: CartLine; index: number }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const x = useSharedValue(0);
  const { product } = line;

  const remove = () => dispatch(removeFromCart(line.key));
  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onUpdate((e) => {
      x.value = Math.min(0, Math.max(-REVEAL * 1.6, e.translationX));
    })
    .onEnd((e) => {
      if (e.translationX < -REVEAL * 1.4) {
        x.value = withTiming(-400, { duration: 180 }, () => runOnJS(remove)());
      } else x.value = withSpring(e.translationX < -REVEAL / 2 ? -REVEAL : 0, motion.spring);
    });

  const card = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const action = useAnimatedStyle(() => ({ opacity: interpolate(x.value, [-REVEAL, -20], [1, 0], 'clamp'), transform: [{ scale: interpolate(x.value, [-REVEAL, -20], [1, 0.6], 'clamp') }] }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(20)} exiting={SlideOutLeft.duration(260)} layout={LinearTransition.springify().damping(20)} style={styles.wrap}>
      <Animated.View style={[styles.action, action]}>
        <PressableScale onPress={() => { x.value = withTiming(-400, { duration: 160 }, () => runOnJS(remove)()); }} accessibilityLabel="Remove item" style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={22} color={colors.white} />
        </PressableScale>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, shadow.soft, card]}>
          <PressableScale pressedScale={0.97} onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })} accessibilityLabel={product.name}>
            <ProductImage uri={product.imageUrls[0]} shape={product.shape} tone={product.tone} gem={product.gem} padding={8} style={styles.thumb} />
          </PressableScale>
          <View style={{ flex: 1, gap: 3 }}>
            <Text variant="subheading" numberOfLines={2} style={{ fontSize: 15 }}>{product.name}</Text>
            <Text variant="caption" color="muted">{product.metal}{line.size ? ` · Size ${line.size}` : ''}</Text>
            <View style={styles.bottom}>
              <Text variant="price">{formatINR(line.lineTotal)}</Text>
              <QuantityStepper value={line.qty} max={MAX_QTY} onChange={(q) => dispatch(setQty({ key: line.key, qty: q }))} />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { justifyContent: 'center' },
  action: { position: 'absolute', right: 6, top: 0, bottom: 0, width: REVEAL - 16, alignItems: 'center', justifyContent: 'center' },
  actionBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', gap: 14, padding: 12, borderRadius: radius.lg, backgroundColor: colors.surface },
  thumb: { width: 88, height: 88, borderRadius: radius.md },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 },
});
