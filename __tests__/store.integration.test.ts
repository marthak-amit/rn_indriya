import { addToCart, applyCoupon } from '@/features/cart/cartSlice';
import { browse } from '@/features/catalog/filtersSlice';
import { selectCartCount, selectCartLines, selectCartTotals, selectFilteredProducts, selectProductById, selectRelated, selectWishlistProducts } from '@/features/catalog/selectors';
import { setAddress, setPayment, setStep } from '@/features/checkout/checkoutSlice';
import { indriyaApi } from '@/services/api/indriyaApi';
import { makeStore } from '@/store';
import { toggleWishlist } from '@/features/wishlist/wishlistSlice';

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return { ...actual, persistReducer: (_cfg: unknown, reducer: unknown) => reducer, persistStore: () => ({}) };
});

const flush = async (ms = 2500) => {
  await jest.advanceTimersByTimeAsync(ms);
};

describe('store integration', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const bootstrap = async () => {
    const store = makeStore();
    const p = store.dispatch(indriyaApi.endpoints.getCatalog.initiate());
    await flush(1000);
    await p;
    return store;
  };

  it('loads the catalog and filters/sorts it through selectors', async () => {
    const store = await bootstrap();
    store.dispatch(browse({ categoryId: 'rings' }));
    const rings = selectFilteredProducts(store.getState());
    expect(rings.length).toBeGreaterThan(0);
    expect(rings.every((p) => p.categoryId === 'rings')).toBe(true);
    expect(selectRelated(store.getState(), 'ring-01').every((p) => p.id !== 'ring-01')).toBe(true);
  });

  it('adds to cart, derives totals, and raises a toast through the listener middleware', async () => {
    const store = await bootstrap();
    store.dispatch(addToCart({ productId: 'ring-01', size: '12', qty: 2 }));
    const state = store.getState();
    const price = selectProductById(state, 'ring-01')!.price;
    expect(selectCartCount(state)).toBe(2);
    expect(selectCartLines(state)[0].lineTotal).toBe(price * 2);
    expect(selectCartTotals(state).subtotal).toBe(price * 2);
    expect(state.ui.toasts.map((t: { message: string }) => t.message)).toContain('Added to your bag');
  });

  it('wishlist selectors resolve products', async () => {
    const store = await bootstrap();
    store.dispatch(toggleWishlist('ear-03'));
    expect(selectWishlistProducts(store.getState()).map((p) => p.id)).toEqual(['ear-03']);
  });

  it('validates coupons via the API and rejects bad codes', async () => {
    const store = await bootstrap();
    const bad = store.dispatch(indriyaApi.endpoints.validateCoupon.initiate({ code: 'NOPE', subtotal: 50000 }));
    await flush(800);
    expect((await bad).error).toMatchObject({ message: 'This code is not valid' });
    const ok = store.dispatch(indriyaApi.endpoints.validateCoupon.initiate({ code: 'welcome10', subtotal: 50000 }));
    await flush(800);
    const res = await ok;
    expect(res.data?.code).toBe('WELCOME10');
    store.dispatch(applyCoupon(res.data!));
    expect(store.getState().cart.coupon?.code).toBe('WELCOME10');
  });

  it('places an order: saves it, clears the cart and resets checkout', async () => {
    const store = await bootstrap();
    store.dispatch(addToCart({ productId: 'neck-02' }));
    store.dispatch(setAddress({ name: 'Amit', phone: '9876543210', line1: '12 MG Road', city: 'Mumbai', pincode: '400001' }));
    store.dispatch(setPayment('cod'));
    store.dispatch(setStep(2));
    const lines = selectCartLines(store.getState());
    const totals = selectCartTotals(store.getState());
    const { address, payment } = store.getState().checkout;
    const req = store.dispatch(
      indriyaApi.endpoints.placeOrder.initiate({
        lines: lines.map((l) => ({ productId: l.productId, name: l.product.name, qty: l.qty, unitPrice: l.product.price, shape: l.product.shape, tone: l.product.tone, gem: l.product.gem })),
        totals, address, payment,
      }),
    );
    await flush(2000);
    const res = await req;
    expect(res.data?.id).toMatch(/^IND-/);
    const s = store.getState();
    expect(s.orders.list).toHaveLength(1);
    expect(s.cart.items).toHaveLength(0);
    expect(s.checkout.step).toBe(0);
  });

  it('login/register populate auth state; bad credentials are rejected', async () => {
    const store = await bootstrap();
    const bad = store.dispatch(indriyaApi.endpoints.login.initiate({ email: 'nope', password: 'secret1' }));
    await flush(1000);
    expect((await bad).error).toMatchObject({ field: 'email' });
    const ok = store.dispatch(indriyaApi.endpoints.login.initiate({ email: 'priya.sharma@example.com', password: 'secret1' }));
    await flush(1000);
    await ok;
    expect(store.getState().auth.user?.name).toBe('Priya Sharma');
  });
});
