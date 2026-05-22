export type UserRole = 'customer' | 'admin';

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'shipped' | 'delivered';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  stock: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentIntentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PaymentSession {
  sessionId: string;
  url: string;
}

export const ROLES = {
  CUSTOMER: 'customer' as UserRole,
  ADMIN: 'admin' as UserRole,
};

export const ORDER_STATUS = {
  PENDING: 'pending' as OrderStatus,
  PAID: 'paid' as OrderStatus,
  CANCELLED: 'cancelled' as OrderStatus,
  SHIPPED: 'shipped' as OrderStatus,
  DELIVERED: 'delivered' as OrderStatus,
};

export const CURRENCY_CODES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
};

export const DEFAULT_CURRENCY = CURRENCY_CODES.USD;