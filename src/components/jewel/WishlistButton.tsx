import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { selectIsWishlisted } from '@/features/catalog/selectors';
import { toggleWishlist } from '@/features/wishlist/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, shadow } from '@/theme';
import { PressableScale } from '@/components/ui/PressableScale';

const BURST = [0, 60, 120, 180, 240, 300];

/** Heart toggle: pops on save and emits a ring of sparks. */
export function WishlistButton({ productId, size = 20, floating = true }: { productId: string; size?: number; floating?: boolean }) {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => selectIsWishlisted(s, productId));
  const pop = useSharedValue(1);
  const burst = useSharedValue(0);

  const onPress = () => {
    if (!active) {
      cancelAnimation(burst);
      burst.value = 0;
      burst.value = withTiming(1, { duration: 600 });
      pop.value = withSequence(withTiming(0.7, { duration: 80 }), withSpring(1.25, { damping: 6, stiffness: 300 }), withSpring(1, { damping: 10 }));
    } else {
      pop.value = withSequence(withTiming(0.8, { duration: 80 }), withSpring(1));
    }
    dispatch(toggleWishlist(productId));
  };

  const heart = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  return (
    <PressableScale onPress={onPress} hitSlop={8} accessibilityLabel={active ? 'Remove from wishlist' : 'Add to wishlist'} accessibilityState={{ selected: active }} style={[styles.base, floating && styles.floating]}>
      <View pointerEvents="none" style={styles.center}>
        {BURST.map((deg) => (
          <Spark key={deg} deg={deg} progress={burst} />
        ))}
        <Animated.View style={heart}>
          <Ionicons name={active ? 'heart' : 'heart-outline'} size={size} color={active ? colors.primary : colors.ink} />
        </Animated.View>
      </View>
    </PressableScale>
  );
}

function Spark({ deg, progress }: { deg: number; progress: { value: number } }) {
  const style = useAnimatedStyle(() => {
    const d = progress.value * 20;
    const rad = (deg * Math.PI) / 180;
    return { opacity: progress.value === 0 ? 0 : 1 - progress.value, transform: [{ translateX: Math.cos(rad) * d }, { translateY: Math.sin(rad) * d }, { scale: 1 - progress.value * 0.5 }] };
  });
  return <Animated.View style={[styles.spark, style]} />;
}

const styles = StyleSheet.create({
  base: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  floating: { borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.92)', ...shadow.soft },
  center: { alignItems: 'center', justifyContent: 'center' },
  spark: { position: 'absolute', width: 5, height: 5, borderRadius: 3, backgroundColor: colors.gold },
});
