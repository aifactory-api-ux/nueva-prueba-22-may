# SPEC.md

## 1. TECHNOLOGY STACK

- **Node.js**: 20.x
- **NestJS**: 10.x
- **TypeScript**: 5.x
- **React**: 18.x
- **TypeORM**: 0.3.x
- **PostgreSQL**: 15.x
- **Redis**: 7.x
- **Stripe API**: 2023-08-16
- **Tailwind CSS**: 3.x
- **Docker**: 24.x
- **AWS ECS Fargate**
- **AWS RDS PostgreSQL**
- **AWS ElastiCache Redis**
- **AWS CloudFront**

## 2. DATA CONTRACTS

### TypeScript Interfaces (Backend & Frontend)

#### User

```typescript
export interface User {
  id: string; // UUID
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'customer' | 'admin';
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}
```

#### Product

```typescript
export interface Product {
  id: string; // UUID
  name: string;
  description: string;
  price: number; // cents
  currency: string; // ISO 4217 (e.g., 'USD')
  imageUrl: string;
  stock: number;
  categoryId: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}
```

#### Category

```typescript
export interface Category {
  id: string; // UUID
  name: string;
  description: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}
```

#### CartItem

```typescript
export interface CartItem {
  productId: string;
  quantity: number;
}
```

#### Cart

```typescript
export interface Cart {
  id: string; // UUID
  userId: string;
  items: CartItem[];
  updatedAt: string; // ISO8601
}
```

#### Order

```typescript
export interface Order {
  id: string; // UUID
  userId: string;
  items: OrderItem[];
  totalAmount: number; // cents
  currency: string; // ISO 4217
  status: 'pending' | 'paid' | 'cancelled' | 'shipped' | 'delivered';
  paymentIntentId: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}
```

#### OrderItem

```typescript
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number; // cents
}
```

#### AuthToken

```typescript
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}
```

#### PaymentSession

```typescript
export interface PaymentSession {
  sessionId: string;
  url: string;
}
```

## 3. API ENDPOINTS

### Auth

- **POST /api/auth/register**
  - Request: `{ email: string; password: string; fullName: string }`
  - Response: `User`

- **POST /api/auth/login**
  - Request: `{ email: string; password: string }`
  - Response: `AuthToken`

- **POST /api/auth/refresh**
  - Request: `{ refreshToken: string }`
  - Response: `AuthToken`

- **GET /api/auth/me**
  - Auth: Bearer token
  - Response: `User`

### Products

- **GET /api/products**
  - Query: `?categoryId?: string`
  - Response: `Product[]`

- **GET /api/products/:id**
  - Response: `Product`

- **POST /api/products** (admin only)
  - Request: `Product` (without id, createdAt, updatedAt)
  - Response: `Product`

- **PUT /api/products/:id** (admin only)
  - Request: Partial<Product>
  - Response: `Product`

- **DELETE /api/products/:id** (admin only)
  - Response: `{ success: boolean }`

### Categories

- **GET /api/categories**
  - Response: `Category[]`

- **POST /api/categories** (admin only)
  - Request: `{ name: string; description: string }`
  - Response: `Category`

- **PUT /api/categories/:id** (admin only)
  - Request: Partial<Category>
  - Response: `Category`

- **DELETE /api/categories/:id** (admin only)
  - Response: `{ success: boolean }`

### Cart

- **GET /api/cart**
  - Auth: Bearer token
  - Response: `Cart`

- **POST /api/cart/items**
  - Auth: Bearer token
  - Request: `{ productId: string; quantity: number }`
  - Response: `Cart`

- **PUT /api/cart/items/:productId**
  - Auth: Bearer token
  - Request: `{ quantity: number }`
  - Response: `Cart`

- **DELETE /api/cart/items/:productId**
  - Auth: Bearer token
  - Response: `Cart`

### Orders

- **GET /api/orders**
  - Auth: Bearer token
  - Response: `Order[]`

- **GET /api/orders/:id**
  - Auth: Bearer token
  - Response: `Order`

- **POST /api/orders**
  - Auth: Bearer token
  - Request: `{ items: CartItem[] }`
  - Response: `Order`

### Payments

- **POST /api/payments/create-session**
  - Auth: Bearer token
  - Request: `{ orderId: string }`
  - Response: `PaymentSession`

- **POST /api/payments/webhook**
  - Stripe webhook endpoint
  - Request: Stripe event payload
  - Response: `{ received: true }`

## 4. FILE STRUCTURE

### PORT TABLE

| Service         | Listening Port | Path                      |
|-----------------|---------------|---------------------------|
| api-service     | 23001         | backend/api-service/      |
| redis           | 26379         | (docker-compose only)     |
| postgres        | 25432         | (docker-compose only)     |
| frontend        | 24000         | frontend/                 |

### FILE TREE

```
.
├── docker-compose.yml                # Multi-service orchestration
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root startup script
├── backend/
│   ├── api-service/
│   │   ├── Dockerfile               # API service Dockerfile (EXPOSE 23001)
│   │   ├── src/
│   │   │   ├── main.ts              # NestJS entry point
│   │   │   ├── app.module.ts        # Root module
│   │   │   ├── users/
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── user.dto.ts
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── auth.dto.ts
│   │   │   ├── products/
│   │   │   │   ├── products.module.ts
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   ├── product.entity.ts
│   │   │   │   └── product.dto.ts
│   │   │   ├── categories/
│   │   │   │   ├── categories.module.ts
│   │   │   │   ├── categories.controller.ts
│   │   │   │   ├── categories.service.ts
│   │   │   │   ├── category.entity.ts
│   │   │   │   └── category.dto.ts
│   │   │   ├── cart/
│   │   │   │   ├── cart.module.ts
│   │   │   │   ├── cart.controller.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── cart.entity.ts
│   │   │   │   └── cart.dto.ts
│   │   │   ├── orders/
│   │   │   │   ├── orders.module.ts
│   │   │   │   ├── orders.controller.ts
│   │   │   │   ├── orders.service.ts
│   │   │   │   ├── order.entity.ts
│   │   │   │   └── order.dto.ts
│   │   │   ├── payments/
│   │   │   │   ├── payments.module.ts
│   │   │   │   ├── payments.controller.ts
│   │   │   │   ├── payments.service.ts
│   │   │   │   └── payments.dto.ts
│   │   │   ├── shared/
│   │   │   │   ├── constants.ts
│   │   │   │   ├── utils.ts
│   │   │   │   └── types.ts
│   │   │   └── config/
│   │   │       ├── ormconfig.ts
│   │   │       └── redis.config.ts
│   │   └── test/
│   │       └── ...                  # Unit/integration tests
│   └── shared/                      # Shared code for backend services
│       ├── types.ts
│       └── utils.ts
├── frontend/
│   ├── Dockerfile                   # Frontend Dockerfile (EXPOSE 24000)
│   ├── public/
│   │   ├── index.html               # HTML entry point
│   │   └── favicon.ico
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Root component
│   │   ├── api/
│   │   │   ├── client.ts            # API client
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── cart.ts
│   │   │   ├── orders.ts
│   │   │   └── payments.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useProducts.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useOrders.ts
│   │   │   └── useCategories.ts
│   │   ├── components/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderDetails.tsx
│   │   │   ├── CategoryList.tsx
│   │   │   ├── AuthForm.tsx
│   │   │   └── AdminPanel.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── ProductPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── styles/
│   │   │   ├── tokens.ts            # Design tokens (see §9)
│   │   │   └── tailwind.css
│   │   └── types/
│   │       ├── index.ts             # Shared TypeScript interfaces
│   │       └── api.ts
│   └── tailwind.config.js
├── scripts/
│   └── migrate-db.sh                # DB migration script
```

## 5. ENVIRONMENT VARIABLES

| Name                    | Type   | Description                                    | Example Value                |
|-------------------------|--------|------------------------------------------------|------------------------------|
| NODE_ENV                | string | Node environment                               | production                   |
| PORT                    | number | API service port                               | 23001                        |
| FRONTEND_PORT           | number | Frontend port                                  | 24000                        |
| DATABASE_URL            | string | PostgreSQL connection string                   | postgres://user:pass@db:5432/app |
| REDIS_URL               | string | Redis connection string                        | redis://redis:6379           |
| JWT_SECRET              | string | JWT signing secret                             | supersecretjwtkey            |
| JWT_EXPIRES_IN          | string | JWT expiration (e.g., '1h')                    | 1h                           |
| REFRESH_TOKEN_SECRET    | string | Refresh token secret                           | refreshsecret                |
| REFRESH_TOKEN_EXPIRES_IN| string | Refresh token expiration (e.g., '7d')          | 7d                           |
| STRIPE_SECRET_KEY       | string | Stripe API secret key                          | sk_test_...                  |
| STRIPE_WEBHOOK_SECRET   | string | Stripe webhook signing secret                  | whsec_...                    |
| AWS_REGION              | string | AWS region                                     | us-east-1                    |
| AWS_RDS_HOST            | string | AWS RDS hostname                              | mydb.abcdefg.us-east-1.rds.amazonaws.com |
| AWS_RDS_PORT            | number | AWS RDS port                                  | 5432                         |
| AWS_RDS_USER            | string | AWS RDS username                              | appuser                      |
| AWS_RDS_PASSWORD        | string | AWS RDS password                              | password123                  |
| AWS_RDS_DB              | string | AWS RDS database name                         | appdb                        |
| AWS_REDIS_HOST          | string | AWS ElastiCache Redis hostname                | myredis.abcdefg.use1.cache.amazonaws.com |
| AWS_REDIS_PORT          | number | AWS ElastiCache Redis port                    | 6379                         |
| CLOUD_FRONT_URL         | string | AWS CloudFront distribution URL                | https://d1234.cloudfront.net |

## 6. IMPORT CONTRACTS

### Backend

- `from users.service import UsersService`
- `from users.controller import UsersController`
- `from users.entity import User`
- `from users.dto import CreateUserDto, UpdateUserDto`
- `from auth.service import AuthService`
- `from auth.controller import AuthController`
- `from auth.dto import LoginDto, RegisterDto, AuthTokenDto`
- `from products.service import ProductsService`
- `from products.controller import ProductsController`
- `from products.entity import Product`
- `from products.dto import CreateProductDto, UpdateProductDto`
- `from categories.service import CategoriesService`
- `from categories.controller import CategoriesController`
- `from categories.entity import Category`
- `from categories.dto import CreateCategoryDto, UpdateCategoryDto`
- `from cart.service import CartService`
- `from cart.controller import CartController`
- `from cart.entity import Cart`
- `from cart.dto import AddCartItemDto, UpdateCartItemDto`
- `from orders.service import OrdersService`
- `from orders.controller import OrdersController`
- `from orders.entity import Order`
- `from orders.dto import CreateOrderDto`
- `from payments.service import PaymentsService`
- `from payments.controller import PaymentsController`
- `from payments.dto import CreatePaymentSessionDto, PaymentSessionDto`
- `from shared.constants import ROLES, ORDER_STATUS`
- `from shared.utils import hashPassword, comparePassword, generateUUID`
- `from shared.types import User, Product, Category, Cart, Order, OrderItem, CartItem, AuthToken, PaymentSession`

### Frontend

- `import { useAuth } from '../hooks/useAuth'`
- `import { useProducts } from '../hooks/useProducts'`
- `import { useCart } from '../hooks/useCart'`
- `import { useOrders } from '../hooks/useOrders'`
- `import { useCategories } from '../hooks/useCategories'`
- `import { Product, Category, Cart, CartItem, Order, OrderItem, AuthToken, PaymentSession, User } from '../types'`
- `import { tokens } from '../styles/tokens'`
- `import { apiClient } from '../api/client'`
- `import { login, register, refreshToken } from '../api/auth'`
- `import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/products'`
- `import { fetchCart, addCartItem, updateCartItem, removeCartItem } from '../api/cart'`
- `import { fetchOrders, createOrder } from '../api/orders'`
- `import { createPaymentSession } from '../api/payments'`

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### React Hooks

- `useAuth() → { user: User | null, loading: boolean, error: string | null, login(email: string, password: string): Promise<void>, register(email: string, password: string, fullName: string): Promise<void>, logout(): void, refresh(): Promise<void> }`
- `useProducts() → { products: Product[], loading: boolean, error: string | null, fetchProducts(categoryId?: string): Promise<void>, createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<void>, updateProduct(id: string, product: Partial<Product>): Promise<void>, deleteProduct(id: string): Promise<void> }`
- `useCart() → { cart: Cart | null, loading: boolean, error: string | null, addCartItem(productId: string, quantity: number): Promise<void>, updateCartItem(productId: string, quantity: number): Promise<void>, removeCartItem(productId: string): Promise<void>, clearCart(): Promise<void> }`
- `useOrders() → { orders: Order[], loading: boolean, error: string | null, fetchOrders(): Promise<void>, createOrder(items: CartItem[]): Promise<Order> }`
- `useCategories() → { categories: Category[], loading: boolean, error: string | null, fetchCategories(): Promise<void>, createCategory(name: string, description: string): Promise<void>, updateCategory(id: string, data: Partial<Category>): Promise<void>, deleteCategory(id: string): Promise<void> }`

### Reusable Components

- `ProductList` props: `{ products: Product[], onSelect: (id: string) => void }`
- `ProductCard` props: `{ product: Product, onAddToCart: (productId: string) => void }`
- `Cart` props: `{ cart: Cart, onUpdateItem: (productId: string, quantity: number) => void, onRemoveItem: (productId: string) => void, onCheckout: () => void }`
- `CartItem` props: `{ item: CartItem, product: Product, onUpdate: (quantity: number) => void, onRemove: () => void }`
- `CheckoutForm` props: `{ cart: Cart, onSubmit: () => void, loading: boolean }`
- `OrderList` props: `{ orders: Order[], onSelect: (id: string) => void }`
- `OrderDetails` props: `{ order: Order }`
- `CategoryList` props: `{ categories: Category[], onSelect: (id: string) => void }`
- `AuthForm` props: `{ onSubmit: (data: { email: string, password: string, fullName?: string }) => void, loading: boolean, error: string | null, isRegister?: boolean }`
- `AdminPanel` props: `{ users: User[], products: Product[], categories: Category[], onUserUpdate: (id: string, data: Partial<User>) => void, onProductUpdate: (id: string, data: Partial<Product>) => void, onCategoryUpdate: (id: string, data: Partial<Category>) => void }`

## 8. FILE EXTENSION CONVENTION

- All frontend files use `.tsx` (TypeScript React).
- The project is TypeScript-only (no JavaScript files).
- Entry point: `/src/main.tsx` (as referenced in `public/index.html` via `<script src="/src/main.tsx">`).

## 9. DESIGN TOKENS

```typescript
export const tokens = {
  colors: {
    primary: '#1A202C',
    secondary: '#2D3748',
    accent: '#F6AD55',
    background: '#F7FAFC',
    surface: '#FFFFFF',
    error: '#E53E3E',
    success: '#38A169',
    warning: '#DD6B20',
    text: '#2D3748',
    muted: '#A0AEC0'
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSizeBase: '1rem',
    fontWeightRegular: 400,
    fontWeightBold: 700,
    lineHeightBase: 1.5,
    heading1: '2.25rem',
    heading2: '1.5rem',
    heading3: '1.25rem'
  },
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem'
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
  }
};
```