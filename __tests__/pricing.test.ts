import { computeTotals, couponDiscount, freeShippingProgress } from '@/features/cart/pricing';
import type { Coupon } from '@/services/api/types';

const pct: Coupon = { code: 'P10', kind: 'percent', value: 10, minSubtotal: 10000, maxDiscount: 5000, label: '' };
const flat: Coupon = { code: 'F2K', kind: 'flat', value: 2000, minSubtotal: 30000, label: '' };
const lines = (...totals: number[]) => totals.map((lineTotal) => ({ lineTotal }));

describe('couponDiscount', () => {
  it('applies percent discounts up to the cap', () => {
    expect(couponDiscount(pct, 20000)).toBe(2000);
    expect(couponDiscount(pct, 200000)).toBe(5000);
  });
  it('applies flat discounts', () => expect(couponDiscount(flat, 40000)).toBe(2000));
  it('ignores coupons below the minimum subtotal or when null', () => {
    expect(couponDiscount(pct, 9999)).toBe(0);
    expect(couponDiscount(null, 50000)).toBe(0);
  });
  it('never exceeds the subtotal', () => {
    expect(couponDiscount({ ...flat, minSubtotal: 0, value: 9999 }, 500)).toBe(500);
  });
});

describe('computeTotals', () => {
  it('charges shipping below the free-shipping threshold', () => {
    expect(computeTotals(lines(10000), null)).toEqual({ subtotal: 10000, discount: 0, shipping: 499, total: 10499 });
  });
  it('waives shipping at or above the threshold (after discount)', () => {
    expect(computeTotals(lines(25000), null).shipping).toBe(0);
    // 26000 - 2000 flat? needs min 30000, so use percent: 26000 - 2600 = 23400 < 25000 → shipping applies again
    expect(computeTotals(lines(26000), pct).shipping).toBe(499);
  });
  it('has no shipping or total for an empty cart', () => {
    expect(computeTotals([], null)).toEqual({ subtotal: 0, discount: 0, shipping: 0, total: 0 });
  });
});

describe('freeShippingProgress', () => {
  it('reports remaining amount and clamps progress', () => {
    expect(freeShippingProgress(5000)).toEqual({ remaining: 20000, progress: 0.2 });
    expect(freeShippingProgress(99999)).toEqual({ remaining: 0, progress: 1 });
  });
});
