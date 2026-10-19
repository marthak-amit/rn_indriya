import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { colors, radius } from '@/theme';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
}

/** +/- control; the number rolls up or down depending on direction. */
export function QuantityStepper({ value, min = 0, max = 5, onChange }: QuantityStepperProps) {
  return (
    <View style={styles.wrap}>
      <PressableScale onPress={() => onChange(value - 1)} haptic disabled={value <= min} style={styles.btn} accessibilityLabel="Decrease quantity">
        <Ionicons name={value <= 1 ? 'trash-outline' : 'remove'} size={16} color={colors.primary} />
      </PressableScale>
      <View style={styles.valueBox}>
        {/* keyed so each value mounts with its own entrance */}
        <Animated.View key={value} entering={FadeInDown.duration(220)} exiting={FadeOutUp.duration(160)} style={StyleSheet.absoluteFill}>
          <View style={styles.center}><Text variant="bodyStrong">{value}</Text></View>
        </Animated.View>
      </View>
      <PressableScale onPress={() => onChange(value + 1)} haptic disabled={value >= max} style={styles.btn} accessibilityLabel="Increase quantity">
        <Ionicons name="add" size={16} color={colors.primary} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, backgroundColor: colors.surface, overflow: 'hidden' },
  btn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  valueBox: { width: 28, height: 34, overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
