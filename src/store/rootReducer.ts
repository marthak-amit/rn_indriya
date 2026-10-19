import { combineReducers } from '@reduxjs/toolkit';
import { indriyaApi } from '@/services/api/indriyaApi';
import auth from '@/features/auth/authSlice';
import cart from '@/features/cart/cartSlice';
import filters from '@/features/catalog/filtersSlice';
import checkout from '@/features/checkout/checkoutSlice';
import history from '@/features/history/historySlice';
import orders from '@/features/orders/ordersSlice';
import ui from '@/features/ui/uiSlice';
import wishlist from '@/features/wishlist/wishlistSlice';

export const rootReducer = combineReducers({
  [indriyaApi.reducerPath]: indriyaApi.reducer,
  auth,
  cart,
  checkout,
  filters,
  history,
  orders,
  ui,
  wishlist,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
