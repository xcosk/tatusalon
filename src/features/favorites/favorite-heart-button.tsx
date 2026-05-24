"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleFavorite } from "@/actions/favorites";
import { cn } from "@/lib/utils";
import { useFavorites } from "./favorites-provider";

type Props = {
  workId: string;
  className?: string;
  size?: number;
};

export function FavoriteHeartButton({ workId, className, size = 16 }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isFavorited, setFavorited } = useFavorites();
  const favorited = isFavorited(workId);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Войдите, чтобы добавить в избранное");
      return;
    }

    const next = !favorited;
    setFavorited(workId, next);

    const result = await toggleFavorite(workId);
    if (!result.success) {
      setFavorited(workId, favorited);
      toast.error(result.error ?? "Ошибка");
      return;
    }

    setFavorited(workId, result.favorited ?? next);
    toast.success(
      result.favorited ? "Добавлено в избранное" : "Удалено из избранного",
    );
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center bg-white transition-colors",
        favorited
          ? "text-red-600 hover:bg-red-50"
          : "text-black hover:bg-black hover:text-white",
        className,
      )}
      aria-label={favorited ? "Убрать из избранного" : "В избранное"}
      aria-pressed={favorited}
    >
      <Heart
        size={size}
        className={cn(favorited && "fill-red-600 text-red-600")}
      />
    </button>
  );
}
