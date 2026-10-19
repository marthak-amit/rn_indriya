import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ProductCard } from '@/components/jewel/ProductCard';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { FilterSheet } from '@/features/catalog/components/FilterSheet';
import { browse, resetFilters, setCategory } from '@/features/catalog/filtersSlice';
import { selectActiveFilterCount, selectCategories, selectCollections, selectFilteredProducts } from '@/features/catalog/selectors';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { useGetCatalogQuery } from '@/services/api/indriyaApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, radius } from '@/theme';
import { pluralize } from '@/utils/format';

export default function ShopScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ category?: string; collection?: string; q?: string }>();
  const { isLoading } = useGetCatalogQuery();
  const categories = useAppSelector(selectCategories);
  const collections = useAppSelector(selectCollections);
  const products = useAppSelector(selectFilteredProducts);
  const filters = useAppSelector((s) => s.filters);
  const activeCount = useAppSelector(selectActiveFilterCount);
  const [sheet, setSheet] = useState(false);
  const { columns, cardWidth, gap, horizontalPadding, width } = useLayoutMetrics();

  // Deep links (indriya://shop?category=rings) seed the Redux filter state.
  useEffect(() => {
    if (params.category || params.collection || params.q) {
      dispatch(browse({ categoryId: params.category ?? null, collectionId: params.collection ?? null, query: params.q ?? '' }));
    }
  }, [params.category, params.collection, params.q, dispatch]);

  const collection = collections.find((c) => c.id === filters.collectionId);
  const title = collection ? collection.name : filters.query ? `“${filters.query}”` : 'Shop';

  return (
    <Screen>
      <View style={[styles.center, { width }]}>
        <View style={styles.head}>
          <Animated.View entering={FadeIn.duration(400)} key={title} style={{ flex: 1 }}>
            <Text variant="overline" color="gold">{collection ? 'Collection' : 'Indriya'}</Text>
            <Text variant="title" numberOfLines={1}>{title}</Text>
          </Animated.View>
          <IconButton name="search-outline" label="Search" onPress={() => router.push('/search')} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={{ flexGrow: 0 }}>
          <Chip label="All" selected={!filters.categoryId} onPress={() => dispatch(setCategory(null))} />
          {categories.map((c) => <Chip key={c.id} label={c.name} selected={filters.categoryId === c.id} onPress={() => dispatch(setCategory(c.id))} />)}
        </ScrollView>

        <View style={styles.toolbar}>
          <Text variant="body" color="muted" key={products.length}>{pluralize(products.length, 'piece')}</Text>
          <PressableScale onPress={() => setSheet(true)} haptic style={styles.filterBtn} accessibilityLabel="Sort and filter">
            <Ionicons name="options-outline" size={18} color={colors.primary} />
            <Text variant="bodyStrong" color="primary">Sort & filter</Text>
            {activeCount > 0 ? <View style={styles.dot}><Text variant="caption" color="white" style={{ fontSize: 10, lineHeight: 12 }}>{activeCount}</Text></View> : null}
          </PressableScale>
        </View>

        {isLoading ? (
          <View style={[styles.grid, { gap, paddingHorizontal: horizontalPadding }]}>
            {Array.from({ length: columns * 2 }, (_, i) => <Skeleton key={i} width={cardWidth} height={cardWidth * 1.12 + 92} radius={18} />)}
          </View>
        ) : (
          <FlatList
            key={columns}
            data={products}
            numColumns={columns}
            keyExtractor={(p) => p.id}
            columnWrapperStyle={{ gap }}
            contentContainerStyle={{ gap, paddingHorizontal: horizontalPadding, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => <ProductCard product={item} width={cardWidth} index={index} />}
            ListEmptyComponent={
              <Animated.View entering={FadeInDown}>
                <EmptyState icon="search-outline" title="No pieces found" message="Try removing a filter or exploring another category." actionLabel="Clear filters" onAction={() => dispatch(resetFilters())} />
              </Animated.View>
            }
          />
        )}
      </View>
      <FilterSheet visible={sheet} onClose={() => setSheet(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, maxWidth: '100%', alignSelf: 'center' },
  head: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10 },
  chips: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.primarySoft },
  dot: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});
