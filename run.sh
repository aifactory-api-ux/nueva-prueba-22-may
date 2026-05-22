#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$SCRIPT_DIR/.env" ]; then
    cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
    echo "✓ .env created from .env.example"
fi

echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

DOCKER_COMPOSE_CMD=""
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    DOCKER_COMPOSE_CMD="docker-compose"
fi

cd "$SCRIPT_DIR"

echo "Building and starting services..."
$DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true
$DOCKER_COMPOSE_CMD build --no-cache api-service
$DOCKER_COMPOSE_CMD up -d

echo "Waiting for services to be healthy..."

MAX_WAIT=120
ELAPSED=0
INTERVAL=5

while [ $ELAPSED -lt $MAX_WAIT ]; do
    API_HEALTH=$($DOCKER_COMPOSE_CMD exec -T api-service wget -qO- http://localhost:23001/api/health 2>/dev/null || echo "")

    if echo "$API_HEALTH" | grep -q "ok"; then
        echo ""
        echo "========================================"
        echo "✓ All services are healthy!"
        echo "========================================"
        echo ""
        echo "API Service:    http://localhost:23001"
        echo "API Health:     http://localhost:23001/api/health"
        echo ""
        echo "API Endpoints:"
        echo "  POST /api/auth/register"
        echo "  POST /api/auth/login"
        echo "  POST /api/auth/refresh"
        echo "  GET  /api/auth/me"
        echo "  GET  /api/products"
        echo "  GET  /api/categories"
        echo "  GET  /api/cart"
        echo "  POST /api/cart/items"
        echo "  GET  /api/orders"
        echo "  POST /api/payments/create-session"
        echo ""
        echo "To view logs:   $DOCKER_COMPOSE_CMD logs -f"
        echo "To stop:        $DOCKER_COMPOSE_CMD down"
        echo ""
        exit 0
    fi

    echo -n "."
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

echo ""
echo "Error: Services did not become healthy in time."
echo "Showing service logs:"
$DOCKER_COMPOSE_CMD logs --tail=50
exit 1