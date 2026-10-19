import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { ids: [] as string[] },
  reducers: {
    toggleWishlist(state, { payload }: PayloadAction<string>) {
      const i = state.ids.indexOf(payload);
      if (i >= 0) state.ids.splice(i, 1);
      else state.ids.unshift(payload);
    },
    clearWishlist(state) {
      state.ids = [];
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
