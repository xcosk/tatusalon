/**
 * Модерация отзывов: список, фильтры, кнопки «Опубликовать» / «Снять» / «Удалить».
 * Логика кнопок — actions/admin.ts (setReviewPublished, deleteReview).
 */
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { setReviewPublished, deleteReview } from "@/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter ?? "all";

  const reviews = await prisma.review.findMany({
    where: {
      deletedAt: null,
      ...(filter === "pending" ? { isPublished: false } : {}),
      ...(filter === "published" ? { isPublished: true } : {}),
    },
    include: { artist: true, user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = await prisma.review.count({
    where: { isPublished: false, deletedAt: null },
  });

  const filters = [
    { value: "all", label: "Все" },
    { value: "pending", label: `На проверке (${pendingCount})` },
    { value: "published", label: "Опубликованные" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Отзывы</h1>
          {pendingCount > 0 && (
            <p className="mt-2 text-sm text-amber-700">
              {pendingCount} отзыв(ов) ждут модерации
            </p>
          )}
        </div>
        <Button asChild>
          <Link href="/admin/reviews/new">Добавить вручную</Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.1em]">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/reviews" : `/admin/reviews?filter=${f.value}`}
            className={
              filter === f.value
                ? "border-b-2 border-black pb-1 text-black"
                : "text-muted hover:text-black"
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto">
        <DataTable
          headers={[
            "Автор",
            "Оценка",
            "Мастер",
            "Статус",
            "Дата",
            "Текст",
            "Действия",
          ]}
        >
          {reviews.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-center text-muted">
                Отзывов нет
              </td>
            </tr>
          ) : (
            reviews.map((r) => (
              <tr key={r.id} className="border-b border-border align-top">
                <td className="p-3">
                  <p className="font-medium">{r.author}</p>
                  {r.user?.email && (
                    <p className="text-xs text-muted">{r.user.email}</p>
                  )}
                </td>
                <td className="p-3">{r.rating}/5</td>
                <td className="p-3 text-sm">{r.artist?.name ?? "—"}</td>
                <td className="p-3">
                  <span
                    className={
                      r.isPublished
                        ? "text-green-700"
                        : "text-amber-700"
                    }
                  >
                    {r.isPublished ? "Опубликован" : "На проверке"}
                  </span>
                </td>
                <td className="p-3 text-sm text-muted whitespace-nowrap">
                  {formatDate(r.createdAt)}
                </td>
                <td className="p-3 max-w-xs text-sm text-muted">{r.content}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {!r.isPublished && (
                      <form
                        action={async () => {
                          "use server";
                          await setReviewPublished(r.id, true);
                        }}
                      >
                        <button
                          type="submit"
                          className="w-full border border-black px-3 py-1.5 text-xs uppercase hover:bg-black hover:text-white"
                        >
                          Опубликовать
                        </button>
                      </form>
                    )}
                    {r.isPublished && (
                      <form
                        action={async () => {
                          "use server";
                          await setReviewPublished(r.id, false);
                        }}
                      >
                        <button
                          type="submit"
                          className="w-full border border-border px-3 py-1.5 text-xs uppercase text-muted hover:text-black"
                        >
                          Снять
                        </button>
                      </form>
                    )}
                    <form
                      action={async () => {
                        "use server";
                        await deleteReview(r.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="w-full text-xs uppercase text-red-600 underline"
                      >
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))
          )}
        </DataTable>
      </div>
    </div>
  );
}
