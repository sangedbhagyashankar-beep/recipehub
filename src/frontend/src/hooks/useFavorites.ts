import { useCallback, useState } from "react";

const STORAGE_KEY = "recipehub_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<bigint[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed: string[] = JSON.parse(stored);
      return parsed.map((s) => BigInt(s));
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((id: bigint) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f === id);
      const next = exists ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next.map((f) => f.toString())),
      );
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: bigint) => favorites.some((f) => f === id),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
}
