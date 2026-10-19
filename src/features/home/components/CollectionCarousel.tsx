import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { ProductImage } from '@/components/jewel/ProductImage';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { browse } from '@/features/catalog/filtersSlice';
import type { Collection } from '@/features/catalog/types';
import { useAppDispatch } from '@/store/hooks';
import { colors, fonts, radius, shadow } from '@/theme';

const CARD_W = 270;
const GAP = 14;

function Card({ item, index, x }: { item: Collection; index: number; x: SharedValue<number> }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const style = useAnimatedStyle(() => {
    const c = x.value / (CARD_W + GAP) - index;
    return { transform: [{ scale: interpolate(Math.abs(c), [0, 1], [1, 0.92], Extrapolation.CLAMP) }], opacity: interpolate(Math.abs(c), [0, 2], [1, 0.7], Extrapolation.CLAMP) };
  });
  const inner = useAnimatedStyle(() => {
    const c = x.value / (CARD_W + GAP) - index;
    return { transform: [{ translateX: interpolate(c, [-1, 1], [24, -24], Extrapolation.CLAMP) }, { scale: 1.2 }] };
  });
  return (
    <Animated.View style={[style, shadow.soft]}>
      <PressableScale
        haptic
        pressedScale={0.97}
        accessibilityLabel={item.name}
        onPress={() => {
          dispatch(browse({ collectionId: item.id }));
          router.push('/shop');
        }}
        style={styles.card}
      >
        <Animated.View style={[StyleSheet.absoluteFill, inner]}>
          <ProductImage source={item.image} shape={item.shape} tone={item.tone} gem={item.gem} padding={40} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <LinearGradient colors={['transparent', 'rgba(30,12,10,0.78)']} style={styles.scrim} />
        <View style={styles.caption}>
          <Text color="white" style={{ fontFamily: fonts.displayBold, fontSize: 24, lineHeight: 27 }}>{item.name}</Text>
          <Text variant="caption" style={{ color: 'rgba(255,255,255,0.82)' }}>{item.tagline}</Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

/** Snap carousel whose cards scale with distance from centre while their artwork parallaxes inside. */
export function CollectionCarousel({ collections }: { collections: Collection[] }) {
  const x = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    x.value = e.contentOffset.x;
  });

  return (
    <Animated.FlatList
      data={collections}
      horizontal
      keyExtractor={(c) => c.id}
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_W + GAP}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 20, gap: GAP, paddingVertical: 8 }}
      onScroll={onScroll}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => <Card item={item} index={index} x={x} />}
    />
  );
}

const styles = StyleSheet.create({
  card: { width: CARD_W, height: 340, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surfaceAlt },
  scrim: { position: 'absolute', left: 0, right: 0, bottom: 0, top: '45%' },
  caption: { position: 'absolute', left: 18, right: 18, bottom: 18, gap: 2 },
});
