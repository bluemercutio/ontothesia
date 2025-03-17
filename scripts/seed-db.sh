#!/usr/bin/env bash
set -e

# Load env vars from .env into the shell
set -a
source .env
set +a

# Ensure the database is ready before seeding
echo "Checking database connection..."
until npx prisma migrate status >/dev/null 2>&1; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Seed the database
echo "Seeding the database..."
npx prisma db seed

echo "Database seeding completed successfully!" 