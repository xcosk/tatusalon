/**
 * ЛИЧНЫЙ КАБИНЕТ (/kabinet) — только для вошедших (см. middleware.ts).
 * Показывает: записи, свои отзывы со статусом, форму нового отзыва, избранное, кнопку выхода.
 */
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { FavoriteCard } from "@/features/favorites/favorite-card";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { ReviewForm } from "@/features/reviews/review-form";
import { getActiveArtists } from "@/services/artists";

export const metadata = { title: "Личный кабинет" };

export default async function CabinetPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const userEmail = session.user.email ?? "";

  const [bookings, favorites, userReviews, artists] = await Promise.all([
    prisma.booking.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          ...(userEmail
            ? [{ clientEmail: { equals: userEmail, mode: "insensitive" as const } }]
            : []),
        ],
      },
      include: { artist: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: { work: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      where: { userId: session.user.id, deletedAt: null },
      include: { artist: true },
      orderBy: { createdAt: "desc" },
    }),
    getActiveArtists(),
  ]);

  return (
    <section className="container-site py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">Кабинет</h1>
          <p className="mt-2 text-muted">
            Привет, {session.user.name ?? session.user.email}
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-16">
        <h2 className="font-display text-3xl">Мои записи</h2>
        {bookings.length === 0 ? (
          <p className="mt-4 text-muted">
            Записей пока нет.{" "}
            <Link href="/zapis" className="underline text-black">
              Записаться
            </Link>
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border">
            {bookings.map((b) => (
              <li key={b.id} className="py-4 flex justify-between gap-4 border-b border-border last:border-0">
                <div>
                  <p className="font-bold">
                    {formatDate(b.date)}
                    {b.timeSlot !== "Уточнить" ? ` — ${b.timeSlot}` : ""}
                  </p>
                  <p className="text-sm text-muted">
                    {b.artist?.name ?? "Мастер уточняется"} · {b.status}
                  </p>
                  {b.idea && (
                    <p className="mt-2 text-sm text-muted">&ldquo;{b.idea}&rdquo;</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-16">
        <h2 className="font-display text-3xl">Мои отзывы</h2>
        {userReviews.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Вы ещё не оставляли отзывов.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {userReviews.map((r) => (
              <li key={r.id} className="border-t border-border pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.1em] text-muted">
                    {r.rating}/5
                    {r.artist ? ` · ${r.artist.name}` : ""}
                  </p>
                  <span
                    className={
                      r.isPublished
                        ? "text-xs uppercase text-green-700"
                        : "text-xs uppercase text-amber-700"
                    }
                  >
                    {r.isPublished ? "Опубликован" : "На проверке"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">&ldquo;{r.content}&rdquo;</p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10">
          <h3 className="font-display text-2xl">Оставить отзыв</h3>
          <p className="mt-2 text-sm text-muted">
            Отзыв появится на сайте после одобрения администратором.
          </p>
          <div className="mt-6">
            <ReviewForm artists={artists} />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-3xl">Избранное</h2>
        {favorites.length === 0 ? (
          <p className="mt-4 text-muted">
            <Link href="/eskizy" className="underline text-black">
              Смотреть эскизы
            </Link>
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((f) => (
              <FavoriteCard key={f.id} work={f.work} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
