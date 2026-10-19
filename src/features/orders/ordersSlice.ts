import { createSlice } from '@reduxjs/toolkit';
import { indriyaApi } from '@/services/api/indriyaApi';
import type { Order } from '@/services/api/types';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [] as Order[] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(indriyaApi.endpoints.placeOrder.matchFulfilled, (state, { payload }) => {
      state.list.unshift(payload);
    });
  },
});

export default ordersSlice.reducer;
