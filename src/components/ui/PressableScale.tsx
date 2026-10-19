import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { motion } from '@/theme';
import { haptics } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed. */
  pressedScale?: number;
  haptic?: boolean;
}

/** The base interactive element: springs down on press, springs back on release. */
export function PressableScale({ style, pressedScale = 0.96, haptic = false, onPressIn, onPressOut, onPress, disabled, ...rest }: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      accessibilityRole={rest.accessibilityRole ?? 'button'}
      onPressIn={(e) => {
        scale.value = withSpring(pressedScale, motion.springSnappy);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, motion.springSnappy);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) haptics.tap();
        onPress?.(e);
      }}
      style={[animated, style, disabled ? { opacity: 0.5 } : null]}
    />
  );
}
