import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { ProductCard } from '@/components/jewel/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { selectWishlistProducts } from '@/features/catalog/selectors';
import { useLayoutMetrics } from '@/hooks/useLayoutMetrics';
import { useAppSelector } from '@/store/hooks';
import { pluralize } from '@/utils/format';

export default function WishlistScreen() {
  const router = useRouter();
  const items = useAppSelector(selectWishlistProducts);
  const { columns, cardWidth, gap, horizontalPadding, width } = useLayoutMetrics();
  return (
    <Screen>
      <View style={[styles.center, { width }]}>
        <View style={styles.head}>
          <Text variant="overline" color="gold">Saved</Text>
          <Text variant="title">Wishlist</Text>
          {items.length > 0 ? <Text variant="body" color="muted">{pluralize(items.length, 'piece')} you love</Text> : null}
        </View>
        <FlatList
          key={columns}
          data={items}
          numColumns={columns}
          keyExtractor={(p) => p.id}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ gap, paddingHorizontal: horizontalPadding, paddingBottom: 140, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <ProductCard product={item} width={cardWidth} index={index} />}
          ListEmptyComponent={<EmptyState icon="heart-outline" title="Nothing saved yet" message="Tap the heart on any piece to keep it here for later." actionLabel="Discover jewellery" onAction={() => router.push('/shop')} />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, maxWidth: '100%', alignSelf: 'center' },
  head: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
});
