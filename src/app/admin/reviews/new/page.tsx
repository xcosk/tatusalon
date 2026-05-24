import Link from "next/link";
import { getActiveArtists } from "@/services/artists";
import { ReviewAdminForm } from "@/components/admin/review-admin-form";

export default async function AdminReviewNewPage() {
  const artists = await getActiveArtists();

  return (
    <div>
      <Link href="/admin/reviews" className="text-xs uppercase text-muted hover:text-black">
        ← К отзывам
      </Link>
      <h1 className="mt-4 font-display text-4xl">Новый отзыв</h1>
      <p className="mt-2 text-sm text-muted">
        Для отзывов от администратора можно сразу включить публикацию.
      </p>
      <div className="mt-8">
        <ReviewAdminForm artists={artists} />
      </div>
    </div>
  );
}
