import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { selectCartCount, selectWishlistIds } from '@/features/catalog/selectors';
import { useAppSelector } from '@/store/hooks';
import { colors, motion, radius, shadow } from '@/theme';
import { haptics } from '@/utils/haptics';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

type IconName = keyof typeof Ionicons.glyphMap;
const ICONS: Record<string, { on: IconName; off: IconName; label: string }> = {
  index: { on: 'home', off: 'home-outline', label: 'Home' },
  shop: { on: 'diamond', off: 'diamond-outline', label: 'Shop' },
  wishlist: { on: 'heart', off: 'heart-outline', label: 'Wishlist' },
  cart: { on: 'bag-handle', off: 'bag-handle-outline', label: 'Bag' },
  account: { on: 'person', off: 'person-outline', label: 'Account' },
};

function Badge({ count }: { count: number }) {
  const s = useSharedValue(1);
  useEffect(() => {
    if (count > 0) s.value = withSequence(withTiming(1.5, { duration: 110 }), withSpring(1, { damping: 7, stiffness: 260 }));
  }, [count, s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: count > 0 ? s.value : 0 }] }));
  return (
    <Animated.View style={[styles.badge, style]} pointerEvents="none">
      <Text variant="caption" color="white" style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
    </Animated.View>
  );
}

function TabItem({ routeName, focused, onPress, onLongPress, badge, width }: { routeName: string; focused: boolean; onPress: () => void; onLongPress: () => void; badge: number; width: number }) {
  const meta = ICONS[routeName] ?? ICONS.index;
  const p = useDerivedValue(() => withSpring(focused ? 1 : 0, motion.spring), [focused]);
  const icon = useAnimatedStyle(() => ({ transform: [{ translateY: interpolate(p.value, [0, 1], [0, -2]) }, { scale: interpolate(p.value, [0, 1], [1, 1.12]) }] }));
  const label = useAnimatedStyle(() => ({ opacity: p.value, height: interpolate(p.value, [0, 1], [0, 13]), transform: [{ translateY: interpolate(p.value, [0, 1], [4, 0]) }] }));
  return (
    <PressableScale onPress={onPress} onLongPress={onLongPress} pressedScale={0.9} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={meta.label} style={[styles.item, { width }]}>
      <Animated.View style={icon}>
        <Ionicons name={focused ? meta.on : meta.off} size={23} color={focused ? colors.white : colors.inkSoft} />
        {badge > 0 ? <Badge count={badge} /> : null}
      </Animated.View>
      <Animated.View style={[{ overflow: 'hidden' }, label]}>
        <Text variant="caption" color="white" style={styles.label}>{meta.label}</Text>
      </Animated.View>
    </PressableScale>
  );
}

/** Floating pill tab bar with a spring-driven sliding highlight. */
export function TabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [w, setW] = useState(0);
  const cart = useAppSelector(selectCartCount);
  const wish = useAppSelector((s) => selectWishlistIds(s).length);
  const itemW = w / state.routes.length;
  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withSpring(state.index * itemW, { damping: 18, stiffness: 220, mass: 0.8 });
  }, [state.index, itemW, x]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const badges: Record<string, number> = { cart, wishlist: wish };

  return (
    <View pointerEvents="box-none" style={[styles.host, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar} onLayout={(e) => setW(e.nativeEvent.layout.width - 12)}>
        <View style={styles.inner}>
          {w > 0 ? <Animated.View style={[styles.pill, { width: itemW }, pill]} /> : null}
          {state.routes.map((route, i) => {
            const focused = state.index === i;
            return (
              <TabItem
                key={route.key}
                routeName={route.name}
                focused={focused}
                width={itemW}
                badge={badges[route.name] ?? 0}
                onPress={() => {
                  haptics.select();
                  const e = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!focused && !e.defaultPrevented) navigateToTab(route.key);
                }}
                onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingHorizontal: 16 },
  bar: { width: '100%', maxWidth: 460, padding: 6, borderRadius: radius.pill, backgroundColor: colors.surface, ...shadow.lifted, borderWidth: Platform.OS === 'web' ? 1 : 0, borderColor: colors.line },
  inner: { flexDirection: 'row' },
  pill: { position: 'absolute', top: 0, bottom: 0, left: 0, borderRadius: radius.pill, backgroundColor: colors.primary },
  item: { height: 52, alignItems: 'center', justifyContent: 'center', gap: 1 },
  label: { fontFamily: 'Jost_500Medium', fontSize: 10.5, lineHeight: 13, letterSpacing: 0.3 },
  badge: { position: 'absolute', top: -6, right: -10, minWidth: 17, height: 17, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.surface },
  badgeText: { fontSize: 10, lineHeight: 12, fontFamily: 'Jost_600SemiBold' },
});
