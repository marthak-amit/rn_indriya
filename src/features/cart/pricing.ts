import { brand } from '@/config/brand';
import type { Coupon, OrderTotals } from '@/services/api/types';
import type { Product } from '@/features/catalog/types';
import type { CartItem } from './cartSlice';

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

export const couponDiscount = (coupon: Coupon | null, subtotal: number): number => {
  if (!coupon || subtotal < coupon.minSubtotal) return 0;
  const raw = coupon.kind === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
  return Math.min(Math.round(raw), coupon.maxDiscount ?? Number.POSITIVE_INFINITY, subtotal);
};

export const computeTotals = (lines: Pick<CartLine, 'lineTotal'>[], coupon: Coupon | null): OrderTotals => {
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const discount = couponDiscount(coupon, subtotal);
  const afterDiscount = subtotal - discount;
  const shipping = lines.length === 0 || afterDiscount >= brand.freeShippingThreshold ? 0 : brand.shippingFee;
  return { subtotal, discount, shipping, total: afterDiscount + shipping };
};

export const freeShippingProgress = (subtotalAfterDiscount: number): { remaining: number; progress: number } => {
  const remaining = Math.max(0, brand.freeShippingThreshold - subtotalAfterDiscount);
  return { remaining, progress: Math.min(1, subtotalAfterDiscount / brand.freeShippingThreshold) };
};
