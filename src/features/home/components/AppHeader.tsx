import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/components/ui/IconButton';
import { Wordmark } from '@/components/ui/Wordmark';

/** Sticky header: hairline + shadow fade in and the wordmark tightens as the page scrolls. */
export function AppHeader({ scrollY }: { scrollY: SharedValue<number> }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bar = useAnimatedStyle(() => ({ shadowOpacity: interpolate(scrollY.value, [0, 60], [0, 0.1], 'clamp'), borderBottomColor: `rgba(234,226,214,${interpolate(scrollY.value, [0, 60], [0, 1], 'clamp')})` }));
  const mark = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(scrollY.value, [0, 120], [1, 0.88], 'clamp') }] }));
  return (
    <Animated.View style={[styles.bar, { paddingTop: insets.top + 6 }, bar]}>
      <View style={styles.row}>
        <IconButton name="location-outline" label="Find a store" filled={false} onPress={() => router.push('/stores')} />
        <Animated.View style={mark}><Wordmark size={24} spacing={7} /></Animated.View>
        <IconButton name="search-outline" label="Search" filled={false} onPress={() => router.push('/search')} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: 'rgba(255,249,243,0.96)', borderBottomWidth: 1, shadowColor: '#3C1E14', shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, paddingBottom: 6, paddingHorizontal: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
