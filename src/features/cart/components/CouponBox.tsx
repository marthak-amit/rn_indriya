import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { useValidateCouponMutation } from '@/services/api/indriyaApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, radius } from '@/theme';
import { haptics } from '@/utils/haptics';
import { applyCoupon, removeCoupon } from '../cartSlice';
import { selectCartCoupon, selectCartTotals } from '@/features/catalog/selectors';

export function CouponBox() {
  const dispatch = useAppDispatch();
  const coupon = useAppSelector(selectCartCoupon);
  const { subtotal } = useAppSelector(selectCartTotals);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [validate, { isLoading }] = useValidateCouponMutation();

  const apply = async () => {
    setError(undefined);
    const res = await validate({ code, subtotal });
    if ('error' in res) {
      haptics.error();
      setError((res.error as { message?: string }).message ?? 'Could not apply code');
    } else {
      dispatch(applyCoupon(res.data));
      setCode('');
    }
  };

  return (
    <Animated.View layout={LinearTransition} style={styles.box}>
      {coupon ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.applied}>
          <Ionicons name="pricetag" size={18} color={colors.success} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong" color="success">{coupon.code}</Text>
            <Text variant="caption" color="inkSoft">{coupon.label}</Text>
          </View>
          <PressableScale onPress={() => dispatch(removeCoupon())} accessibilityLabel="Remove coupon"><Text variant="bodyStrong" color="primary">Remove</Text></PressableScale>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Text variant="overline" color="muted" style={{ marginBottom: 8 }}>Have a code?</Text>
          <View style={styles.row}>
            <Field label="Coupon code" value={code} onChangeText={(t) => { setCode(t.toUpperCase()); setError(undefined); }} autoCapitalize="characters" error={error} style={{ flex: 1 }} onSubmitEditing={apply} />
            <Button label="Apply" onPress={apply} loading={isLoading} disabled={!code.trim()} style={{ height: 58 }} />
          </View>
          <Text variant="caption" color="muted" style={{ marginTop: 8 }}>Try WELCOME10 or FESTIVE2000</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  applied: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
