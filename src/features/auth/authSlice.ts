import { createSlice } from '@reduxjs/toolkit';
import { indriyaApi } from '@/services/api/indriyaApi';
import type { User } from '@/services/api/types';

interface AuthState {
  user: User | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null } as AuthState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(indriyaApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.user = payload;
      })
      .addMatcher(indriyaApi.endpoints.register.matchFulfilled, (state, { payload }) => {
        state.user = payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
