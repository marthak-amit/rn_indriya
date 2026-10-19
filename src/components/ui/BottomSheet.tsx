import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, motion, radius } from '@/theme';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** Modal sheet: backdrop fades, sheet springs up, and can be dragged down to dismiss. */
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const y = useSharedValue(height);

  // Mount synchronously when opening (adjusting state during render, per React docs) so the enter animation can start.
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      y.value = height;
      y.value = withSpring(0, motion.spring);
    } else if (mounted) {
      y.value = withTiming(height, { duration: 240 }, (done) => {
        if (done) runOnJS(setMounted)(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      y.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 900) runOnJS(onClose)();
      else y.value = withSpring(0, motion.spring);
    });

  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const backdrop = useAnimatedStyle(() => ({ opacity: interpolate(y.value, [0, height * 0.6], [1, 0], 'clamp') }));

  if (!mounted) return null;
  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdrop]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        </Animated.View>
        <View style={styles.anchor} pointerEvents="box-none">
          <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 16, maxHeight: height * 0.88 }, sheet]}>
            <GestureDetector gesture={pan}>
              <View style={styles.handleArea}><View style={styles.handle} /></View>
            </GestureDetector>
            {children}
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: colors.overlay },
  anchor: { flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, width: '100%', maxWidth: 640, alignSelf: 'center' },
  handleArea: { alignItems: 'center', paddingVertical: 12 },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.line },
});
