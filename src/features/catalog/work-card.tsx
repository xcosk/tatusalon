"use client";

import Image from "next/image";
import Link from "next/link";
import { FavoriteHeartButton } from "@/features/favorites/favorite-heart-button";
import { formatPrice } from "@/lib/utils";
import type { TattooWork, Category, TattooArtist } from "@prisma/client";

type WorkWithRelations = TattooWork & {
  category: Category | null;
  artist: TattooArtist | null;
};

export function WorkCard({
  work,
  index,
}: {
  work: WorkWithRelations;
  index: number;
}) {
  return (
    <article>
      <Link href={`/eskizy/${work.slug}`} className="group block">
        <div className="relative aspect-[3/4] bg-surface">
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <span className="absolute left-3 top-3 bg-white px-2 py-1 font-display text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          <FavoriteHeartButton
            workId={work.id}
            className="absolute right-3 top-3"
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold">{work.title}</h3>
            <p className="text-xs uppercase tracking-[0.1em] text-muted">{work.style}</p>
          </div>
          {work.priceFrom && (
            <p className="shrink-0 text-xs text-muted">от {formatPrice(work.priceFrom)}</p>
          )}
        </div>
        {work.description && (
          <p className="mt-2 text-sm text-muted">{work.description}</p>
        )}
      </Link>
    </article>
  );
}
