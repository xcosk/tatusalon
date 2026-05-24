import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtistBySlug } from "@/services/artists";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return {};
  return { title: artist.name, description: artist.bio ?? undefined };
}

export default async function MasterPage({ params }: Props) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  return (
    <section className="container-site py-16 lg:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">Мастер</p>
      <h1 className="mt-4 font-display text-7xl">{artist.name}</h1>
      <p className="mt-2 text-xs uppercase tracking-[0.1em] text-muted">
        {artist.styles.join(" · ")}
      </p>
      {artist.bio && <p className="mt-8 max-w-2xl text-muted">{artist.bio}</p>}
      <Button asChild className="mt-8">
        <Link href={`/zapis?artist=${artist.slug}`}>Записаться к мастеру</Link>
      </Button>

      {artist.works.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-4xl">Портфолио</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artist.works.map((work) => (
              <Link key={work.id} href={`/eskizy/${work.slug}`}>
                <div className="relative aspect-[3/4] bg-surface">
                  <Image src={work.imageUrl} alt={work.title} fill className="object-cover" />
                </div>
                <p className="mt-2 font-bold">{work.title}</p>
                {work.priceFrom && (
                  <p className="text-xs text-muted">от {formatPrice(work.priceFrom)}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {artist.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-4xl">Отзывы</h2>
          <div className="mt-8 space-y-6">
            {artist.reviews.map((r) => (
              <blockquote key={r.id} className="border-t border-border pt-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted">
                  {r.rating}/5
                </p>
                <p className="mt-2 text-muted">&ldquo;{r.content}&rdquo;</p>
                <footer className="mt-2 text-sm font-bold">{r.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
