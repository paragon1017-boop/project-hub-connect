import { Trash2, Pencil, Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";

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

interface FoodLogItemProps {
  item: FoodLogItem;
  onDelete: (id: string) => void;
  onEdit: (item: FoodLogItem) => void;
}

export default function FoodLogItem({ item, onDelete, onEdit }: FoodLogItemProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(item.id);
  const toggleFavorite = () => {
    const id = item.id;
    const fav = {
      id,
      name: item.food_name,
      calories: item.calories,
      serving_size: item.serving_size,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
      sugar: item.sugar,
      sodium: item.sodium,
      addedAt: new Date().toISOString(),
    } as any;
    if (favorited) removeFavorite(id);
    else addFavorite(fav);
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.food_name}</p>
        <p className="text-xs text-muted-foreground">
          {item.serving_size && `${item.serving_size} · `}
          {item.quantity !== 1 ? `×${Number(item.quantity.toFixed(2))} · ` : ""}
          {Math.round(item.calories * item.quantity)} kcal
        </p>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
        <span>P {Math.round(item.protein * item.quantity)}g</span>
        <span>C {Math.round(item.carbs * item.quantity)}g</span>
        <span>F {Math.round(item.fat * item.quantity)}g</span>
      </div>
      <Button variant="outline" size="sm" className="shrink-0" onClick={() => onEdit(item)}>
        <Pencil className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={toggleFavorite} aria-label="toggle-favorite">
        <Heart className={`h-4 w-4 ${favorited ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onDelete(item.id)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
