# E-Commerce Outlet Premium

A premium outlet e-commerce platform built with NestJS, React, PostgreSQL, and Redis.

## Architecture

```
├── backend/
│   └── api-service/        # NestJS API service (Port 23001)
├── docker-compose.yml     # Multi-service orchestration
├── run.sh                 # Startup script
└── .env.example           # Environment configuration template
```

## Tech Stack

- **Backend**: Node.js 20, NestJS 10, TypeScript, TypeORM
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Payments**: Stripe API
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Docker 24.x+
- Docker Compose

### Start Services

```bash
./run.sh
```

This script will:
1. Create `.env` from `.env.example` if not present
2. Validate Docker installation
3. Build and start all services
4. Wait for services to be healthy
5. Display access URLs and endpoints

### Services

| Service    | Port  | URL                          |
|------------|-------|------------------------------|
| API        | 23001 | http://localhost:23001       |
| PostgreSQL | 25432 | localhost:25432               |
| Redis      | 26379 | localhost:26379              |

## API Endpoints

### Authentication

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | /api/auth/register | Register new user        |
| POST   | /api/auth/login    | Login user               |
| POST   | /api/auth/refresh  | Refresh access token     |
| GET    | /api/auth/me       | Get current user         |

### Products

| Method | Endpoint             | Description           |
|--------|----------------------|-----------------------|
| GET    | /api/products        | List all products     |
| GET    | /api/products/:id    | Get product by ID     |
| POST   | /api/products        | Create product [admin]|
| PUT    | /api/products/:id    | Update product [admin]|
| DELETE | /api/products/:id   | Delete product [admin]|

### Categories

| Method | Endpoint             | Description           |
|--------|----------------------|-----------------------|
| GET    | /api/categories      | List all categories   |
| POST   | /api/categories     | Create category [admin]|
| PUT    | /api/categories/:id | Update category [admin]|
| DELETE | /api/categories/:id | Delete category [admin]|

### Cart

| Method | Endpoint                 | Description        |
|--------|--------------------------|--------------------|
| GET    | /api/cart                | Get user cart      |
| POST   | /api/cart/items          | Add item to cart   |
| PUT    | /api/cart/items/:productId | Update cart item |
| DELETE | /api/cart/items/:productId | Remove from cart |

### Orders

| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | /api/orders       | List user orders   |
| GET    | /api/orders/:id  | Get order by ID    |
| POST   | /api/orders       | Create new order   |

### Payments

| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| POST   | /api/payments/create-session | Create Stripe session |
| POST   | /api/payments/webhook     | Stripe webhook        |

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | postgres |
| `DATABASE_PORT` | PostgreSQL port | 25432 |
| `DATABASE_USER` | Database user | postgres |
| `DATABASE_PASSWORD` | Database password | postgres |
| `DATABASE_NAME` | Database name | ecommerce |
| `REDIS_HOST` | Redis host | redis |
| `REDIS_PORT` | Redis port | 26379 |
| `REDIS_PASSWORD` | Redis password | (empty) |
| `JWT_SECRET` | JWT signing secret | (change in production) |
| `STRIPE_SECRET_KEY` | Stripe API key | (add your key) |

## Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose build --no-cache

# Restart a specific service
docker-compose restart api-service
```

## Health Check

```bash
curl http://localhost:23001/api/health
```

Response:
```json
{
  "status": "ok",
  "service": "api-service",
  "version": "1.0.0"
}
```

## Troubleshooting

### Services not starting

1. Check Docker is running: `docker ps`
2. Check ports are available: `lsof -i :23001`
3. View logs: `docker-compose logs api-service`

### Database connection issues

1. Wait for postgres to be healthy
2. Check DATABASE_HOST matches the service name in docker-compose
3. Verify credentials in .env

### API returns 500

1. Check logs: `docker-compose logs api-service`
2. Verify all environment variables are set
3. Ensure migrations ran (check startup logs)