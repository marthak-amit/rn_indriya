import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeOutUp, LinearTransition, SlideInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dismissToast, type Toast } from '@/features/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, radius, shadow } from '@/theme';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

const icons = { success: 'checkmark-circle', info: 'information-circle', error: 'alert-circle' } as const;
const tints = { success: colors.success, info: colors.gold, error: colors.danger } as const;

function ToastItem({ toast }: { toast: Toast }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    const id = setTimeout(() => dispatch(dismissToast(toast.id)), toast.action ? 4200 : 2800);
    return () => clearTimeout(id);
  }, [dispatch, toast.id, toast.action]);

  const onAction = () => {
    const a = toast.action;
    if (!a) return;
    if (a.dispatch) dispatch(a.dispatch as never);
    if (a.href) router.push(a.href as Href);
    dispatch(dismissToast(toast.id));
  };

  return (
    <Animated.View entering={SlideInUp.springify().damping(18)} exiting={FadeOutUp.duration(220)} layout={LinearTransition.springify()} style={styles.toast}>
      <Ionicons name={icons[toast.kind]} size={22} color={tints[toast.kind]} />
      <Text variant="bodyStrong" color="white" style={{ flex: 1 }} numberOfLines={2}>{toast.message}</Text>
      {toast.action ? (
        <PressableScale onPress={onAction} pressedScale={0.92} hitSlop={8}>
          <Text variant="bodyStrong" color="goldLight">{toast.action.label}</Text>
        </PressableScale>
      ) : null}
    </Animated.View>
  );
}

/** Renders the Redux toast queue above the whole app. */
export function Toaster() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + 8 }]}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 16, right: 16, zIndex: 100, gap: 8, alignItems: 'center' },
  toast: {
    width: '100%', maxWidth: 520, flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 13, borderRadius: radius.lg, backgroundColor: colors.ink, ...shadow.lifted,
  },
});
