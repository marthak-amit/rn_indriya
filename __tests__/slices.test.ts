import reducer, { MAX_QTY, addToCart, cartKey, removeFromCart, restoreCartItem, setQty } from '@/features/cart/cartSlice';
import filters, { browse, initialFilters, resetFilters, setSort, toggleMetal } from '@/features/catalog/filtersSlice';
import history, { addRecentSearch, productViewed } from '@/features/history/historySlice';
import wishlist, { toggleWishlist } from '@/features/wishlist/wishlistSlice';
import { validateAddress } from '@/features/checkout/checkoutSlice';
import { searchProducts } from '@/features/catalog/search';
import { products } from '@/data/catalog';
import { formatINR } from '@/utils/format';

const empty = { items: [], coupon: null };

describe('cartSlice', () => {
  it('merges identical product+size lines and caps quantity', () => {
    let s = reducer(empty, addToCart({ productId: 'ring-01', size: '12' }));
    s = reducer(s, addToCart({ productId: 'ring-01', size: '12', qty: 10 }));
    expect(s.items).toHaveLength(1);
    expect(s.items[0].qty).toBe(MAX_QTY);
  });
  it('treats different sizes as different lines', () => {
    let s = reducer(empty, addToCart({ productId: 'ring-01', size: '12' }));
    s = reducer(s, addToCart({ productId: 'ring-01', size: '14' }));
    expect(s.items.map((i) => i.key)).toEqual([cartKey('ring-01', '12'), cartKey('ring-01', '14')]);
  });
  it('removes a line when quantity drops to zero and can restore it (undo)', () => {
    let s = reducer(empty, addToCart({ productId: 'neck-01' }));
    const item = s.items[0];
    s = reducer(s, setQty({ key: item.key, qty: 0 }));
    expect(s.items).toHaveLength(0);
    s = reducer(s, restoreCartItem(item));
    expect(s.items).toEqual([item]);
    s = reducer(s, removeFromCart(item.key));
    expect(s.items).toHaveLength(0);
  });
});

describe('wishlistSlice', () => {
  it('toggles membership, newest first', () => {
    let s = wishlist(undefined, toggleWishlist('a'));
    s = wishlist(s, toggleWishlist('b'));
    expect(s.ids).toEqual(['b', 'a']);
    s = wishlist(s, toggleWishlist('b'));
    expect(s.ids).toEqual(['a']);
  });
});

describe('filtersSlice', () => {
  it('browse replaces the whole context; reset restores defaults', () => {
    let s = filters(undefined, setSort('priceAsc'));
    s = filters(s, toggleMetal('rose'));
    s = filters(s, browse({ categoryId: 'rings' }));
    expect(s).toEqual({ ...initialFilters, categoryId: 'rings' });
    expect(filters(s, resetFilters())).toEqual(initialFilters);
  });
});

describe('historySlice', () => {
  it('dedupes recent searches case-insensitively and caps the list', () => {
    let s = history(undefined, addRecentSearch('Gold'));
    s = history(s, addRecentSearch('gold'));
    expect(s.recentSearches).toEqual(['gold']);
    for (const q of ['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg']) s = history(s, addRecentSearch(q));
    expect(s.recentSearches).toHaveLength(6);
    expect(history(s, addRecentSearch('x')).recentSearches).toHaveLength(6); // too short, ignored
  });
  it('tracks recently viewed products with most recent first', () => {
    let s = history(undefined, productViewed('a'));
    s = history(s, productViewed('b'));
    s = history(s, productViewed('a'));
    expect(s.viewed).toEqual(['a', 'b']);
  });
});

describe('validateAddress', () => {
  it('flags every invalid field', () => {
    expect(Object.keys(validateAddress({ name: '', phone: '123', line1: '', city: '', pincode: '12' })).sort()).toEqual(['city', 'line1', 'name', 'phone', 'pincode']);
  });
  it('accepts a valid address', () => {
    expect(validateAddress({ name: 'Amit M', phone: '9876543210', line1: '12 MG Road', city: 'Mumbai', pincode: '400001' })).toEqual({});
  });
});

describe('searchProducts', () => {
  it('matches all tokens across name, metal, gem and tags', () => {
    const r = searchProducts(products, 'ruby gold');
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.gem === 'ruby' && /gold/i.test(p.metal))).toBe(true);
  });
  it('returns nothing for blank or unmatched queries', () => {
    expect(searchProducts(products, '  ')).toEqual([]);
    expect(searchProducts(products, 'zzzz')).toEqual([]);
  });
});

describe('formatINR', () => {
  it.each([[0, '₹0'], [999, '₹999'], [48900, '₹48,900'], [123456, '₹1,23,456'], [1234567, '₹12,34,567']])('%p → %p', (n, out) => expect(formatINR(n)).toBe(out));
});
