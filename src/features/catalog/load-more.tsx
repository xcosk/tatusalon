"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkCard } from "./work-card";
import { useFavorites } from "@/features/favorites/favorites-provider";
import type { TattooWork, Category, TattooArtist } from "@prisma/client";

type WorkWithRelations = TattooWork & {
  category: Category | null;
  artist: TattooArtist | null;
};

export function LoadMoreWorks({
  initialPage,
  totalPages,
  categorySlug,
  search,
}: {
  initialPage: number;
  totalPages: number;
  categorySlug?: string;
  search?: string;
}) {
  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState<WorkWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const { setFavorited } = useFavorites();

  async function loadMore() {
    setLoading(true);
    const next = page + 1;
    const params = new URLSearchParams({
      page: String(next),
      ...(categorySlug ? { category: categorySlug } : {}),
      ...(search ? { q: search } : {}),
    });
    const res = await fetch(`/api/works?${params}`);
    const data = await res.json();
    if (data.favoriteWorkIds?.length) {
      for (const id of data.favoriteWorkIds as string[]) {
        setFavorited(id, true);
      }
    }
    setItems((prev) => [...prev, ...data.items]);
    setPage(next);
    setLoading(false);
  }

  if (page >= totalPages) {
    return items.length ? (
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((work, i) => (
          <WorkCard key={work.id} work={work} index={page * 12 + i} />
        ))}
      </div>
    ) : null;
  }

  return (
    <>
      {items.length > 0 && (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((work, i) => (
            <WorkCard key={work.id} work={work} index={page * 12 + i} />
          ))}
        </div>
      )}
      <div className="mt-12 text-center">
        <Button variant="outline" onClick={loadMore} disabled={loading}>
          {loading ? "Загрузка..." : "Показать ещё"}
        </Button>
      </div>
    </>
  );
}
