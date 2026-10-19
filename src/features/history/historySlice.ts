import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface HistoryState {
  recentSearches: string[];
  viewed: string[];
}

const historySlice = createSlice({
  name: 'history',
  initialState: { recentSearches: [], viewed: [] } as HistoryState,
  reducers: {
    addRecentSearch(state, { payload }: PayloadAction<string>) {
      const q = payload.trim();
      if (q.length < 2) return;
      state.recentSearches = [q, ...state.recentSearches.filter((s) => s.toLowerCase() !== q.toLowerCase())].slice(0, 6);
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
    productViewed(state, { payload }: PayloadAction<string>) {
      state.viewed = [payload, ...state.viewed.filter((id) => id !== payload)].slice(0, 10);
    },
  },
});

export const { addRecentSearch, clearRecentSearches, productViewed } = historySlice.actions;
export default historySlice.reducer;
