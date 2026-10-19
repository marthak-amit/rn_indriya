import { FlatList } from 'react-native';
import { ProductCard } from '@/components/jewel/ProductCard';
import type { Product } from '@/features/catalog/types';

export function ProductRail({ products, cardWidth = 172 }: { products: Product[]; cardWidth?: number }) {
  return (
    <FlatList
      data={products}
      horizontal
      keyExtractor={(p) => p.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingVertical: 10 }}
      renderItem={({ item, index }) => <ProductCard product={item} width={cardWidth} index={index} />}
    />
  );
}
