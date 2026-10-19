import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type ToastKind = 'success' | 'info' | 'error';
export interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
  /** Optional inline action: either navigate somewhere or dispatch a plain action (e.g. Undo). */
  action?: { label: string; href?: string; dispatch?: { type: string; payload?: unknown } };
}

interface UiState {
  splashDone: boolean;
  toasts: Toast[];
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { splashDone: false, toasts: [] } as UiState,
  reducers: {
    splashFinished(state) {
      state.splashDone = true;
    },
    showToast: {
      reducer(state, { payload }: PayloadAction<Toast>) {
        state.toasts = [...state.toasts.slice(-2), payload];
      },
      prepare(toast: Omit<Toast, 'id'>) {
        return { payload: { ...toast, id: nanoid() } };
      },
    },
    dismissToast(state, { payload }: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== payload);
    },
  },
});

export const { splashFinished, showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
