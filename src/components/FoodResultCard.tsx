import { Plus, Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";

export interface FoodProduct {
  code?: string;
  product_name: string;
  brands?: string;
  serving_size?: string;
  nutriments: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    sodium_100g?: number;
    // Vitamins
    "vitamin-a_100g"?: number;
    "vitamin-d_100g"?: number;
    "vitamin-e_100g"?: number;
    "vitamin-k_100g"?: number;
    "vitamin-c_100g"?: number;
    "vitamin-b1_100g"?: number;
    "vitamin-b2_100g"?: number;
    "vitamin-b3_100g"?: number;
    "vitamin-b6_100g"?: number;
    "vitamin-b9_100g"?: number;
    "vitamin-b12_100g"?: number;
    biotin_100g?: number;
    "pantothenic-acid_100g"?: number;
    // Minerals
    calcium_100g?: number;
    iron_100g?: number;
    magnesium_100g?: number;
    phosphorus_100g?: number;
    potassium_100g?: number;
    zinc_100g?: number;
    copper_100g?: number;
    selenium_100g?: number;
    manganese_100g?: number;
  };
  image_url?: string;
}

interface FoodResultCardProps {
  product: FoodProduct;
  onAdd: (product: FoodProduct) => void;
}

export default function FoodResultCard({ product, onAdd }: FoodResultCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const itemId = product.code ?? product.product_name;
  const favorited = isFavorite(itemId);
  const toggleFavorite = () => {
    console.log("FoodResultCard - Product:", product);
    console.log("FoodResultCard - Nutriments:", product.nutriments);
    const fav = {
      id: itemId,
      name: product.product_name,
      calories: product.nutriments?.["energy-kcal_100g"] ?? 0,
      serving_size: product.serving_size,
      protein: product.nutriments?.proteins_100g ?? 0,
      carbs: product.nutriments?.carbohydrates_100g ?? 0,
      fat: product.nutriments?.fat_100g ?? 0,
      fiber: product.nutriments?.fiber_100g ?? 0,
      sugar: product.nutriments?.sugars_100g ?? 0,
      sodium: product.nutriments?.sodium_100g ?? 0,
      addedAt: new Date().toISOString(),
    };
    console.log("FoodResultCard - Saving favorite:", fav);
    if (favorited) removeFavorite(itemId);
    else addFavorite(fav);
  };
  const n = product.nutriments;
  // Determine if extended vitamins/minerals data exist
  const extendedKeys = [
    "vitamin-a_100g","vitamin-d_100g","vitamin-e_100g","vitamin-k_100g","vitamin-c_100g",
    "vitamin-b1_100g","vitamin-b2_100g","vitamin-b3_100g","vitamin-b6_100g","vitamin-b9_100g",
    "vitamin-b12_100g","biotin_100g","pantothenic-acid_100g",
    "calcium_100g","iron_100g","magnesium_100g","phosphorus_100g","potassium_100g","zinc_100g",
    "copper_100g","selenium_100g","manganese_100g"
  ];
  const hasExtended = extendedKeys.some((k) => (n?.[k as any] ?? 0) > 0);
  // Build tooltip text listing extended nutrients present
  const vitaminLabelMap: Record<string, string> = {
    "vitamin-a_100g": "Vitamin A",
    "vitamin-d_100g": "Vitamin D",
    "vitamin-e_100g": "Vitamin E",
    "vitamin-k_100g": "Vitamin K",
    "vitamin-c_100g": "Vitamin C",
    "vitamin-b1_100g": "Vitamin B1",
    "vitamin-b2_100g": "Vitamin B2",
    "vitamin-b3_100g": "Vitamin B3",
    "vitamin-b6_100g": "Vitamin B6",
    "vitamin-b9_100g": "Vitamin B9",
    "vitamin-b12_100g": "Vitamin B12",
    "biotin_100g": "Biotin",
    "pantothenic-acid_100g": "Pantothenic Acid",
    "calcium_100g": "Calcium",
    "iron_100g": "Iron",
    "magnesium_100g": "Magnesium",
    "phosphorus_100g": "Phosphorus",
    "potassium_100g": "Potassium",
    "zinc_100g": "Zinc",
    "copper_100g": "Copper",
    "selenium_100g": "Selenium",
    "manganese_100g": "Manganese",
  }
  const presentList = extendedKeys
    .filter((k) => (n?.[k as any] ?? 0) > 0)
    .map((k) => vitaminLabelMap[k] ?? k);
  const extTooltip = presentList.length ? `Includes: ${presentList.join(', ')}` : 'Extended nutrition data';
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      {product.image_url && (
        <img src={product.image_url} alt="" className="h-12 w-12 rounded-md object-cover shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{product.product_name || "Unknown product"}</p>
        <p className="text-xs text-muted-foreground truncate">
          {product.brands && `${product.brands} · `}
          {Math.round(n["energy-kcal_100g"] || 0)} kcal/100g
        </p>
        <p className="text-xs text-muted-foreground">
          P {Math.round(n.proteins_100g || 0)}g · C {Math.round(n.carbohydrates_100g || 0)}g · F {Math.round(n.fat_100g || 0)}g
        </p>
      </div>
      <Button size="icon" className="h-9 w-9 shrink-0" onClick={toggleFavorite} aria-label="toggle-favorite">
        <Heart className={`h-4 w-4 ${favorited ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
      </Button>
      {/* Hidden Ext badge - {hasExtended && (
        <span className="ml-2 text-xs text-emerald-700" title={extTooltip}>Ext</span>
      )} */}
      <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => onAdd(product)}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
