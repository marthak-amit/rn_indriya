import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { ProductImage } from '@/components/jewel/ProductImage';
import { Chip } from '@/components/ui/Chip';
import { PressableScale } from '@/components/ui/PressableScale';
import { Reveal } from '@/components/ui/Reveal';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { browse } from '@/features/catalog/filtersSlice';
import { searchProducts } from '@/features/catalog/search';
import { selectCategories, selectCollections, selectProducts } from '@/features/catalog/selectors';
import { addRecentSearch, clearRecentSearches } from '@/features/history/historySlice';
import { useDebounced } from '@/hooks/useDebounced';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, fonts, radius } from '@/theme';
import { formatINR, pluralize } from '@/utils/format';

export default function SearchScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const q = useDebounced(text, 220);
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const collections = useAppSelector(selectCollections);
  const recent = useAppSelector((s) => s.history.recentSearches);
  const results = useMemo(() => searchProducts(products, q), [products, q]);
  const trending = useMemo(() => [...categories.map((c) => c.name), ...collections.map((c) => c.name)].slice(0, 8), [categories, collections]);

  const seeAll = (query: string) => {
    dispatch(addRecentSearch(query));
    dispatch(browse({ query }));
    router.replace('/shop');
  };

  return (
    <Screen>
      <View style={styles.bar}>
        <View style={styles.input}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            value={text}
            onChangeText={setText}
            autoFocus
            placeholder="Search rings, diamonds, bridal…"
            placeholderTextColor={colors.muted}
            returnKeyType="search"
            onSubmitEditing={() => text.trim() && seeAll(text.trim())}
            style={styles.textInput}
            accessibilityLabel="Search"
          />
          {text ? <PressableScale onPress={() => setText('')} hitSlop={10} accessibilityLabel="Clear"><Ionicons name="close-circle" size={20} color={colors.muted} /></PressableScale> : null}
        </View>
        <PressableScale onPress={() => router.back()} haptic><Text variant="bodyStrong" color="primary">Cancel</Text></PressableScale>
      </View>

      {!q.trim() ? (
        <Animated.View entering={FadeInDown} style={styles.body}>
          {recent.length > 0 ? (
            <View style={{ gap: 10 }}>
              <View style={styles.rowBetween}>
                <Text variant="overline" color="muted">Recent</Text>
                <PressableScale onPress={() => dispatch(clearRecentSearches())}><Text variant="caption" color="primary">Clear</Text></PressableScale>
              </View>
              <View style={styles.wrap}>{recent.map((r) => <Chip key={r} label={r} onPress={() => setText(r)} />)}</View>
            </View>
          ) : null}
          <View style={{ gap: 10 }}>
            <Text variant="overline" color="muted">Trending</Text>
            <View style={styles.wrap}>{trending.map((t) => <Chip key={t} label={t} onPress={() => setText(t)} />)}</View>
          </View>
        </Animated.View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(p) => p.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.rowBetween}>
              <Text variant="body" color="muted">{pluralize(results.length, 'result')}</Text>
              {results.length > 0 ? <PressableScale onPress={() => seeAll(q.trim())}><Text variant="bodyStrong" color="primary">See all in shop</Text></PressableScale> : null}
            </View>
          }
          ListEmptyComponent={<Reveal><Text variant="body" color="muted" align="center" style={{ marginTop: 40 }}>Nothing matched “{q}”. Try “gold”, “ruby” or “bridal”.</Text></Reveal>}
          renderItem={({ item, index }) => (
            <Reveal index={index}>
              <Animated.View layout={LinearTransition}>
                <PressableScale onPress={() => { dispatch(addRecentSearch(q)); router.push({ pathname: '/product/[id]', params: { id: item.id } }); }} style={styles.row}>
                  <ProductImage uri={item.imageUrls[0]} shape={item.shape} tone={item.tone} gem={item.gem} padding={6} style={styles.thumb} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="subheading" numberOfLines={1}>{item.name}</Text>
                    <Text variant="caption" color="muted">{item.metal}</Text>
                    <Text variant="price">{formatINR(item.price)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </PressableScale>
              </Animated.View>
            </Reveal>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 10 },
  input: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, height: 48, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  textInput: { flex: 1, fontFamily: fonts.body, fontSize: 15.5, color: colors.ink, outlineStyle: 'none' } as never,
  body: { padding: 20, gap: 26 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  list: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 10, borderRadius: radius.lg, backgroundColor: colors.surface },
  thumb: { width: 72, height: 72, borderRadius: radius.md },
});
