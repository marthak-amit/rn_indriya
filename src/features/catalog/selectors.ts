import { createSelector } from '@reduxjs/toolkit';
import { indriyaApi } from '@/services/api/indriyaApi';
import type { RootState } from '@/store/types';
import { computeTotals, type CartLine } from '@/features/cart/pricing';
import { searchProducts } from './search';
import type { Banner, Category, Collection, Product, SortKey } from './types';

const EMPTY_PRODUCTS: Product[] = [];
const EMPTY_CATEGORIES: Category[] = [];
const EMPTY_COLLECTIONS: Collection[] = [];
const EMPTY_BANNERS: Banner[] = [];

const selectCatalogResult = indriyaApi.endpoints.getCatalog.select();
export const selectCatalogStatus = (s: RootState) => selectCatalogResult(s).status;
export const selectProducts = (s: RootState) => selectCatalogResult(s).data?.products ?? EMPTY_PRODUCTS;
export const selectCategories = (s: RootState) => selectCatalogResult(s).data?.categories ?? EMPTY_CATEGORIES;
export const selectCollections = (s: RootState) => selectCatalogResult(s).data?.collections ?? EMPTY_COLLECTIONS;
export const selectBanners = (s: RootState) => selectCatalogResult(s).data?.banners ?? EMPTY_BANNERS;

export const selectProductsById = createSelector([selectProducts], (products) =>
  Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product | undefined>,
);
export const selectProductById = (s: RootState, id: string) => selectProductsById(s)[id];

export const selectBestsellers = createSelector([selectProducts], (p) => p.filter((x) => x.isBestseller));
export const selectNewArrivals = createSelector([selectProducts], (p) => p.filter((x) => x.isNew));

export const selectRelated = (s: RootState, id: string): Product[] => {
  const product = selectProductById(s, id);
  if (!product) return EMPTY_PRODUCTS;
  return selectProducts(s).filter((p) => p.id !== id && (p.categoryId === product.categoryId || p.collectionId === product.collectionId)).slice(0, 8);
};

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller) || (b.rating ?? 0) - (a.rating ?? 0),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
  newest: (a, b) => Number(!!b.isNew) - Number(!!a.isNew) || (b.rating ?? 0) - (a.rating ?? 0),
};

export const selectFilters = (s: RootState) => s.filters;

export const selectFilteredProducts = createSelector([selectProducts, selectFilters], (products, f) => {
  const base = f.query ? searchProducts(products, f.query) : products;
  return base
    .filter((p) => (f.categoryId ? p.categoryId === f.categoryId : true))
    .filter((p) => (f.collectionId ? p.collectionId === f.collectionId : true))
    .filter((p) => (f.metals.length ? f.metals.includes(p.tone) : true))
    .filter((p) => (f.priceMax ? p.price <= f.priceMax : true))
    .sort(sorters[f.sort]);
});

export const selectActiveFilterCount = createSelector([selectFilters], (f) => f.metals.length + (f.priceMax ? 1 : 0) + (f.collectionId ? 1 : 0));

// ---- wishlist
export const selectWishlistIds = (s: RootState) => s.wishlist.ids;
export const selectIsWishlisted = (s: RootState, id: string) => s.wishlist.ids.includes(id);
export const selectWishlistProducts = createSelector([selectWishlistIds, selectProductsById], (ids, byId) =>
  ids.map((id) => byId[id]).filter((p): p is Product => !!p),
);

// ---- history
export const selectViewedProducts = createSelector([(s: RootState) => s.history.viewed, selectProductsById], (ids, byId) =>
  ids.map((id) => byId[id]).filter((p): p is Product => !!p),
);

// ---- cart
export const selectCartLines = createSelector([(s: RootState) => s.cart.items, selectProductsById], (items, byId): CartLine[] =>
  items.flatMap((item) => {
    const product = byId[item.productId];
    return product ? [{ ...item, product, lineTotal: product.price * item.qty }] : [];
  }),
);
export const selectCartCoupon = (s: RootState) => s.cart.coupon;
export const selectCartTotals = createSelector([selectCartLines, selectCartCoupon], computeTotals);
export const selectCartCount = createSelector([(s: RootState) => s.cart.items], (items) => items.reduce((n, i) => n + i.qty, 0));
