/**
 * Блок «Оставить отзыв» на странице /o-nas.
 * Сам решает: показать форму (если вошёл) или просьбу войти.
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getActiveArtists } from "@/services/artists";
import { ReviewForm, ReviewFormGuestPrompt } from "@/features/reviews/review-form";

export async function ReviewSection() {
  const [session, artists] = await Promise.all([
    getServerSession(authOptions),
    getActiveArtists(),
  ]);

  return (
    <section className="container-site border-t border-border py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">— Отзывы</p>
      <h2 className="mt-4 font-display text-5xl">Поделитесь опытом</h2>
      <p className="mt-4 max-w-xl text-sm text-muted">
        Отзыв уходит на модерацию. Мы публикуем только честные тексты без спама
        и оскорблений.
      </p>
      <div className="mt-10">
        {session?.user ? (
          <ReviewForm artists={artists} />
        ) : (
          <ReviewFormGuestPrompt />
        )}
      </div>
    </section>
  );
}
