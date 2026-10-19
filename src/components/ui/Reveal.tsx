import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn, ZoomIn } from 'react-native-reanimated';
import { motion } from '@/theme';

type Kind = 'up' | 'down' | 'fade' | 'zoom';

export interface RevealProps {
  children: ReactNode;
  /** Position in a list — drives the stagger delay. */
  index?: number;
  delay?: number;
  kind?: Kind;
  style?: StyleProp<ViewStyle>;
}

/** Entrance animation with built-in stagger. Wrap anything that should "arrive". */
export function Reveal({ children, index = 0, delay = 0, kind = 'up', style }: RevealProps) {
  const d = delay + Math.min(index, 10) * motion.stagger;
  const entering =
    kind === 'up' ? FadeInDown.delay(d).duration(520).springify().damping(20)
    : kind === 'down' ? FadeInUp.delay(d).duration(520).springify().damping(20)
    : kind === 'zoom' ? ZoomIn.delay(d).duration(420).springify().damping(16)
    : FadeIn.delay(d).duration(500);
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
