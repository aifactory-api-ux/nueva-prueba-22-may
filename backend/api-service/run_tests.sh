#!/bin/bash
# composer-generated for api-service (port 23001)
set -e
cd "$(dirname "$0")"
npm install --silent 2>/dev/null || true
npx jest --coverage --forceExit --passWithNoTests
