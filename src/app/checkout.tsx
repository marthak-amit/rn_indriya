import { useGoBack } from '@/hooks/useGoBack';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { selectCartLines } from '@/features/catalog/selectors';
import { AddressStep } from '@/features/checkout/components/AddressStep';
import { PaymentStep } from '@/features/checkout/components/PaymentStep';
import { ReviewStep } from '@/features/checkout/components/ReviewStep';
import { StepIndicator } from '@/features/checkout/components/StepIndicator';
import { setAddress, setStep } from '@/features/checkout/checkoutSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function CheckoutScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const step = useAppSelector((s) => s.checkout.step);
  const hasItems = useAppSelector(selectCartLines).length > 0;
  const user = useAppSelector((s) => s.auth.user);
  const savedName = useAppSelector((s) => s.checkout.address.name);

  useEffect(() => {
    dispatch(setStep(0));
    if (user && !savedName) dispatch(setAddress({ name: user.name }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const back = () => (step > 0 ? dispatch(setStep(step - 1)) : goBack());

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-back" label="Back" onPress={back} />
        <Text variant="heading" style={{ flex: 1, textAlign: 'center' }}>Checkout</Text>
        <View style={{ width: 42 }} />
      </View>
      {!hasItems ? (
        <EmptyState icon="bag-handle-outline" title="Nothing to check out" message="Add a piece to your bag to continue." actionLabel="Browse jewellery" onAction={() => router.replace('/shop')} />
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <StepIndicator step={step} />
          <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Animated.View key={step} entering={FadeInRight.duration(380).springify().damping(20)} exiting={FadeOutLeft.duration(160)}>
              {step === 0 ? <AddressStep /> : step === 1 ? <PaymentStep /> : <ReviewStep />}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6 },
  content: { padding: 20, width: '100%', maxWidth: 560, alignSelf: 'center' },
});
