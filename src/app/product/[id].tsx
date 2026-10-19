import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGoBack } from '@/hooks/useGoBack';
import { useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RatingStars } from '@/components/jewel/RatingStars';
import { WishlistButton } from '@/components/jewel/WishlistButton';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { addToCart } from '@/features/cart/cartSlice';
import { ProductGallery } from '@/features/catalog/components/ProductGallery';
import { selectCollections, selectProductById, selectRelated } from '@/features/catalog/selectors';
import { productViewed } from '@/features/history/historySlice';
import { showToast } from '@/features/ui/uiSlice';
import { ProductRail } from '@/features/home/components/ProductRail';
import { useGetCatalogQuery } from '@/services/api/indriyaApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, fonts, radius, shadow } from '@/theme';
import { discountPercent, formatINR } from '@/utils/format';
import { haptics } from '@/utils/haptics';

function deliveryDate(): string {
  const d = new Date(Date.now() + 5 * 86400000);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goBack = useGoBack();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { width: screen } = useWindowDimensions();
  const width = Math.min(screen, 640);
  const { isLoading } = useGetCatalogQuery();
  const product = useAppSelector((s) => selectProductById(s, id));
  const related = useAppSelector((s) => selectRelated(s, id));
  const collection = useAppSelector(selectCollections).find((c) => c.id === product?.collectionId);

  const [size, setSize] = useState<string | undefined>();
  const [added, setAdded] = useState(false);
  const [pin, setPin] = useState('');
  const [pinChecked, setPinChecked] = useState(false);
  const shake = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  useEffect(() => {
    if (product) dispatch(productViewed(product.id));
  }, [product?.id, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  const topBar = useAnimatedStyle(() => ({ backgroundColor: `rgba(255,249,243,${interpolate(scrollY.value, [width * 0.6, width * 0.9], [0, 0.97], 'clamp')})` }));
  const barTitle = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.value, [width * 0.75, width], [0, 1], 'clamp') }));

  if (isLoading) {
    return (
      <View style={styles.root}>
        <Skeleton height={420} radius={0} />
        <View style={{ padding: 20, gap: 12 }}><Skeleton height={28} width="70%" /><Skeleton height={20} width="40%" /><Skeleton height={80} /></View>
      </View>
    );
  }
  if (!product) {
    return (
      <View style={[styles.root, { justifyContent: 'center' }]}>
        <EmptyState icon="alert-circle-outline" title="Piece not found" message="This design is no longer available." actionLabel="Back to shop" onAction={() => router.replace('/shop')} />
      </View>
    );
  }

  const off = discountPercent(product.price, product.mrp);
  const needsSize = !!product.sizes?.length;

  const requireSize = (): boolean => {
    if (needsSize && !size) {
      haptics.error();
      shake.value = withSequence(withTiming(-10, { duration: 60 }), withTiming(10, { duration: 100 }), withTiming(-6, { duration: 80 }), withTiming(0, { duration: 60 }));
      dispatch(showToast({ kind: 'error', message: product.shape === 'ring' ? 'Please select your ring size' : 'Please select a size' }));
      return false;
    }
    return true;
  };

  const onAdd = () => {
    if (!requireSize()) return;
    dispatch(addToCart({ productId: product.id, size }));
    setAdded(true);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };
  const onBuyNow = () => {
    if (!requireSize()) return;
    dispatch(addToCart({ productId: product.id, size }));
    router.push('/checkout');
  };

  const checkPin = () => {
    if (/^\d{6}$/.test(pin)) {
      haptics.success();
      setPinChecked(true);
    } else {
      haptics.error();
      setPinChecked(false);
      dispatch(showToast({ kind: 'error', message: 'Enter a valid 6-digit pincode' }));
    }
  };

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.topBar, { paddingTop: insets.top + 6 }, topBar]}>
        <IconButton name="chevron-back" label="Back" onPress={goBack} />
        <Animated.View style={[{ flex: 1 }, barTitle]}><Text variant="subheading" align="center" numberOfLines={1}>{product.name}</Text></Animated.View>
        <WishlistButton productId={product.id} size={21} />
      </Animated.View>

      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 + insets.bottom }}>
        <View style={{ width, alignSelf: 'center' }}>
          <ProductGallery product={product} width={width} height={Math.min(width * 1.05, 520)} scrollY={scrollY} />
          <Animated.View entering={FadeInDown.duration(500).springify().damping(20)} style={styles.sheet}>
            <View style={styles.badges}>
              {product.isNew ? <Text variant="overline" color="white" style={styles.badge}>New</Text> : null}
              {product.isBestseller ? <Text variant="overline" color="white" style={[styles.badge, { backgroundColor: colors.gold }]}>Bestseller</Text> : null}
              {collection ? <Text variant="overline" color="gold">{collection.name}</Text> : null}
            </View>
            <Text variant="title">{product.name}</Text>
            <View style={styles.rowWrap}>
              {product.rating !== undefined ? <RatingStars rating={product.rating} count={product.reviewCount} /> : null}
              <Text variant="caption" color="muted">{product.weightGrams ? `${product.weightGrams} g · ` : ''}{product.metal}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={{ fontFamily: fonts.bodySemi, fontSize: 26 }}>{formatINR(product.price)}</Text>
              {off > 0 ? (<><Text variant="body" color="muted" style={{ textDecorationLine: 'line-through' }}>{formatINR(product.mrp)}</Text><Text variant="bodyStrong" color="success">{off}% off</Text></>) : null}
            </View>
            <Text variant="caption" color="muted">{product.href ? 'Approximate price, excluding taxes · BIS hallmarked' : 'Inclusive of all taxes · BIS hallmarked'}</Text>

            {needsSize ? (
              <Animated.View style={[{ gap: 10, marginTop: 18 }, shakeStyle]}>
                <Text variant="overline" color="muted">{product.shape === 'ring' ? 'Ring size' : 'Size (inches)'}</Text>
                <View style={styles.wrap}>{product.sizes!.map((s) => <Chip key={s} label={s} selected={size === s} onPress={() => setSize(s)} />)}</View>
              </Animated.View>
            ) : null}

            <View style={styles.delivery}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <TextInput value={pin} onChangeText={(t) => { setPin(t.replace(/\D/g, '').slice(0, 6)); setPinChecked(false); }} placeholder="Enter pincode" placeholderTextColor={colors.muted} keyboardType="number-pad" maxLength={6} style={styles.pin} accessibilityLabel="Pincode" onSubmitEditing={checkPin} />
              <Button label="Check" variant="ghost" onPress={checkPin} style={{ minHeight: 36, paddingHorizontal: 10 }} />
            </View>
            {pinChecked ? (
              <Animated.View entering={FadeIn.duration(300)} style={styles.eta}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text variant="body" color="success">Delivery by {deliveryDate()}</Text>
              </Animated.View>
            ) : null}

            <View style={{ marginTop: 12 }}>
              <Accordion title="Product details" defaultOpen><Text variant="body" color="inkSoft">{product.description}</Text></Accordion>
              <Accordion title="Highlights">
                <View style={{ gap: 8 }}>
                  {product.highlights.map((h) => (
                    <View key={h} style={styles.bullet}><Ionicons name="diamond-outline" size={14} color={colors.gold} /><Text variant="body" color="inkSoft">{h}</Text></View>
                  ))}
                </View>
              </Accordion>
              {product.href ? (
                <Accordion title="More on indriya.com">
                  <View style={{ gap: 10 }}>
                    {product.code ? <Text variant="caption" color="muted">Product code {product.code}</Text> : null}
                    <Button label="View on indriya.com" variant="secondary" icon="open-outline" onPress={() => Linking.openURL(product.href!)} />
                  </View>
                </Accordion>
              ) : null}
              <Accordion title="Care & returns"><Text variant="body" color="inkSoft">Store separately in the pouch provided, avoid perfumes and water, and wipe gently with a soft cloth. Easy exchange applies as per policy.</Text></Accordion>
            </View>
          </Animated.View>

          {related.length > 0 ? (
            <Reveal delay={300} style={{ marginTop: 28 }}>
              <SectionHeader overline="Complete the look" title="You may also love" />
              <ProductRail products={related} cardWidth={160} />
            </Reveal>
          ) : null}
        </View>
      </Animated.ScrollView>

      <Animated.View entering={FadeInDown.delay(250).springify().damping(18)} style={[styles.cta, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.ctaInner}>
          <Button label={added ? 'Added to bag' : 'Add to bag'} icon={added ? 'checkmark' : 'bag-handle-outline'} variant={added ? 'gold' : 'secondary'} onPress={onAdd} style={{ flex: 1 }} size="lg" />
          <Button label="Buy now" onPress={onBuyNow} style={{ flex: 1 }} size="lg" />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
  sheet: { marginTop: -28, backgroundColor: colors.background, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: 22, gap: 8 },
  badges: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  badge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, overflow: 'hidden', fontSize: 9.5 },
  rowWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginTop: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  delivery: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, paddingLeft: 14, paddingRight: 4, height: 50, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  pin: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.ink, outlineStyle: 'none' } as never,
  eta: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 6 },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cta: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,249,243,0.97)', borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12, paddingHorizontal: 16, alignItems: 'center', ...shadow.soft },
  ctaInner: { flexDirection: 'row', gap: 12, width: '100%', maxWidth: 640 },
});
