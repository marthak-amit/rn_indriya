import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import type { Product } from '@/features/catalog/types';
import { colors, motion, radius, shadow } from '@/theme';
import { discountPercent, formatINR } from '@/utils/format';
import { ProductImage } from './ProductImage';
import { RatingStars } from './RatingStars';
import { WishlistButton } from './WishlistButton';

export interface ProductCardProps {
  product: Product;
  width: number;
  index?: number;
  /** Disable the entrance animation (e.g. for items that are re-rendered often). */
  still?: boolean;
}

export function ProductCard({ product, width, index = 0, still = false }: ProductCardProps) {
  const router = useRouter();
  const off = discountPercent(product.price, product.mrp);
  return (
    <Animated.View entering={still ? undefined : FadeInDown.delay(Math.min(index, 8) * motion.stagger).springify().damping(20)} style={{ width }}>
      <PressableScale onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })} pressedScale={0.97} accessibilityLabel={product.name}>
        <View style={[styles.card, shadow.soft]}>
          <View>
            <ProductImage source={product.images[0]} shape={product.shape} tone={product.tone} gem={product.gem} style={{ width, height: width * 1.12 }} />
            <View style={styles.badges}>
              {product.isNew ? <Text variant="overline" style={styles.badge} color="white">New</Text> : null}
              {product.isBestseller ? <Text variant="overline" style={[styles.badge, styles.gold]} color="white">Bestseller</Text> : null}
            </View>
            <View style={styles.heart}><WishlistButton productId={product.id} /></View>
          </View>
          <View style={styles.info}>
            <Text variant="caption" color="muted" numberOfLines={1}>{product.metal}</Text>
            <Text variant="subheading" numberOfLines={2} style={{ fontSize: 15, lineHeight: 20, minHeight: 40 }}>{product.name}</Text>
            <View style={styles.priceRow}>
              <Text variant="price">{formatINR(product.price)}</Text>
              {off > 0 ? <Text variant="caption" color="muted" style={{ textDecorationLine: 'line-through' }}>{formatINR(product.mrp)}</Text> : null}
            </View>
            {product.rating !== undefined ? <RatingStars rating={product.rating} count={product.reviewCount} /> : null}
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden' },
  info: { padding: 12, gap: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 2 },
  badges: { position: 'absolute', left: 10, top: 10, gap: 4, alignItems: 'flex-start' },
  badge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, overflow: 'hidden', fontSize: 9.5 },
  gold: { backgroundColor: colors.gold },
  heart: { position: 'absolute', right: 8, top: 8 },
});
