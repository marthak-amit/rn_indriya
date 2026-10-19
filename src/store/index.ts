import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { indriyaApi } from '@/services/api/indriyaApi';
import { listenerMiddleware } from './listeners';
import { rootReducer } from './rootReducer';

const persistConfig = {
  key: 'indriya',
  version: 1,
  storage: AsyncStorage,
  // Server cache (RTK Query), transient UI and filters are intentionally not persisted.
  whitelist: ['auth', 'cart', 'checkout', 'history', 'orders', 'wishlist'],
};

export const makeStore = () =>
  configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware: (getDefault) =>
      getDefault({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } })
        .prepend(listenerMiddleware.middleware)
        .concat(indriyaApi.middleware),
  });

export const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type { AppDispatch, RootState } from './types';
