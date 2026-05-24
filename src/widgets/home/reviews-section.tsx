/**
 * Блок отзывов на главной странице.
 * Показываем только одобренные: isPublished === true (см. admin/reviews).
 */
import { prisma } from "@/lib/prisma";
import { SectionLabel } from "@/components/shared/section-label";

export async function ReviewsSection() {
  const reviews = await prisma.review.findMany({
    where: { isPublished: true, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (!reviews.length) return null;

  return (
    <section className="container-site py-24">
      <SectionLabel>— Отзывы</SectionLabel>
      <h2 className="mt-4 font-display text-5xl">Клиенты</h2>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {reviews.map((review) => (
          <blockquote
            key={review.id}
            className="border-t border-border pt-6"
          >
            <p className="text-xs uppercase tracking-[0.1em] text-muted">
              {review.rating}/5
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              &ldquo;{review.content}&rdquo;
            </p>
            <footer className="mt-4 text-sm font-bold">{review.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
