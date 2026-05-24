"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import type { Category } from "@prisma/client";

export function CatalogFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      startTransition(() => {
        router.push(`/eskizy?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-center ${pending ? "opacity-60" : ""}`}>
      <Input
        placeholder="Поиск..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
        className="max-w-xs"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update("category", "")}
          className={`px-3 py-1 text-xs uppercase tracking-[0.1em] ${
            !searchParams.get("category") ? "bg-black text-white" : "text-muted"
          }`}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => update("category", cat.slug)}
            className={`px-3 py-1 text-xs uppercase tracking-[0.1em] ${
              searchParams.get("category") === cat.slug
                ? "bg-black text-white"
                : "text-muted"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
