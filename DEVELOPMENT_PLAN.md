# DEVELOPMENT PLAN: Project

## 1. ARCHITECTURE OVERVIEW

**Components:**
- **Backend (NestJS, TypeScript, TypeORM):** Modular monolith providing REST API for authentication, product catalog, categories, cart, orders, and payments. Uses PostgreSQL for persistence and Redis for caching/session/cart.
- **Database:** PostgreSQL 15 (AWS RDS in prod), schema for users, products, categories, cart, orders, payments.
- **Cache:** Redis 7 (AWS ElastiCache in prod) for session and cart caching.
- **Payments:** Stripe API integration for payment sessions and webhooks.
- **Infrastructure:** Dockerized services, orchestrated via docker-compose for local/dev, AWS ECS Fargate for prod.
- **Shared Code:** TypeScript interfaces/types, DTOs, utility functions, and configuration.

**Models (from SPEC.md):**
- User, Product, Category, Cart, CartItem, Order, OrderItem, AuthToken, PaymentSession

**API Endpoints (from SPEC.md):**
- Auth: register, login, refresh, me
- Products: list, get, create, update, delete
- Categories: list, create, update, delete
- Cart: get, add item, update item, remove item
- Orders: list, get, create
- Payments: create session, webhook

**Folder Structure (from SPEC.md):**
- backend/api-service/src/...
  - users/, auth/, products/, categories/, cart/, orders/, payments/, shared/, config/
- backend/api-service/Dockerfile
- shared/types.ts, shared/utils.ts
- docker-compose.yml, .env.example, run.sh, README.md

## 2. ACCEPTANCE CRITERIA

1. The backend API exposes all endpoints as defined in SPEC.md, with correct request/response contracts and RBAC enforcement.
2. The database schema is auto-migrated and seeded with sample data on startup; all main entities (users, products, categories, etc.) are present and usable immediately after `./run.sh`.
3. The infrastructure supports zero-manual startup: `./run.sh` builds, starts, and healthchecks all services; API is accessible at the documented port; all endpoints respond as expected.

## TEAM SCOPE (MANDATORY — PARSED BY THE PIPELINE)
Every executable item MUST include exactly one line at the end of the item block (after Validation):
**Role:** <role_id> (<category>)

---

## 3. EXECUTABLE ITEMS

### ITEM 1: Foundation — shared types, interfaces, DB schemas, config
**Goal:** Create all shared code and configuration required by all backend modules. This includes TypeScript interfaces for all data contracts (User, Product, Category, Cart, CartItem, Order, OrderItem, AuthToken, PaymentSession), enums for roles/statuses, shared utility functions, and environment/config validation. Also includes TypeORM entity definitions for all main models, shared constants, and utility functions.
**Files to create:**
- shared/types.ts (create) — All TypeScript interfaces and enums as per SPEC.md §2 (User, Product, Category, Cart, CartItem, Order, OrderItem, AuthToken, PaymentSession, roles/status enums)
- shared/utils.ts (create) — Shared utility functions (e.g., date formatting, ID generation, hashing helpers)
- backend/api-service/src/shared/constants.ts (create) — Shared constants (e.g., role/status enums, currency codes)
- backend/api-service/src/shared/types.ts (create) — TypeScript types/interfaces for backend (imported from shared/types.ts)
- backend/api-service/src/shared/utils.ts (create) — Utility functions for backend modules (imported from shared/utils.ts)
- backend/api-service/src/config/ormconfig.ts (create) — TypeORM configuration (env-driven, validated)
- backend/api-service/src/config/redis.config.ts (create) — Redis connection config (env-driven, validated)
- backend/api-service/src/users/user.entity.ts (create) — TypeORM entity for User (matches SPEC.md and DB diagram)
- backend/api-service/src/products/product.entity.ts (create) — TypeORM entity for Product (matches SPEC.md and DB diagram)
- backend/api-service/src/categories/category.entity.ts (create) — TypeORM entity for Category (matches SPEC.md and DB diagram)
- backend/api-service/src/cart/cart.entity.ts (create) — TypeORM entity for Cart and CartItem (matches SPEC.md and DB diagram)
- backend/api-service/src/orders/order.entity.ts (create) — TypeORM entity for Order and OrderItem (matches SPEC.md and DB diagram)
**Dependencies:** None
**Validation:** `tsc --noEmit` passes in shared/ and backend/api-service/src/; all interfaces and entities match SPEC.md and DB diagram; config files validate required env vars on import.
**Role:** role-tl (technical_lead)

---

### ITEM 2: Authentication & User Management — Auth endpoints, user CRUD, JWT, RBAC
**Goal:** Implement all authentication and user management endpoints and logic as per SPEC.md. Includes registration, login, token refresh, get current user, JWT strategy, password hashing, and RBAC enforcement for admin/customer roles.
**Files to create:**
- backend/api-service/src/auth/auth.module.ts (create) — NestJS module definition for auth
- backend/api-service/src/auth/auth.controller.ts (create) — Implements: POST /api/auth/register, POST /api/auth/login, POST /api/auth/refresh, GET /api/auth/me
- backend/api-service/src/auth/auth.service.ts (create) — Business logic for registration, login, token issuance, refresh, and user lookup
- backend/api-service/src/auth/jwt.strategy.ts (create) — JWT validation and role enforcement
- backend/api-service/src/auth/auth.dto.ts (create) — DTOs for auth requests/responses (register, login, token, etc.)
- backend/api-service/src/users/users.module.ts (create) — User module definition
- backend/api-service/src/users/users.controller.ts (create) — User CRUD endpoints (if needed for admin, otherwise only internal use)
- backend/api-service/src/users/users.service.ts (create) — User management logic (find, create, update, etc.)
- backend/api-service/src/users/user.dto.ts (create) — DTOs for user entity
**Dependencies:** Item 1
**Validation:** `curl` to /api/auth/register, /api/auth/login, /api/auth/refresh, /api/auth/me returns correct responses; JWT tokens are issued and validated; RBAC enforced on protected endpoints.
**Role:** role-be (backend_developer)

---

### ITEM 3: Product & Category Management — Catalog endpoints, filtering, admin CRUD
**Goal:** Implement all product and category endpoints as per SPEC.md. Includes product listing (with optional category filter), product detail, admin-only create/update/delete for products and categories, and category listing.
**Files to create:**
- backend/api-service/src/products/products.module.ts (create) — Product module definition
- backend/api-service/src/products/products.controller.ts (create) — Implements: GET /api/products, GET /api/products/:id, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id
- backend/api-service/src/products/products.service.ts (create) — Business logic for product CRUD and filtering
- backend/api-service/src/products/product.dto.ts (create) — DTOs for product requests/responses
- backend/api-service/src/categories/categories.module.ts (create) — Category module definition
- backend/api-service/src/categories/categories.controller.ts (create) — Implements: GET /api/categories, POST /api/categories, PUT /api/categories/:id, DELETE /api/categories/:id
- backend/api-service/src/categories/categories.service.ts (create) — Business logic for category CRUD
- backend/api-service/src/categories/category.dto.ts (create) — DTOs for category requests/responses
**Dependencies:** Item 1
**Validation:** `curl` to /api/products and /api/categories returns paginated/filterable lists; admin-only endpoints enforce RBAC; product/category CRUD works as per SPEC.md.
**Role:** role-be (backend_developer)

---

### ITEM 4: Cart & Order Management — Cart endpoints, order creation, order history
**Goal:** Implement all cart and order endpoints as per SPEC.md. Includes cart retrieval, add/update/remove items, order creation from cart, order listing/history, and order detail. Cart is persisted per user (Redis-backed), and order creation decrements stock and clears cart.
**Files to create:**
- backend/api-service/src/cart/cart.module.ts (create) — Cart module definition
- backend/api-service/src/cart/cart.controller.ts (create) — Implements: GET /api/cart, POST /api/cart/items, PUT /api/cart/items/:productId, DELETE /api/cart/items/:productId
- backend/api-service/src/cart/cart.service.ts (create) — Business logic for cart management (add, update, remove, persist in Redis)
- backend/api-service/src/cart/cart.dto.ts (create) — DTOs for cart requests/responses
- backend/api-service/src/orders/orders.module.ts (create) — Orders module definition
- backend/api-service/src/orders/orders.controller.ts (create) — Implements: GET /api/orders, GET /api/orders/:id, POST /api/orders
- backend/api-service/src/orders/orders.service.ts (create) — Business logic for order creation, status management, stock decrement, order history
- backend/api-service/src/orders/order.dto.ts (create) — DTOs for order requests/responses
**Dependencies:** Item 1
**Validation:** `curl` to /api/cart and /api/orders endpoints returns correct data; cart persists per user; order creation decrements stock and clears cart; order history is accurate.
**Role:** role-be (backend_developer)

---

### ITEM 5: Payments Integration — Stripe session, webhook, payment status
**Goal:** Implement payment endpoints and Stripe integration as per SPEC.md. Includes creating Stripe payment sessions for orders, handling Stripe webhooks to update order/payment status, and ensuring payment status is reflected in orders.
**Files to create:**
- backend/api-service/src/payments/payments.module.ts (create) — Payments module definition
- backend/api-service/src/payments/payments.controller.ts (create) — Implements: POST /api/payments/create-session, POST /api/payments/webhook
- backend/api-service/src/payments/payments.service.ts (create) — Business logic for Stripe session creation, webhook handling, payment status updates
- backend/api-service/src/payments/payments.dto.ts (create) — DTOs for payment requests/responses
**Dependencies:** Item 1
**Validation:** `curl` to /api/payments/create-session returns Stripe session URL; Stripe webhook updates order/payment status; payment status is reflected in order entity.
**Role:** role-be (backend_developer)

---

### ITEM 6: Backend Service Entrypoint, App Module, Dockerfile
**Goal:** Implement the NestJS application entrypoint, root module, and Dockerfile for the backend API service. Ensures all modules are registered, healthcheck endpoint is available, and service runs on the correct port with production-ready Dockerfile.
**Files to create:**
- backend/api-service/src/main.ts (create) — NestJS bootstrap entrypoint, sets up app, global pipes, logging, healthcheck endpoint
- backend/api-service/src/app.module.ts (create) — Root NestJS module, imports all feature modules
- backend/api-service/Dockerfile (create) — Multi-stage build, non-root user, exposes port 23001, runs `node dist/main.js`
**Dependencies:** Item 1, Item 2, Item 3, Item 4, Item 5
**Validation:** `docker build` and `docker run` for backend/api-service succeeds; `/health` endpoint returns status; all modules are registered and functional.
**Role:** role-be (backend_developer)

---

### ITEM 7: Infrastructure & Deployment — Docker Compose, env, scripts, docs
**Goal:** Provide complete infrastructure for local/dev deployment. Includes docker-compose.yml with all services (backend, postgres, redis), healthchecks, environment variable template, run script, .gitignore, .dockerignore, and documentation.
**Files to create:**
- docker-compose.yml (create) — Orchestrates backend/api-service, postgres, redis; healthchecks and depends_on for all; correct ports per SPEC.md
- .env.example (create) — Documents all required env vars for backend, DB, Redis, Stripe, etc.
- .gitignore (create) — Excludes node_modules, dist, .env, logs, etc.
- .dockerignore (create) — Excludes node_modules, .git, dist, logs, etc.
- run.sh (create) — Validates Docker, builds images, starts services, waits for health, prints access URL
- README.md (create) — Setup instructions, endpoints, troubleshooting, architecture overview
- docs/architecture.md (create) — System/component diagram and descriptions
**Dependencies:** Item 1, Item 2, Item 3, Item 4, Item 5, Item 6
**Validation:** `./run.sh` completes with all services healthy; API accessible at http://localhost:23001; all endpoints respond; sample data present.
**Role:** role-devops (devops_support)
