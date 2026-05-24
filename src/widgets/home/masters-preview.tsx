import Link from "next/link";
import { getActiveArtists } from "@/services/artists";
import { SectionLabel } from "@/components/shared/section-label";

export async function MastersPreviewSection() {
  const artists = await getActiveArtists();

  return (
    <section className="border-t border-border bg-surface/50 py-24">
      <div className="container-site">
        <SectionLabel>— Команда</SectionLabel>
        <h2 className="mt-4 font-display text-5xl">Мастера</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/master/${artist.slug}`}
              className="border-t border-black pt-4 transition-opacity hover:opacity-70"
            >
              <h3 className="font-bold">{artist.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.1em] text-muted">
                {artist.styles.join(", ")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
