import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductCard } from '@/components/jewel/ProductCard';
import { Marquee } from '@/components/ui/Marquee';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Text } from '@/components/ui/Text';
import { Wordmark } from '@/components/ui/Wordmark';
import { browse } from '@/features/catalog/filtersSlice';
import { selectBanners, selectBestsellers, selectCategories, selectCollections, selectNewArrivals, selectViewedProducts } from '@/features/catalog/selectors';
import { AppHeader } from '@/features/home/components/AppHeader';
import { CategoryRail } from '@/features/home/components/CategoryRail';
import { CollectionCarousel } from '@/features/home/components/CollectionCarousel';
import { HeroCarousel } from '@/features/home/components/HeroCarousel';
import { HomeSkeleton } from '@/features/home/components/HomeSkeleton';
import { ProductRail } from '@/features/home/components/ProductRail';
import { ScrollReveal } from '@/features/home/components/ScrollReveal';
import { StoreBanner } from '@/features/home/components/StoreBanner';
import { TrustStrip } from '@/features/home/components/TrustStrip';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { useGetCatalogQuery } from '@/services/api/indriyaApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors } from '@/theme';

const ANNOUNCEMENTS = ['Free insured shipping on larger orders', 'Hallmarked & certified jewellery', 'Easy exchange', 'New festive edit is here'];

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { isLoading } = useGetCatalogQuery();
  const banners = useAppSelector(selectBanners);
  const categories = useAppSelector(selectCategories);
  const collections = useAppSelector(selectCollections);
  const best = useAppSelector(selectBestsellers);
  const fresh = useAppSelector(selectNewArrivals);
  const viewed = useAppSelector(selectViewedProducts);
  const { width } = useLayoutMetrics();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const headerH = insets.top + 58;
  const openShop = (patch: Parameters<typeof browse>[0] = {}) => {
    dispatch(browse(patch));
    router.push('/shop');
  };

  return (
    <View style={styles.root}>
      <AppHeader scrollY={scrollY} />
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: headerH, paddingBottom: 140 }}>
        <View style={styles.center}>
          <Marquee items={ANNOUNCEMENTS} />
          {isLoading || !banners.length ? (
            <HomeSkeleton />
          ) : (
            <>
              <HeroCarousel banners={banners} />
              <View style={styles.section}>
                <ScrollReveal scrollY={scrollY}>
                  <SectionHeader overline="Browse" title="Shop by category" />
                  <CategoryRail categories={categories} />
                </ScrollReveal>
              </View>
              <View style={styles.section}>
                <ScrollReveal scrollY={scrollY}>
                  <SectionHeader overline="Curated" title="Our collections" />
                  <CollectionCarousel collections={collections} />
                </ScrollReveal>
              </View>
              <View style={styles.section}>
                <ScrollReveal scrollY={scrollY}>
                  <SectionHeader overline="Most loved" title="Bestsellers" actionLabel="View all" onAction={() => openShop()} />
                  <ProductRail products={best} />
                </ScrollReveal>
              </View>
              <View style={styles.section}>
                <ScrollReveal scrollY={scrollY}>
                  <SectionHeader overline="Just in" title="New arrivals" />
                  <View style={[styles.grid, { width: Math.min(width, 520) }]}>
                    {fresh.slice(0, 4).map((p, i) => (
                      <ProductCard key={p.id} product={p} width={(Math.min(width, 520) - 40 - 12) / 2} index={i} still />
                    ))}
                  </View>
                </ScrollReveal>
              </View>
              <View style={styles.section}>
                <ScrollReveal scrollY={scrollY}>
                  <StoreBanner />
                </ScrollReveal>
              </View>
              <View style={styles.section}>
                <ScrollReveal scrollY={scrollY}>
                  <SectionHeader overline="The Indriya promise" title="Crafted with care" />
                  <TrustStrip />
                </ScrollReveal>
              </View>
              {viewed.length > 0 ? (
                <View style={styles.section}>
                  <ScrollReveal scrollY={scrollY}>
                    <SectionHeader overline="Pick up where you left off" title="Recently viewed" />
                    <ProductRail products={viewed} cardWidth={150} />
                  </ScrollReveal>
                </View>
              ) : null}
              <View style={styles.footer}>
                <Wordmark size={20} />
                <Text variant="caption" color="muted" align="center">Jewellery that celebrates you</Text>
              </View>
            </>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { width: '100%', maxWidth: 1100, alignSelf: 'center' },
  section: { marginTop: 36 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, alignSelf: 'center' },
  footer: { alignItems: 'center', gap: 6, marginTop: 48 },
});
