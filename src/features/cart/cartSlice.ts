import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Coupon } from '@/services/api/types';

export interface CartItem {
  key: string;
  productId: string;
  size?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
}

export const MAX_QTY = 5;
const initialState: CartState = { items: [], coupon: null };
export const cartKey = (productId: string, size?: string) => `${productId}:${size ?? '-'}`;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, { payload }: PayloadAction<{ productId: string; size?: string; qty?: number }>) {
      const key = cartKey(payload.productId, payload.size);
      const existing = state.items.find((i) => i.key === key);
      const qty = payload.qty ?? 1;
      if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty);
      else state.items.push({ key, productId: payload.productId, size: payload.size, qty: Math.min(MAX_QTY, qty) });
    },
    setQty(state, { payload }: PayloadAction<{ key: string; qty: number }>) {
      const item = state.items.find((i) => i.key === payload.key);
      if (!item) return;
      if (payload.qty <= 0) state.items = state.items.filter((i) => i.key !== payload.key);
      else item.qty = Math.min(MAX_QTY, payload.qty);
    },
    removeFromCart(state, { payload }: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.key !== payload);
    },
    restoreCartItem(state, { payload }: PayloadAction<CartItem>) {
      if (!state.items.some((i) => i.key === payload.key)) state.items.push(payload);
    },
    applyCoupon(state, { payload }: PayloadAction<Coupon>) {
      state.coupon = payload;
    },
    removeCoupon(state) {
      state.coupon = null;
    },
    clearCart() {
      return initialState;
    },
  },
});

export const { addToCart, setQty, removeFromCart, restoreCartItem, applyCoupon, removeCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
