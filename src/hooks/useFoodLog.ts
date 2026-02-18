import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import type { FoodProduct } from "@/components/FoodResultCard";

interface FoodLogItem {
  id: string;
  user_id: string;
  logged_date: string;
  food_name: string;
  barcode?: string;
  serving_size: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  created_at: string;
}

const getLocalFoodLog = (userId: string, dateStr: string): FoodLogItem[] => {
  const key = `food_log_${userId}_${dateStr}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveLocalFoodLog = (userId: string, dateStr: string, items: FoodLogItem[]) => {
  const key = `food_log_${userId}_${dateStr}`;
  localStorage.setItem(key, JSON.stringify(items));
};

export function useFoodLog(date?: Date) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dateStr = format(date || new Date(), "yyyy-MM-dd");
  const isAdminBypass = user?.id === "admin-bypass-id";

  const { data: foodLog = [], isLoading } = useQuery({
    queryKey: ["food_log", dateStr, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      if (isAdminBypass) {
        return getLocalFoodLog(user.id, dateStr);
      }
      
      const { data, error } = await supabase
        .from("food_log")
        .select("*")
        .eq("user_id", user.id)
        .eq("logged_date", dateStr)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addFood = useMutation({
    mutationFn: async (product: FoodProduct & { quantity?: number }) => {
      if (!user) throw new Error("Not authenticated");
      const n = product.nutriments;
      const qty = product.quantity || 1;
      
      if (isAdminBypass) {
        const existing = getLocalFoodLog(user.id, dateStr);
        const newItem: FoodLogItem = {
          id: crypto.randomUUID(),
          user_id: user.id,
          logged_date: dateStr,
          food_name: product.product_name || "Unknown",
          barcode: product.code || null,
          serving_size: product.serving_size || "100g",
          quantity: qty,
          calories: n["energy-kcal_100g"] || 0,
          protein: n.proteins_100g || 0,
          carbs: n.carbohydrates_100g || 0,
          fat: n.fat_100g || 0,
          fiber: n.fiber_100g || 0,
          sugar: n.sugars_100g || 0,
          sodium: n.sodium_100g || 0,
          created_at: new Date().toISOString(),
        };
        saveLocalFoodLog(user.id, dateStr, [newItem, ...existing]);
        return;
      }
      
      const { error } = await supabase.from("food_log").insert({
        user_id: user.id,
        logged_date: dateStr,
        food_name: product.product_name || "Unknown",
        barcode: product.code || null,
        serving_size: product.serving_size || "100g",
        quantity: qty,
        calories: n["energy-kcal_100g"] || 0,
        protein: n.proteins_100g || 0,
        carbs: n.carbohydrates_100g || 0,
        fat: n.fat_100g || 0,
        fiber: n.fiber_100g || 0,
        sugar: n.sugars_100g || 0,
        sodium: n.sodium_100g || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food_log"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const deleteFood = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      
      if (isAdminBypass) {
        const existing = getLocalFoodLog(user.id, dateStr);
        const filtered = existing.filter(item => item.id !== id);
        saveLocalFoodLog(user.id, dateStr, filtered);
        return;
      }
      
      const { error } = await supabase.from("food_log").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food_log"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const updateFood = useMutation({
    mutationFn: async (item: FoodLogItem) => {
      if (!user) throw new Error("Not authenticated");
      
      if (isAdminBypass) {
        const existing = getLocalFoodLog(user.id, dateStr);
        const updated = existing.map(i => i.id === item.id ? item : i);
        saveLocalFoodLog(user.id, dateStr, updated);
        return;
      }
      
      const { error } = await supabase
        .from("food_log")
        .update({
          food_name: item.food_name,
          serving_size: item.serving_size,
          quantity: item.quantity,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.fiber,
          sugar: item.sugar,
          sodium: item.sodium,
        })
        .eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food_log"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const totals = foodLog.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories * item.quantity,
      protein: acc.protein + item.protein * item.quantity,
      carbs: acc.carbs + item.carbs * item.quantity,
      fat: acc.fat + item.fat * item.quantity,
      fiber: acc.fiber + item.fiber * item.quantity,
      sugar: acc.sugar + item.sugar * item.quantity,
      sodium: acc.sodium + item.sodium * item.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
  );

  return { foodLog, isLoading, addFood, deleteFood, updateFood, totals };
}
