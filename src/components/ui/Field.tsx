import { forwardRef, useEffect, useState, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { FadeInDown, interpolate, interpolateColor, useAnimatedStyle, useDerivedValue, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { colors, fonts, motion, radius } from '@/theme';
import { Text } from './Text';

export interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
}

/** Floating-label input. Label glides up on focus/fill; the box shakes when an error appears. */
export const Field = forwardRef<ComponentRef<typeof TextInput>, FieldProps>(function Field({ label, error, value, onFocus, onBlur, style, ...rest }, ref) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || (value ?? '').length > 0;
  const lift = useDerivedValue(() => withSpring(lifted ? 1 : 0, motion.spring), [lifted]);
  const focus = useDerivedValue(() => withTiming(focused ? 1 : 0, { duration: 200 }), [focused]);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (error) shake.value = withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 90 }), withTiming(-5, { duration: 70 }), withTiming(0, { duration: 60 }));
  }, [error, shake]);

  const box = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
    borderColor: error ? colors.danger : interpolateColor(focus.value, [0, 1], [colors.line, colors.primary]),
  }));
  const labelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(lift.value, [0, 1], [0, -11]) }, { scale: interpolate(lift.value, [0, 1], [1, 0.78]) }],
  }));

  return (
    <View style={style}>
      <Animated.View style={[styles.box, box]}>
        <Animated.View pointerEvents="none" style={[styles.label, labelStyle]}>
          <Text variant="body" color={error ? 'danger' : focused ? 'primary' : 'muted'}>{label}</Text>
        </Animated.View>
        <TextInput
          ref={ref}
          value={value}
          placeholderTextColor={colors.muted}
          selectionColor={colors.primary}
          {...rest}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          style={styles.input}
          accessibilityLabel={label}
        />
      </Animated.View>
      {error ? <Animated.View entering={FadeInDown.duration(200)}><Text variant="caption" color="danger" style={styles.error}>{error}</Text></Animated.View> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  box: { height: 58, borderWidth: 1.2, borderRadius: radius.md, backgroundColor: colors.surface, justifyContent: 'center', paddingHorizontal: 16 },
  label: { position: 'absolute', left: 16, top: 17, transformOrigin: 'left center' },
  input: { fontFamily: fonts.body, fontSize: 15.5, color: colors.ink, paddingTop: 16, paddingBottom: 0, height: 58, outlineStyle: 'none' } as never,
  error: { marginTop: 4, marginLeft: 6 },
});
