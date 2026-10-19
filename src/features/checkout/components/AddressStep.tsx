import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Field } from '@/components/ui/Field';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { haptics } from '@/utils/haptics';
import { setAddress, setStep, validateAddress } from '../checkoutSlice';

export function AddressStep() {
  const dispatch = useAppDispatch();
  const address = useAppSelector((s) => s.checkout.address);
  const [errors, setErrors] = useState<ReturnType<typeof validateAddress>>({});
  const set = (k: keyof typeof address) => (v: string) => {
    dispatch(setAddress({ [k]: v } as Partial<typeof address>));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const next = () => {
    const e = validateAddress(address);
    setErrors(e);
    if (Object.keys(e).length) haptics.error();
    else dispatch(setStep(1));
  };
  return (
    <View style={styles.form}>
      <Text variant="heading">Where should we deliver?</Text>
      <Field label="Full name" value={address.name} onChangeText={set('name')} error={errors.name} autoComplete="name" textContentType="name" />
      <Field label="Mobile number" value={address.phone} onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" maxLength={10} autoComplete="tel" />
      <Field label="Address" value={address.line1} onChangeText={set('line1')} error={errors.line1} autoComplete="street-address" />
      <View style={styles.pair}>
        <Field label="City" value={address.city} onChangeText={set('city')} error={errors.city} style={{ flex: 1 }} />
        <Field label="Pincode" value={address.pincode} onChangeText={(v) => set('pincode')(v.replace(/\D/g, ''))} error={errors.pincode} keyboardType="number-pad" maxLength={6} style={{ flex: 1 }} />
      </View>
      <Button label="Continue to payment" size="lg" onPress={next} />
    </View>
  );
}

const styles = StyleSheet.create({ form: { gap: 14 }, pair: { flexDirection: 'row', gap: 12 } });
