export const ROLES = {
  CUSTOMER: 'customer' as const,
  ADMIN: 'admin' as const,
};

export const ORDER_STATUS = {
  PENDING: 'pending' as const,
  PAID: 'paid' as const,
  CANCELLED: 'cancelled' as const,
  SHIPPED: 'shipped' as const,
  DELIVERED: 'delivered' as const,
};

export const CURRENCY_CODES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
};

export const DEFAULT_CURRENCY = CURRENCY_CODES.USD;

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: '1h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
};

export const API_CONFIG = {
  PREFIX: '/api',
  PORT: parseInt(process.env.PORT || '23001', 10),
  BODY_LIMIT: '10mb',
};

export const REDIS_CONFIG = {
  KEY_PREFIX: 'ecommerce:',
  CART_TTL: 60 * 60 * 24 * 7,
  SESSION_TTL: 60 * 60 * 24,
};

export const STRIPE_CONFIG = {
  API_VERSION: '2023-08-16',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};