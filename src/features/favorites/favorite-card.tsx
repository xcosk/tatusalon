"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleFavorite } from "@/actions/favorites";
import { formatPrice } from "@/lib/utils";
import type { TattooWork } from "@prisma/client";

export function FavoriteCard({ work }: { work: TattooWork }) {
  const router = useRouter();

  async function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const result = await toggleFavorite(work.id);
    if (result.success) {
      toast.success("Удалено из избранного");
      router.refresh();
    } else {
      toast.error(result.error ?? "Ошибка");
    }
  }

  return (
    <article className="group relative">
      <Link href={`/eskizy/${work.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-surface">
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
        <p className="mt-2 font-bold">{work.title}</p>
        {work.priceFrom && (
          <p className="text-xs text-muted">от {formatPrice(work.priceFrom)}</p>
        )}
      </Link>
      <button
        type="button"
        onClick={handleRemove}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center bg-white text-red-600 shadow-sm transition-colors hover:bg-red-50"
        aria-label="Удалить из избранного"
      >
        <Heart size={16} className="fill-red-600 text-red-600" />
      </button>
    </article>
  );
}
