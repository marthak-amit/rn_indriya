import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme';
import { Text } from './Text';

/** Endless horizontal ticker (announcement bar). */
export function Marquee({ items }: { items: string[] }) {
  const [w, setW] = useState(0);
  const x = useSharedValue(0);
  useEffect(() => {
    if (!w) return;
    x.value = 0;
    x.value = withRepeat(withTiming(-w, { duration: w * 28, easing: Easing.linear }), -1, false);
  }, [w, x]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const row = (
    <View style={styles.row} onLayout={(e) => !w && setW(e.nativeEvent.layout.width)}>
      {items.map((t, i) => (
        <View key={i} style={styles.item}>
          <Text variant="overline" color="goldLight">{t}</Text>
          <Text variant="overline" color="gold">  ◆  </Text>
        </View>
      ))}
    </View>
  );
  return (
    <View style={styles.bar}>
      <Animated.View style={[styles.track, style]}>
        {row}
        {w ? <View style={styles.row}>{items.map((t, i) => (<View key={i} style={styles.item}><Text variant="overline" color="goldLight">{t}</Text><Text variant="overline" color="gold">  ◆  </Text></View>))}</View> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { height: 32, backgroundColor: colors.primaryDark, overflow: 'hidden', justifyContent: 'center' },
  track: { flexDirection: 'row', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center' },
});
