export interface ApiError {
  message: string;
  field?: string;
}

export interface Coupon {
  code: string;
  kind: 'percent' | 'flat';
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
  label: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  city: string;
  pincode: string;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface OrderLine {
  productId: string;
  name: string;
  qty: number;
  size?: string;
  unitPrice: number;
  shape: string;
  tone: string;
  gem: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface Order {
  id: string;
  createdAt: string;
  lines: OrderLine[];
  totals: OrderTotals;
  address: Address;
  payment: PaymentMethod;
  couponCode?: string;
  status: 'confirmed' | 'packed' | 'shipped' | 'delivered';
}

export type PlaceOrderRequest = Omit<Order, 'id' | 'createdAt' | 'status'>;
