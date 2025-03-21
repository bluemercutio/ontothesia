#!/usr/bin/env bash
set -e

# 1. Load env vars from .env into the shell
#    This is a common approach on macOS/Linux:
set -a
source .env
set +a

# 2. Run Docker container, passing in the loaded env variables
docker rm -f local-postgres 2>/dev/null || true  # Clean up existing container if it exists
docker run -d \
  --name local-postgres \
  -p ${DB_PORT}:5432 \
  -e POSTGRES_USER=${DB_USER} \
  -e POSTGRES_PASSWORD=${DB_PASSWORD} \
  -e POSTGRES_DB=${DB_NAME} \
  postgres:13

# 3. Wait for Postgres to be ready
echo "Waiting for PostgreSQL to become available..."
until docker exec local-postgres pg_isready -U "${DB_USER}" -h localhost >/dev/null 2>&1; do
  echo "Still waiting..."
  sleep 2
done
echo "Postgres is up and running!"

# 4. Generate Prisma client (moved to this script)
echo "Generating Prisma client..."
npx prisma generate

# 5. Run Prisma migrations (moved to this script)
echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Database is ready for use!"




