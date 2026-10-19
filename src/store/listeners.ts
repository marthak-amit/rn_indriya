import { createListenerMiddleware, isAnyOf, type TypedStartListening } from '@reduxjs/toolkit';
import { indriyaApi } from '@/services/api/indriyaApi';
import { addToCart, applyCoupon, clearCart, removeFromCart, restoreCartItem } from '@/features/cart/cartSlice';
import { showToast } from '@/features/ui/uiSlice';
import { toggleWishlist } from '@/features/wishlist/wishlistSlice';
import { logout } from '@/features/auth/authSlice';
import { haptics } from '@/utils/haptics';
import type { AppDispatch, RootState } from './types';

/**
 * Cross-cutting side effects live here, not in components: feedback toasts,
 * haptics, and order-completion housekeeping. Components just dispatch intent.
 */
export const listenerMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startListening = listenerMiddleware.startListening as AppStartListening;

startListening({
  actionCreator: addToCart,
  effect: (_action, api) => {
    haptics.success();
    api.dispatch(showToast({ kind: 'success', message: 'Added to your bag', action: { label: 'View bag', href: '/cart' } }));
  },
});

startListening({
  actionCreator: toggleWishlist,
  effect: (action, api) => {
    const added = api.getState().wishlist.ids.includes(action.payload);
    haptics.tap();
    api.dispatch(showToast({ kind: 'info', message: added ? 'Saved to wishlist' : 'Removed from wishlist', action: added ? { label: 'View', href: '/wishlist' } : undefined }));
  },
});

startListening({
  actionCreator: removeFromCart,
  effect: (action, api) => {
    const removed = api.getOriginalState().cart.items.find((i) => i.key === action.payload);
    if (!removed) return;
    haptics.tap();
    api.dispatch(showToast({ kind: 'info', message: 'Removed from your bag', action: { label: 'Undo', dispatch: restoreCartItem(removed) } }));
  },
});

startListening({
  actionCreator: applyCoupon,
  effect: (action, api) => {
    haptics.success();
    api.dispatch(showToast({ kind: 'success', message: `${action.payload.code} applied` }));
  },
});

startListening({
  actionCreator: logout,
  effect: (_a, api) => {
    api.dispatch(showToast({ kind: 'info', message: 'You have been signed out' }));
  },
});

startListening({
  matcher: isAnyOf(indriyaApi.endpoints.placeOrder.matchFulfilled),
  effect: (_a, api) => {
    haptics.success();
    api.dispatch(clearCart());
  },
});
