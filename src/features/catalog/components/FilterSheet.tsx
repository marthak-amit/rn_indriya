import { ScrollView, StyleSheet, View } from 'react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetFilters, setCollection, setPriceMax, setSort, toggleMetal } from '../filtersSlice';
import { selectCollections, selectFilteredProducts } from '../selectors';
import type { MetalTone, SortKey } from '../types';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'priceAsc', label: 'Price: low to high' },
  { key: 'priceDesc', label: 'Price: high to low' },
  { key: 'rating', label: 'Top rated' },
];
const METALS: { key: MetalTone; label: string }[] = [
  { key: 'yellow', label: 'Yellow gold' },
  { key: 'rose', label: 'Rose gold' },
  { key: 'white', label: 'White gold' },
];
const PRICES: { max: number | null; label: string }[] = [
  { max: null, label: 'Any' },
  { max: 25000, label: 'Under ₹25,000' },
  { max: 50000, label: 'Under ₹50,000' },
  { max: 100000, label: 'Under ₹1,00,000' },
  { max: 200000, label: 'Under ₹2,00,000' },
];

export function FilterSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const f = useAppSelector((s) => s.filters);
  const collections = useAppSelector(selectCollections);
  const count = useAppSelector(selectFilteredProducts).length;
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text variant="heading">Sort & filter</Text>
        <Section title="Sort by">
          {SORTS.map((s) => <Chip key={s.key} label={s.label} selected={f.sort === s.key} onPress={() => dispatch(setSort(s.key))} />)}
        </Section>
        <Section title="Metal">
          {METALS.map((m) => <Chip key={m.key} label={m.label} selected={f.metals.includes(m.key)} onPress={() => dispatch(toggleMetal(m.key))} />)}
        </Section>
        <Section title="Price">
          {PRICES.map((p) => <Chip key={p.label} label={p.label} selected={f.priceMax === p.max} onPress={() => dispatch(setPriceMax(p.max))} />)}
        </Section>
        <Section title="Collection">
          <Chip label="All" selected={!f.collectionId} onPress={() => dispatch(setCollection(null))} />
          {collections.map((c) => <Chip key={c.id} label={c.name} selected={f.collectionId === c.id} onPress={() => dispatch(setCollection(c.id))} />)}
        </Section>
        <View style={styles.actions}>
          <Button label="Reset" variant="secondary" onPress={() => dispatch(resetFilters())} style={{ flex: 1 }} />
          <Button label={`Show ${count} items`} onPress={onClose} style={{ flex: 2 }} />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Text variant="overline" color="muted">{title}</Text>
      <View style={styles.wrap}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingBottom: 8, gap: 22 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 6 },
});
