#!/bin/sh
set -e
if [ -n "$DATABASE_URL" ]; then
  npx prisma db push --skip-generate
  npx tsx prisma/seed.ts || true
fi
exec "$@"
