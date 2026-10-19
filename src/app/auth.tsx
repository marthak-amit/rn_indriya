import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight, FadeOutLeft, interpolate, useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { IconButton } from '@/components/ui/IconButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Wordmark } from '@/components/ui/Wordmark';
import { showToast } from '@/features/ui/uiSlice';
import { useLoginMutation, useRegisterMutation } from '@/services/api/indriyaApi';
import { useAppDispatch } from '@/store/hooks';
import { colors, motion, radius } from '@/theme';
import { haptics } from '@/utils/haptics';

type Mode = 'signin' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const [segW, setSegW] = useState(0);
  const loading = loginState.isLoading || registerState.isLoading;

  const slide = useDerivedValue(() => withSpring(mode === 'signin' ? 0 : 1, motion.spring), [mode]);
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(slide.value, [0, 1], [0, segW / 2]) }] }));

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const submit = async () => {
    setErrors({});
    const res = mode === 'signin' ? await login({ email, password }) : await register({ name, email, password });
    if ('error' in res) {
      const err = res.error as { message: string; field?: string };
      haptics.error();
      setErrors({ [err.field ?? 'form']: err.message });
      return;
    }
    haptics.success();
    dispatch(showToast({ kind: 'success', message: `Welcome${res.data.name ? `, ${res.data.name.split(' ')[0]}` : ''}` }));
    leave();
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.close}><IconButton name="close" label="Close" onPress={leave} /></View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.springify().damping(18)} style={{ alignItems: 'center', gap: 6 }}>
            <Wordmark size={30} spacing={9} />
            <Text variant="body" color="muted">Sign in to save your wishlist and track orders</Text>
          </Animated.View>

          <View style={styles.seg} onLayout={(e) => setSegW(e.nativeEvent.layout.width - 8)}>
            {segW > 0 ? <Animated.View style={[styles.thumb, { width: segW / 2 }, thumb]} /> : null}
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <PressableScale key={m} onPress={() => { setMode(m); setErrors({}); }} haptic pressedScale={0.97} style={styles.segItem} accessibilityState={{ selected: mode === m }}>
                <Text variant="bodyStrong" color={mode === m ? 'white' : 'inkSoft'}>{m === 'signin' ? 'Sign in' : 'Create account'}</Text>
              </PressableScale>
            ))}
          </View>

          <Animated.View key={mode} entering={FadeInRight.duration(320)} exiting={FadeOutLeft.duration(120)} style={{ gap: 14 }}>
            {mode === 'signup' ? <Field label="Full name" value={name} onChangeText={setName} error={errors.name} autoComplete="name" /> : null}
            <Field label="Email" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            <Field label="Password" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry autoCapitalize="none" onSubmitEditing={submit} />
            {errors.form ? <Text variant="caption" color="danger">{errors.form}</Text> : null}
            <Button label={mode === 'signin' ? 'Sign in' : 'Create account'} size="lg" onPress={submit} loading={loading} />
          </Animated.View>

          <PressableScale onPress={leave} haptic style={{ alignSelf: 'center' }}><Text variant="bodyStrong" color="primary">Continue as guest</Text></PressableScale>
          <Text variant="caption" color="muted" align="center">Demo sign-in: any valid email and a password of 6+ characters.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  close: { alignItems: 'flex-end', paddingHorizontal: 12, paddingTop: 6 },
  body: { padding: 24, gap: 24, width: '100%', maxWidth: 460, alignSelf: 'center' },
  seg: { flexDirection: 'row', padding: 4, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt },
  thumb: { position: 'absolute', top: 4, bottom: 4, left: 4, borderRadius: radius.pill, backgroundColor: colors.primary },
  segItem: { flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' },
});
