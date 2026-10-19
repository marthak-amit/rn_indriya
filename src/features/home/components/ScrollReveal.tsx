import { useState, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

/**
 * Scroll-linked entrance: the block fades and rises as it enters the viewport and
 * stays resolved afterwards. Position is measured once from onLayout.
 */
export function ScrollReveal({ scrollY, children, offset = 0 }: { scrollY: SharedValue<number>; children: ReactNode; offset?: number }) {
  const { height } = useWindowDimensions();
  const [y, setY] = useState<number | null>(null);
  const style = useAnimatedStyle(() => {
    if (y === null) return { opacity: 0 };
    const enter = y - height + 120 + offset; // scrollY at which the block begins to appear
    const p = interpolate(scrollY.value, [enter, enter + 180], [0, 1], Extrapolation.CLAMP);
    return { opacity: p, transform: [{ translateY: (1 - p) * 36 }] };
  });
  return (
    <Animated.View onLayout={(e) => setY(e.nativeEvent.layout.y)} style={style}>
      {children}
    </Animated.View>
  );
}
