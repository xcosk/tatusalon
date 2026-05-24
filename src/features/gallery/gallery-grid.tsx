"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { GalleryItem, Category } from "@prisma/client";

type Item = GalleryItem & { category: Category | null };

export function GalleryGrid({
  items,
  categories,
}: {
  items: Item[];
  categories: Category[];
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Item | null>(null);

  const filtered = filter
    ? items.filter((i) => i.category?.slug === filter)
    : items;

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`px-3 py-1 text-xs uppercase tracking-[0.1em] ${!filter ? "bg-black text-white" : "text-muted"}`}
        >
          Все
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.slug)}
            className={`px-3 py-1 text-xs uppercase tracking-[0.1em] ${
              filter === c.slug ? "bg-black text-white" : "text-muted"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setLightbox(item)}
            className="mb-4 block w-full break-inside-avoid"
          >
            <div className="relative w-full" style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/3" }}>
              <Image
                src={item.imageUrl}
                alt={item.title ?? "Галерея"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 text-white"
              onClick={() => setLightbox(null)}
              aria-label="Закрыть"
            >
              <X size={32} />
            </button>
            <div className="relative max-h-[90vh] max-w-5xl w-full aspect-[3/4]">
              <Image
                src={lightbox.imageUrl}
                alt={lightbox.title ?? ""}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
