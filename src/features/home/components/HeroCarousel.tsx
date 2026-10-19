import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { JewelArt } from '@/components/jewel/JewelArt';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { browse } from '@/features/catalog/filtersSlice';
import type { Banner } from '@/features/catalog/types';
import { useAppDispatch } from '@/store/hooks';
import { colors, fonts } from '@/theme';
import { MAX_CONTENT_WIDTH } from '@/hooks/useLayoutMetrics';

const AUTOPLAY_MS = 5200;

function Slide({ banner, index, width, height, scrollX }: { banner: Banner; index: number; width: number; height: number; scrollX: SharedValue<number> }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const art = useAnimatedStyle(() => {
    const d = scrollX.value - index * width;
    return {
      opacity: interpolate(Math.abs(d), [0, width * 0.7], [1, 0.1], Extrapolation.CLAMP),
      transform: [{ translateX: d * -0.45 }, { scale: interpolate(Math.abs(d), [0, width], [1, 0.8], Extrapolation.CLAMP) }, { rotate: `${interpolate(d, [-width, 0, width], [12, 0, -12])}deg` }],
    };
  });
  const text = useAnimatedStyle(() => {
    const d = scrollX.value - index * width;
    return { opacity: interpolate(Math.abs(d), [0, width * 0.5], [1, 0], Extrapolation.CLAMP), transform: [{ translateX: d * 0.3 }] };
  });
  const go = () => {
    dispatch(browse({ categoryId: banner.target.category ?? null, collectionId: banner.target.collection ?? null }));
    router.push('/shop');
  };
  return (
    <View style={{ width, height }}>
      <LinearGradient colors={banner.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {banner.image ? (
        <>
          <Animated.View style={[StyleSheet.absoluteFill, art]} pointerEvents="none">
            <Image source={banner.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={400} />
          </Animated.View>
          <LinearGradient colors={['rgba(1,27,69,0.05)', 'rgba(1,27,69,0.85)']} style={styles.scrim} pointerEvents="none" />
        </>
      ) : (
        <>
          <View style={styles.glow} pointerEvents="none" />
          <Animated.View style={[styles.art, art]} pointerEvents="none">
            <JewelArt shape={banner.shape} tone={banner.tone} gem={banner.gem} />
          </Animated.View>
        </>
      )}
      <Animated.View style={[styles.copy, text]}>
        <Text variant="overline" color="goldLight">{banner.eyebrow}</Text>
        <Text color="white" style={{ fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 }}>{banner.title}</Text>
        <Text variant="body" style={{ color: 'rgba(255,255,255,0.8)' }}>{banner.subtitle}</Text>
        <Button label={banner.cta} variant="gold" icon="arrow-forward" onPress={go} style={{ alignSelf: 'flex-start', marginTop: 8 }} />
      </Animated.View>
    </View>
  );
}

function Dot({ index, width, scrollX }: { index: number; width: number; scrollX: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const d = Math.abs(scrollX.value / width - index);
    return { width: interpolate(d, [0, 1], [26, 7], Extrapolation.CLAMP), opacity: interpolate(d, [0, 1], [1, 0.45], Extrapolation.CLAMP) };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

/** Full-bleed, auto-advancing hero with parallax artwork, counter-sliding copy and a morphing pager. */
export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const { width: screen } = useWindowDimensions();
  const width = Math.min(screen, MAX_CONTENT_WIDTH);
  const height = Math.round(Math.min(640, Math.max(560, width * 1.5)));
  const scrollX = useSharedValue(0);
  const ref = useRef<Animated.FlatList<Banner>>(null);
  const [, setActive] = useState(0);
  const dragging = useRef(false);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const goTo = useCallback((i: number) => ref.current?.scrollToOffset({ offset: i * width, animated: true }), [width]);

  useEffect(() => {
    const id = setInterval(() => {
      if (dragging.current) return;
      setActive((a) => {
        const next = (a + 1) % banners.length;
        goTo(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [banners.length, goTo]);

  return (
    <View style={{ width, height, alignSelf: 'center' }}>
      <Animated.FlatList
        ref={ref}
        data={banners}
        keyExtractor={(b) => b.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => { dragging.current = true; }}
        onMomentumScrollEnd={(e) => {
          dragging.current = false;
          setActive(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item, index }) => <Slide banner={item} index={index} width={width} height={height} scrollX={scrollX} />}
      />
      <Animated.View entering={FadeInDown.delay(300)} style={styles.pager} pointerEvents="none">
        {banners.map((b, i) => (
          <Dot key={b.id} index={i} width={width} scrollX={scrollX} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  art: { position: 'absolute', right: -24, top: 18, width: 300, height: 300 },
  scrim: { position: 'absolute', left: 0, right: 0, bottom: 0, top: '30%' },
  glow: { position: 'absolute', right: -50, top: -10, width: 360, height: 360, borderRadius: 180, backgroundColor: 'rgba(231,207,150,0.14)' },
  copy: { position: 'absolute', left: 24, right: 24, bottom: 64, gap: 8 },
  pager: { position: 'absolute', bottom: 28, left: 24, flexDirection: 'row', gap: 6 },
  dot: { height: 7, borderRadius: 4, backgroundColor: colors.goldLight },
});
