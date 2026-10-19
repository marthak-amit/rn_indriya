import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { catalogSeed } from '@/data/catalog';
import { showrooms, type Showroom } from '@/data/stores';
import type { Catalog } from '@/features/catalog/types';
import { sleep, uid } from '@/utils/format';
import type { ApiError, Coupon, Order, PlaceOrderRequest, User } from './types';

/**
 * Single API surface for the app. Endpoints currently resolve against local
 * seed data through `queryFn` (simulated latency). To go live, replace
 * `fakeBaseQuery` with `fetchBaseQuery({ baseUrl })` and swap each `queryFn`
 * for a `query` — hooks and consumers stay untouched.
 */
const COUPONS: Coupon[] = [
  { code: 'WELCOME10', kind: 'percent', value: 10, minSubtotal: 10000, maxDiscount: 5000, label: '10% off up to ₹5,000' },
  { code: 'FESTIVE2000', kind: 'flat', value: 2000, minSubtotal: 30000, label: '₹2,000 off orders above ₹30,000' },
];

const fail = (message: string, field?: string): { error: ApiError } => ({ error: { message, field } });

export const indriyaApi = createApi({
  reducerPath: 'indriyaApi',
  baseQuery: fakeBaseQuery<ApiError>(),
  tagTypes: ['Catalog', 'Stores'],
  endpoints: (build) => ({
    getCatalog: build.query<Catalog, void>({
      queryFn: async () => {
        await sleep(900);
        return { data: catalogSeed };
      },
      providesTags: ['Catalog'],
    }),
    getStores: build.query<Showroom[], void>({
      queryFn: async () => {
        await sleep(500);
        return { data: showrooms };
      },
      providesTags: ['Stores'],
    }),
    login: build.mutation<User, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        await sleep(900);
        if (!/^\S+@\S+\.\S+$/.test(email)) return fail('Enter a valid email address', 'email');
        if (password.length < 6) return fail('Password must be at least 6 characters', 'password');
        const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return { data: { id: `u_${email}`, name, email } };
      },
    }),
    register: build.mutation<User, { name: string; email: string; password: string }>({
      queryFn: async ({ name, email, password }) => {
        await sleep(1000);
        if (name.trim().length < 2) return fail('Please enter your name', 'name');
        if (!/^\S+@\S+\.\S+$/.test(email)) return fail('Enter a valid email address', 'email');
        if (password.length < 6) return fail('Password must be at least 6 characters', 'password');
        return { data: { id: `u_${email}`, name: name.trim(), email } };
      },
    }),
    validateCoupon: build.mutation<Coupon, { code: string; subtotal: number }>({
      queryFn: async ({ code, subtotal }) => {
        await sleep(600);
        const coupon = COUPONS.find((c) => c.code === code.trim().toUpperCase());
        if (!coupon) return fail('This code is not valid', 'coupon');
        if (subtotal < coupon.minSubtotal) return fail(`Add items worth ₹${coupon.minSubtotal} to use ${coupon.code}`, 'coupon');
        return { data: coupon };
      },
    }),
    placeOrder: build.mutation<Order, PlaceOrderRequest>({
      queryFn: async (req) => {
        await sleep(1600);
        const order: Order = { ...req, id: `IND-${uid('').replace(/^_/, '').toUpperCase().slice(-8)}`, createdAt: new Date().toISOString(), status: 'confirmed' };
        return { data: order };
      },
    }),
  }),
});

export const {
  useGetCatalogQuery,
  useGetStoresQuery,
  useLoginMutation,
  useRegisterMutation,
  useValidateCouponMutation,
  usePlaceOrderMutation,
} = indriyaApi;
