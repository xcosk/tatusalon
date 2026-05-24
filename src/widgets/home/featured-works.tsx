import Image from "next/image";
import Link from "next/link";
import { getFeaturedWorks } from "@/services/works";
import { formatPrice } from "@/lib/utils";
import { SectionLabel } from "@/components/shared/section-label";

export async function FeaturedWorksSection() {
  const works = await getFeaturedWorks(4);

  return (
    <section className="container-site py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <SectionLabel>— Работы</SectionLabel>
          <h2 className="mt-4 font-display text-5xl">Популярные эскизы</h2>
        </div>
        <Link
          href="/eskizy"
          className="text-xs uppercase tracking-[0.2em] text-muted hover:text-black"
        >
          Все эскизы →
        </Link>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {works.map((work, i) => (
          <Link key={work.id} href={`/eskizy?work=${work.slug}`} className="group">
            <div className="relative aspect-[3/4] bg-surface overflow-hidden">
              <Image
                src={work.imageUrl}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <span className="absolute left-3 top-3 bg-white px-2 py-1 font-display text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 font-bold">{work.title}</h3>
            <p className="text-xs uppercase tracking-[0.1em] text-muted">{work.style}</p>
            {work.priceFrom && (
              <p className="mt-1 text-xs text-muted">от {formatPrice(work.priceFrom)}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
