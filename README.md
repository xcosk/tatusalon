# INK / STUDIO — Tattoo Salon Website

Production-ready сайт тату-студии на Next.js 15, PostgreSQL, Prisma, NextAuth.

## Стек

- Next.js 15 (App Router), TypeScript, Tailwind CSS 4
- PostgreSQL + Prisma ORM
- NextAuth (credentials), Zustand-ready architecture
- React Hook Form + Zod, Framer Motion, UploadThing
- Docker + docker-compose

## Быстрый старт

**Сначала запустите Docker Desktop** (иконка кита в меню macOS → «Docker is running»).

```bash
cp .env.example .env   # если ещё нет .env
npm install
npm run db:up          # PostgreSQL + схема + seed (одной командой)
npm run dev
```

Или вручную:

```bash
docker compose up -d db
npx prisma db push
npm run db:seed
npm run dev
```

### Ошибка `Can't reach database server at localhost:5432`

PostgreSQL не запущен. Решение:

1. Откройте **Docker Desktop** и дождитесь запуска демона.
2. Выполните `npm run db:up` (или `docker compose up -d db`).
3. Повторите `npx prisma db push` и `npm run db:seed`, если нужно отдельно.

Сайт: http://localhost:3000

### Учётные записи после seed

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | admin@inkstudio.ru | admin123 |
| Manager | manager@inkstudio.ru | manager123 |

## Production

```bash
docker compose up --build
```

Приложение: http://localhost:3000  
PostgreSQL: localhost:5433 (порт 5433, чтобы не конфликтовать с другими проектами на 5432)

## Для новичков

Подробный путеводитель по папкам, страницам и сценариям (отзывы, запись, картинки): **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)**.

## Структура

- `src/app/(site)` — публичные страницы
- `src/app/admin` — админ-панель (ADMIN / MANAGER)
- `src/actions` — Server Actions
- `src/services` — бизнес-логика
- `src/widgets`, `src/features` — UI по FSD
- `prisma` — схема БД и seed

## Переменные окружения

См. `.env.example` — UploadThing, Resend, Telegram, GA.

## Страницы

- `/` — главная
- `/eskizy` — каталог
- `/zapis` — запись
- `/o-nas` — о студии
- `/galereya`, `/kontakty`, `/blog`
- `/master/[slug]` — мастер
- `/vhod`, `/registraciya`, `/kabinet`
- `/admin` — CMS
