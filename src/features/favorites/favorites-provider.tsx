/**
 * Контекст избранного для каталога /eskizy:
 * хранит Set id эскизов, чтобы сердечко было залитым без перезагрузки страницы.
 */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type FavoritesContextValue = {
  favoriteIds: Set<string>;
  isFavorited: (workId: string) => boolean;
  setFavorited: (workId: string, favorited: boolean) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({
  initialIds,
  children,
}: {
  initialIds: string[];
  children: React.ReactNode;
}) {
  const [favoriteIds, setFavoriteIds] = useState(() => new Set(initialIds));

  const setFavorited = useCallback((workId: string, favorited: boolean) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (favorited) next.add(workId);
      else next.delete(workId);
      return next;
    });
  }, []);

  const isFavorited = useCallback(
    (workId: string) => favoriteIds.has(workId),
    [favoriteIds],
  );

  const value = useMemo(
    () => ({ favoriteIds, isFavorited, setFavorited }),
    [favoriteIds, isFavorited, setFavorited],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    return {
      favoriteIds: new Set<string>(),
      isFavorited: () => false,
      setFavorited: () => undefined,
    };
  }
  return ctx;
}
