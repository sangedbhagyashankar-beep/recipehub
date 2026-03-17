import { useCallback, useState } from "react";

const STORAGE_KEY = "recipehub_shopping";

export function useShoppingList() {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addItems = useCallback((newItems: string[]) => {
    setItems((prev) => {
      const next = [...new Set([...prev, ...newItems])];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((item: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i !== item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearList = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setItems([]);
  }, []);

  return { items, addItems, removeItem, clearList };
}
