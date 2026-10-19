import { Ionicons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors, motion } from '@/theme';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/** Height-animated disclosure; the chevron rotates in step. */
export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentH = useSharedValue(0);
  const progress = useDerivedValue(() => withSpring(open ? 1 : 0, { ...motion.spring, damping: 22 }), [open]);
  const body = useAnimatedStyle(() => ({ height: contentH.value * progress.value, opacity: withTiming(open ? 1 : 0, { duration: 220 }) }));
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${progress.value * 180}deg` }] }));

  return (
    <View style={styles.wrap}>
      <PressableScale onPress={() => setOpen((o) => !o)} haptic pressedScale={0.99} style={styles.head} accessibilityState={{ expanded: open }}>
        <Text variant="subheading" style={{ flex: 1 }}>{title}</Text>
        <Animated.View style={chevron}><Ionicons name="chevron-down" size={20} color={colors.muted} /></Animated.View>
      </PressableScale>
      <Animated.View style={[styles.body, body]}>
        <View style={styles.inner} onLayout={(e) => { contentH.value = e.nativeEvent.layout.height; }}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: 1, borderBottomColor: colors.line },
  head: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  body: { overflow: 'hidden' },
  inner: { position: 'absolute', left: 0, right: 0, top: 0, paddingBottom: 16 },
});
