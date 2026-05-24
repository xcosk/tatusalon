import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getWorkBySlug } from "@/services/works";
import { getFavoriteWorkIds } from "@/services/favorites";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FavoritesProvider } from "@/features/favorites/favorites-provider";
import { FavoriteHeartButton } from "@/features/favorites/favorite-heart-button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.description ?? undefined,
    openGraph: { images: [work.imageUrl] },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const session = await getServerSession(authOptions);
  const favoriteIds =
    session?.user?.id ? await getFavoriteWorkIds(session.user.id) : [];

  return (
    <FavoritesProvider initialIds={favoriteIds}>
      <section className="container-site py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-[3/4] bg-surface">
            <Image
              src={work.imageUrl}
              alt={work.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <FavoriteHeartButton
              workId={work.id}
              className="absolute right-4 top-4 h-10 w-10"
              size={18}
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{work.style}</p>
            <h1 className="mt-4 font-display text-6xl">{work.title}</h1>
            {work.priceFrom && (
              <p className="mt-4 text-lg">от {formatPrice(work.priceFrom)}</p>
            )}
            {work.description && (
              <p className="mt-6 text-muted">{work.description}</p>
            )}
            {work.artist && (
              <p className="mt-4 text-sm">
                Мастер:{" "}
                <Link href={`/master/${work.artist.slug}`} className="underline">
                  {work.artist.name}
                </Link>
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild>
                <Link href={`/zapis?artist=${work.artist?.slug ?? ""}`}>Записаться</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/eskizy">← Каталог</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </FavoritesProvider>
  );
}
