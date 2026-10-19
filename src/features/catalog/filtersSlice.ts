import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Filters, MetalTone, SortKey } from './types';

export const initialFilters: Filters = { categoryId: null, collectionId: null, metals: [], priceMax: null, sort: 'featured', query: '' };

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFilters,
  reducers: {
    setCategory(state, { payload }: PayloadAction<string | null>) {
      state.categoryId = payload;
    },
    setCollection(state, { payload }: PayloadAction<string | null>) {
      state.collectionId = payload;
    },
    toggleMetal(state, { payload }: PayloadAction<MetalTone>) {
      state.metals = state.metals.includes(payload) ? state.metals.filter((m) => m !== payload) : [...state.metals, payload];
    },
    setPriceMax(state, { payload }: PayloadAction<number | null>) {
      state.priceMax = payload;
    },
    setSort(state, { payload }: PayloadAction<SortKey>) {
      state.sort = payload;
    },
    setQuery(state, { payload }: PayloadAction<string>) {
      state.query = payload;
    },
    /** Replace the browsing context in one action (used by deep links / home tiles). */
    browse(state, { payload }: PayloadAction<Partial<Pick<Filters, 'categoryId' | 'collectionId' | 'query'>>>) {
      return { ...initialFilters, ...payload };
    },
    resetFilters() {
      return initialFilters;
    },
  },
});

export const { setCategory, setCollection, toggleMetal, setPriceMax, setSort, setQuery, browse, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
