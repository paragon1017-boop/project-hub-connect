import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type FavItem = {
  id: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  serving_size?: string;
  source?: string;
  addedAt?: string;
  // Vitamins
  vitaminA?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  vitaminC?: number;
  vitaminB1?: number;
  vitaminB2?: number;
  vitaminB3?: number;
  vitaminB6?: number;
  vitaminB9?: number;
  vitaminB12?: number;
  biotin?: number;
  pantothenicAcid?: number;
  // Minerals
  calcium?: number;
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  zinc?: number;
  copper?: number;
  selenium?: number;
  manganese?: number;
};

type ContextValue = {
  favorites: FavItem[];
  isFavorite: (id: string) => boolean;
  addFavorite: (item: FavItem) => void;
  removeFavorite: (id: string) => void;
  migrateFavorites: () => { migrated: number; total: number };
};

const KEY = "food_favorites";
const FavoritesContext = createContext<ContextValue | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? (JSON.parse(raw) as FavItem[]) : [];
      setFavorites(parsed);
    } catch {
      setFavorites([]);
    }
  }, []);

  const addFavorite = useCallback((item: FavItem) => {
    if (!item?.id) return;
    setFavorites((prev) => {
      if (prev.some((f) => f.id === item.id)) return prev;
      const normalized: FavItem = {
        id: item.id,
        name: item.name,
        calories: Number(item.calories ?? 0) || 0,
        protein: Number(item.protein ?? 0) || 0,
        carbs: Number(item.carbs ?? 0) || 0,
        fat: Number(item.fat ?? 0) || 0,
        fiber: Number(item.fiber ?? 0) || 0,
        sugar: Number(item.sugar ?? 0) || 0,
        sodium: Number(item.sodium ?? 0) || 0,
        serving_size: item.serving_size,
        source: item.source,
        addedAt: item.addedAt,
        // Vitamins
        vitaminA: Number(item.vitaminA ?? 0) || 0,
        vitaminD: Number(item.vitaminD ?? 0) || 0,
        vitaminE: Number(item.vitaminE ?? 0) || 0,
        vitaminK: Number(item.vitaminK ?? 0) || 0,
        vitaminC: Number(item.vitaminC ?? 0) || 0,
        vitaminB1: Number(item.vitaminB1 ?? 0) || 0,
        vitaminB2: Number(item.vitaminB2 ?? 0) || 0,
        vitaminB3: Number(item.vitaminB3 ?? 0) || 0,
        vitaminB6: Number(item.vitaminB6 ?? 0) || 0,
        vitaminB9: Number(item.vitaminB9 ?? 0) || 0,
        vitaminB12: Number(item.vitaminB12 ?? 0) || 0,
        biotin: Number(item.biotin ?? 0) || 0,
        pantothenicAcid: Number(item.pantothenicAcid ?? 0) || 0,
        // Minerals
        calcium: Number(item.calcium ?? 0) || 0,
        iron: Number(item.iron ?? 0) || 0,
        magnesium: Number(item.magnesium ?? 0) || 0,
        phosphorus: Number(item.phosphorus ?? 0) || 0,
        potassium: Number(item.potassium ?? 0) || 0,
        zinc: Number(item.zinc ?? 0) || 0,
        copper: Number(item.copper ?? 0) || 0,
        selenium: Number(item.selenium ?? 0) || 0,
        manganese: Number(item.manganese ?? 0) || 0,
      };
      const updated = [...prev, normalized];
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.some((f) => f.id === id), [favorites]);

  // Migrate missing nutrition fields in favorites (fiber, sugar, sodium)
  const migrateFavorites = (): { migrated: number; total: number } => {
    try {
      const raw = localStorage.getItem(KEY) ?? "[]";
      const list = JSON.parse(raw) as FavItem[];

      const migrated = list.map((f) => ({
        ...f,
        fiber: typeof (f as any).fiber === 'number' ? (f as any).fiber : 0,
        sugar: typeof (f as any).sugar === 'number' ? (f as any).sugar : 0,
        sodium: typeof (f as any).sodium === 'number' ? (f as any).sodium : 0,
      }));

      // choice: update localStorage and in-memory state
      localStorage.setItem(KEY, JSON.stringify(migrated));
      setFavorites(migrated);

      const changed = migrated.filter((m, idx) => {
        const old = list[idx] || {};
        return m.fiber !== (old as any).fiber || m.sugar !== (old as any).sugar || m.sodium !== (old as any).sodium;
      });

      return { migrated: changed.length, total: migrated.length };
    } catch {
      return { migrated: 0, total: favorites.length };
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, addFavorite, removeFavorite, migrateFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): ContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
};
