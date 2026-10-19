import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { JewelArt } from '@/components/jewel/JewelArt';
import { ProductImage } from '@/components/jewel/ProductImage';
import { colors } from '@/theme';
import type { Product } from '../types';

type View_ = { key: string; kind: 'main' | 'zoom' | 'dark' | 'photo'; uri?: string };

function Slide({ view, product, width, height, index, x, scrollY }: { view: View_; product: Product; width: number; height: number; index: number; x: SharedValue<number>; scrollY: SharedValue<number> }) {
  const parallax = useAnimatedStyle(() => ({
    transform: [
      { translateX: (x.value - index * width) * 0.25 },
      { translateY: interpolate(scrollY.value, [-200, 0, 300], [-60, 0, 120], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-300, 0], [1.5, 1], Extrapolation.CLAMP) },
    ],
  }));
  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <Animated.View style={[StyleSheet.absoluteFill, parallax]}>
        {view.kind === 'photo' ? (
          <ProductImage uri={view.uri} shape={product.shape} tone={product.tone} gem={product.gem} style={StyleSheet.absoluteFill} />
        ) : view.kind === 'main' ? (
          <ProductImage shape={product.shape} tone={product.tone} gem={product.gem} shimmer padding={36} style={StyleSheet.absoluteFill} />
        ) : view.kind === 'zoom' ? (
          <ProductImage shape={product.shape} tone={product.tone} gem={product.gem} padding={18} artScale={1.9} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={StyleSheet.absoluteFill}>
            <LinearGradient colors={[colors.primaryDark, colors.primary]} style={StyleSheet.absoluteFill} />
            <View style={{ flex: 1, padding: 48 }}><JewelArt shape={product.shape} tone={product.tone} gem={product.gem} /></View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

/** Swipeable gallery. Pulling the page down stretches the image; scrolling up parallaxes it. */
export function ProductGallery({ product, width, height, scrollY }: { product: Product; width: number; height: number; scrollY: SharedValue<number> }) {
  const x = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    x.value = e.contentOffset.x;
  });
  const views: View_[] = product.imageUrls.length
    ? product.imageUrls.map((uri, i) => ({ key: `p${i}`, kind: 'photo', uri }))
    : [{ key: 'main', kind: 'main' }, { key: 'zoom', kind: 'zoom' }, { key: 'dark', kind: 'dark' }];

  return (
    <View style={{ width, height }}>
      <Animated.FlatList
        data={views}
        horizontal
        pagingEnabled
        keyExtractor={(v) => v.key}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index: i }) => <Slide view={item} product={product} width={width} height={height} index={i} x={x} scrollY={scrollY} />}
      />
      {views.length > 1 ? (
        <View style={styles.dots} pointerEvents="none">
          {views.map((v, i) => (
            <View key={v.key} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { position: 'absolute', bottom: 40, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(30,26,24,0.25)' },
  dotActive: { width: 22, backgroundColor: colors.primary },
});
