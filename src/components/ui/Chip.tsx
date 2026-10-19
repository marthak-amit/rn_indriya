import { StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { colors, radius } from '@/theme';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
}

/** Selectable pill whose fill and border cross-fade between states. */
export function Chip({ label, selected = false, onPress, count }: ChipProps) {
  const progress = useDerivedValue(() => withTiming(selected ? 1 : 0, { duration: 220 }), [selected]);
  const box = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surface, colors.primary]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.line, colors.primary]),
  }));
  const text = useAnimatedStyle(() => ({ color: interpolateColor(progress.value, [0, 1], [colors.inkSoft, colors.white]) }));
  return (
    <PressableScale onPress={onPress} haptic pressedScale={0.94} accessibilityState={{ selected }} accessibilityLabel={label}>
      <Animated.View style={[styles.chip, box]}>
        <Animated.Text style={[styles.label, text]}>{label}</Animated.Text>
        {count !== undefined ? <Text variant="caption" color={selected ? 'goldLight' : 'muted'}>{count}</Text> : null}
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1 },
  label: { fontFamily: 'BricolageGrotesque_500Medium', fontSize: 13.5, letterSpacing: 0.3 },
});
