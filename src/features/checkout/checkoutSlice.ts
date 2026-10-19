import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { indriyaApi } from '@/services/api/indriyaApi';
import type { Address, PaymentMethod } from '@/services/api/types';

export const CHECKOUT_STEPS = ['Address', 'Payment', 'Review'] as const;

interface CheckoutState {
  step: number;
  address: Address;
  payment: PaymentMethod;
}

const emptyAddress: Address = { name: '', phone: '', line1: '', city: '', pincode: '' };
const initialState: CheckoutState = { step: 0, address: emptyAddress, payment: 'upi' };

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep(state, { payload }: PayloadAction<number>) {
      state.step = Math.max(0, Math.min(CHECKOUT_STEPS.length - 1, payload));
    },
    setAddress(state, { payload }: PayloadAction<Partial<Address>>) {
      state.address = { ...state.address, ...payload };
    },
    setPayment(state, { payload }: PayloadAction<PaymentMethod>) {
      state.payment = payload;
    },
    resetCheckout(state) {
      state.step = 0;
      state.payment = 'upi';
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(indriyaApi.endpoints.placeOrder.matchFulfilled, (state) => {
      state.step = 0;
      state.payment = 'upi';
    });
  },
});

export const { setStep, setAddress, setPayment, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;

export const validateAddress = (a: Address): Partial<Record<keyof Address, string>> => {
  const errors: Partial<Record<keyof Address, string>> = {};
  if (a.name.trim().length < 2) errors.name = 'Enter the recipient’s name';
  if (!/^[6-9]\d{9}$/.test(a.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid 10-digit mobile number';
  if (a.line1.trim().length < 5) errors.line1 = 'Enter the full address';
  if (a.city.trim().length < 2) errors.city = 'Enter a city';
  if (!/^\d{6}$/.test(a.pincode)) errors.pincode = 'Enter a 6-digit pincode';
  return errors;
};
