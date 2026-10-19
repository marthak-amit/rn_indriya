import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { JewelArt } from '@/components/jewel/JewelArt';
import { backdropStops } from '@/components/jewel/palettes';
import { PressableScale } from '@/components/ui/PressableScale';
import { Reveal } from '@/components/ui/Reveal';
import { Text } from '@/components/ui/Text';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { selectProducts } from '@/features/catalog/selectors';
import { browse } from '@/features/catalog/filtersSlice';
import type { Category } from '@/features/catalog/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, shadow } from '@/theme';

export function CategoryRail({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((c, i) => (
        <Reveal key={c.id} index={i} kind="zoom">
          <PressableScale
            haptic
            accessibilityLabel={c.name}
            onPress={() => {
              dispatch(browse({ categoryId: c.id }));
              router.push('/shop');
            }}
            style={styles.item}
          >
            <View style={[styles.circle, shadow.soft]}>
              <LinearGradient colors={backdropStops[i % 2 ? 'rose' : 'yellow']} style={StyleSheet.absoluteFill} />
              {(() => {
                const photo = products.find((p) => p.categoryId === c.id)?.images[0];
                return photo !== undefined ? (
                  <Image source={photo} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} accessibilityLabel={c.name} />
                ) : (
                  <View style={{ width: 62, height: 62 }}><JewelArt shape={c.shape} tone={i % 2 ? 'rose' : 'yellow'} gem={c.shape === 'bangle' ? 'none' : 'diamond'} /></View>
                );
              })()}
            </View>
            <Text variant="bodyStrong" style={{ fontSize: 13.5 }}>{c.name}</Text>
          </PressableScale>
        </Reveal>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 20, gap: 18, paddingBottom: 10 },
  item: { alignItems: 'center', gap: 8 },
  circle: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
});
