import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type { RootReducerState } from './rootReducer';

/**
 * Types live in their own file (not index.ts) so slices, selectors and listeners can
 * import them without creating a circular type dependency with the store itself.
 */
export type RootState = RootReducerState;
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
