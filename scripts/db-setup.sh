#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! docker info >/dev/null 2>&1; then
  echo ""
  echo "❌ Docker не запущен."
  echo "   1. Откройте приложение Docker Desktop"
  echo "   2. Дождитесь статуса «Docker is running»"
  echo "   3. Снова выполните: npm run db:up"
  echo ""
  exit 1
fi

echo "→ Запуск PostgreSQL (docker compose)..."
docker compose up -d db

echo "→ Ожидание готовности базы..."
for i in $(seq 1 30); do
  if docker compose exec -T db pg_isready -U inkstudio -d inkstudio >/dev/null 2>&1; then
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "❌ PostgreSQL не ответил за 30 секунд"
    exit 1
  fi
  sleep 1
done

echo "→ Применение схемы (prisma db push)..."
npx prisma db push

echo "→ Заполнение данными (seed)..."
npm run db:seed

echo ""
echo "✅ База данных готова на localhost:5433"
echo "   Запустите сайт: npm run dev"
echo ""
