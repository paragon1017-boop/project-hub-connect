import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Plus, Database, Save, Trash2, Edit, Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import FoodResultCard, { FoodProduct } from "@/components/FoodResultCard";
import { useFoodLog } from "@/hooks/useFoodLog";
import { useToast } from "@/hooks/use-toast";
import { searchBrandedFoods } from "@/services/foodDatabase";
import { useAuth } from "@/contexts/AuthContext";
import VitaminsMineralsCard from "@/components/VitaminsMineralsCard";

export interface CustomFood {
  id: string;
  product_name: string;
  serving_size: string;
  nutriments: {
    "energy-kcal_100g": number;
    proteins_100g: number;
    carbohydrates_100g: number;
    fat_100g: number;
    fiber_100g: number;
    sugars_100g: number;
    sodium_100g: number;
  };
  created_at: string;
}

const CUSTOM_FOODS_KEY = "custom_foods_database";

export default function FoodSearch() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchingLocal, setSearchingLocal] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [showCustomFoods, setShowCustomFoods] = useState(false);
  const [editingCustomFood, setEditingCustomFood] = useState<CustomFood | null>(null);
  const [editingSearchResult, setEditingSearchResult] = useState<FoodProduct | null>(null);
  const [editSearchDialogOpen, setEditSearchDialogOpen] = useState(false);
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
  const [customFood, setCustomFood] = useState<{
    product_name: string;
    serving_size: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
  }>({
    product_name: "",
    serving_size: "100g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
  });
  const { addFood } = useFoodLog();
  const { toast } = useToast();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Load custom foods from localStorage
  useEffect(() => {
    if (!user) return;
    const key = `${CUSTOM_FOODS_KEY}_${user.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setCustomFoods(JSON.parse(stored));
      } catch {
        setCustomFoods([]);
      }
    }
  }, [user]);

  // Save custom foods to localStorage
  const saveCustomFoodsToStorage = (foods: CustomFood[]) => {
    if (!user) return;
    const key = `${CUSTOM_FOODS_KEY}_${user.id}`;
    localStorage.setItem(key, JSON.stringify(foods));
    setCustomFoods(foods);
  };

  const searchUSDA = async (query: string): Promise<FoodProduct[]> => {
    const apiKey = import.meta.env.VITE_USDA_API_KEY;
    if (!apiKey || apiKey === "YOUR_USDA_API_KEY_HERE") {
      return []; // Skip USDA if no API key
    }
    
    try {
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${apiKey}`
      );
      const data = await res.json();
      
      interface USDANutrient {
        nutrientName?: string;
        value?: number;
      }
      
      interface USDAFood {
        fdcId: number;
        description: string;
        brandName?: string;
        servingSize?: number;
        servingSizeUnit?: string;
        foodNutrients?: USDANutrient[];
      }
      
      return (data.foods || []).map((food: USDAFood) => {
        const nutrients: Record<string, number> = {};
        food.foodNutrients?.forEach((n: USDANutrient) => {
          const name = n.nutrientName?.toLowerCase() || "";
          const value = n.value || 0;
          if (name.includes("energy") && name.includes("kcal")) nutrients["energy-kcal_100g"] = value;
          if (name.includes("protein")) nutrients.proteins_100g = value;
          if (name.includes("carbohydrate") && !name.includes("fiber")) nutrients.carbohydrates_100g = value;
          if (name.includes("fat") && !name.includes("saturated") && !name.includes("trans")) nutrients.fat_100g = value;
          if (name.includes("fiber")) nutrients.fiber_100g = value;
          if (name.includes("sugar")) nutrients.sugars_100g = value;
          if (name.includes("sodium")) nutrients.sodium_100g = value;
        });
        
        return {
          code: `usda-${food.fdcId}`,
          product_name: food.description,
          brands: food.brandName || "USDA",
          serving_size: food.servingSize ? `${food.servingSize}${food.servingSizeUnit || 'g'}` : "100g",
          nutriments: nutrients,
          image_url: undefined,
        };
      });
    } catch {
      return [];
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    
    try {
      // Search all sources in parallel
      const [openFoodRes, usdaResults, localResults] = await Promise.all([
        fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=15`),
        searchUSDA(query),
        (async () => {
          setSearchingLocal(true);
          const foods = await searchBrandedFoods(query, 50);
          setSearchingLocal(false);
          return foods.map(food => ({
            code: `local-${food.id}`,
            product_name: food.name,
            brands: food.brand,
            serving_size: food.servingSize,
            nutriments: {
              "energy-kcal_100g": food.calories,
              proteins_100g: food.protein,
              carbohydrates_100g: food.carbs,
              fat_100g: food.fat,
              fiber_100g: food.fiber,
              sugars_100g: food.sugar,
              sodium_100g: food.sodium,
            },
            image_url: undefined,
          }));
        })()
      ]);
      
      const openFoodData = await openFoodRes.json();
      
      interface OpenFoodProduct {
        code: string;
        product_name: string;
        brands?: string;
        serving_size?: string;
        nutriments?: Record<string, number>;
        image_small_url?: string;
      }
      
      const openFoodProducts: FoodProduct[] = (openFoodData.products || [])
        .filter((p: OpenFoodProduct) => p.product_name)
        .map((p: OpenFoodProduct) => ({
          code: p.code,
          product_name: p.product_name,
          brands: p.brands,
          serving_size: p.serving_size,
          nutriments: p.nutriments || {},
          image_url: p.image_small_url,
        }));
      
      // Combine and deduplicate results
      // Prioritize local results first (offline database)
      const combined = [...localResults, ...usdaResults, ...openFoodProducts];
      const seen = new Set();
      const unique = combined.filter(item => {
        const key = item.product_name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      
      setResults(unique.slice(0, 30));
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Search failed." });
    }
    setLoading(false);
  };

  const handleAdd = (product: FoodProduct) => {
    addFood.mutate(product, {
      onSuccess: () => toast({ title: "Added!", description: `${product.product_name} added to your log.` }),
    });
  };

  const openEditSearchResult = (product: FoodProduct) => {
    setEditingSearchResult(product);
    setCustomFood({
      product_name: product.product_name,
      serving_size: product.serving_size || "100g",
      calories: String(product.nutriments?.["energy-kcal_100g"] || ""),
      protein: String(product.nutriments?.proteins_100g || ""),
      carbs: String(product.nutriments?.carbohydrates_100g || ""),
      fat: String(product.nutriments?.fat_100g || ""),
      fiber: String(product.nutriments?.fiber_100g || ""),
      sugar: String(product.nutriments?.sugars_100g || ""),
      sodium: String(product.nutriments?.sodium_100g || ""),
    });
    setEditSearchDialogOpen(true);
  };

  const handleSaveEditedSearchResult = () => {
    if (!editingSearchResult) return;
    
    const newCustomFood: CustomFood = {
      id: crypto.randomUUID(),
      product_name: customFood.product_name,
      serving_size: customFood.serving_size || "100g",
      nutriments: {
        "energy-kcal_100g": Number(customFood.calories) || 0,
        proteins_100g: Number(customFood.protein) || 0,
        carbohydrates_100g: Number(customFood.carbs) || 0,
        fat_100g: Number(customFood.fat) || 0,
        fiber_100g: Number(customFood.fiber) || 0,
        sugars_100g: Number(customFood.sugar) || 0,
        sodium_100g: Number(customFood.sodium) || 0,
      },
      created_at: new Date().toISOString(),
    };
    
    const updated = [newCustomFood, ...customFoods];
    saveCustomFoodsToStorage(updated);
    toast({ title: "Saved!", description: `${customFood.product_name} saved to your custom database with corrected values.` });
    setEditSearchDialogOpen(false);
    setEditingSearchResult(null);
  };

  const handleAddCustomFood = () => {
    if (!customFood.product_name.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a food name." });
      return;
    }

    const product: FoodProduct & { quantity?: number } = {
      product_name: customFood.product_name,
      quantity: 1,
      serving_size: customFood.serving_size,
      nutriments: {
        "energy-kcal_100g": Number(customFood.calories) || 0,
        proteins_100g: Number(customFood.protein) || 0,
        carbohydrates_100g: Number(customFood.carbs) || 0,
        fat_100g: Number(customFood.fat) || 0,
        fiber_100g: Number(customFood.fiber) || 0,
        sugars_100g: Number(customFood.sugar) || 0,
        sodium_100g: Number(customFood.sodium) || 0,
      },
    };

    addFood.mutate(product, {
      onSuccess: () => {
        toast({ title: "Added!", description: `${customFood.product_name} added to your log.` });
        setCustomDialogOpen(false);
        setCustomFood({
          product_name: "",
          serving_size: "100g",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          fiber: "",
          sugar: "",
          sodium: "",
        });
      },
      onError: (error) => {
        toast({ variant: "destructive", title: "Error", description: error.message || "Failed to add food." });
      },
    });
  };

  const handleSaveCustomToDatabase = () => {
    if (!customFood.product_name.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a food name." });
      return;
    }

    const newCustomFood: CustomFood = {
      id: crypto.randomUUID(),
      product_name: customFood.product_name,
      serving_size: customFood.serving_size || "100g",
      nutriments: {
        "energy-kcal_100g": Number(customFood.calories) || 0,
        proteins_100g: Number(customFood.protein) || 0,
        carbohydrates_100g: Number(customFood.carbs) || 0,
        fat_100g: Number(customFood.fat) || 0,
        fiber_100g: Number(customFood.fiber) || 0,
        sugars_100g: Number(customFood.sugar) || 0,
        sodium_100g: Number(customFood.sodium) || 0,
      },
      created_at: new Date().toISOString(),
    };

    const updated = [newCustomFood, ...customFoods];
    saveCustomFoodsToStorage(updated);
    toast({ title: "Saved!", description: `${customFood.product_name} saved to your custom database.` });
    
    // Also add to log
    handleAddCustomFood();
  };

  const handleDeleteCustomFood = (id: string) => {
    const updated = customFoods.filter(f => f.id !== id);
    saveCustomFoodsToStorage(updated);
    toast({ title: "Deleted", description: "Food removed from your custom database." });
  };

  const handleEditCustomFood = (food: CustomFood) => {
    setEditingCustomFood(food);
    setCustomFood({
      product_name: food.product_name,
      serving_size: food.serving_size,
      calories: String(food.nutriments["energy-kcal_100g"]),
      protein: String(food.nutriments.proteins_100g),
      carbs: String(food.nutriments.carbohydrates_100g),
      fat: String(food.nutriments.fat_100g),
      fiber: String(food.nutriments.fiber_100g),
      sugar: String(food.nutriments.sugars_100g),
      sodium: String(food.nutriments.sodium_100g),
    });
    setEditSearchDialogOpen(true);
  };

  const handleUpdateCustomFood = () => {
    if (!editingCustomFood) return;
    
    const updatedFood: CustomFood = {
      ...editingCustomFood,
      product_name: customFood.product_name,
      serving_size: customFood.serving_size,
      nutriments: {
        "energy-kcal_100g": Number(customFood.calories) || 0,
        proteins_100g: Number(customFood.protein) || 0,
        carbohydrates_100g: Number(customFood.carbs) || 0,
        fat_100g: Number(customFood.fat) || 0,
        fiber_100g: Number(customFood.fiber) || 0,
        sugars_100g: Number(customFood.sugar) || 0,
        sodium_100g: Number(customFood.sodium) || 0,
      },
    };
    
    const updated = customFoods.map(f => f.id === editingCustomFood.id ? updatedFood : f);
    saveCustomFoodsToStorage(updated);
    toast({ title: "Updated!", description: `${customFood.product_name} has been updated.` });
    setEditSearchDialogOpen(false);
    setEditingCustomFood(null);
  };

  const handleAddFromCustomDatabase = (food: CustomFood) => {
    const product: FoodProduct = {
      product_name: food.product_name,
      serving_size: food.serving_size,
      nutriments: food.nutriments,
    };
    handleAdd(product);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <header className="mb-6 flex items-center gap-2">
        <Search className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-display">Food Search</h1>
      </header>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          placeholder="Search foods..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button 
          variant="outline" 
          onClick={() => setCustomDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Food
        </Button>
        <Button 
          variant={showCustomFoods ? "default" : "outline"}
          onClick={() => setShowCustomFoods(!showCustomFoods)}
        >
          <Database className="h-4 w-4 mr-2" />
          My Foods ({customFoods.length})
        </Button>
      </div>

      {/* Offline Database Badge */}
      {searchingLocal && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 p-2 bg-muted rounded">
          <Database className="h-3 w-3" />
          <span>Searching offline branded foods database...</span>
        </div>
      )}

      {results.length === 0 && !loading && !showCustomFoods && (
        <p className="text-center text-muted-foreground py-8">
          Search millions of foods from:
          <span className="block mt-2 text-sm">
            • Local branded foods database (offline)
            • Open Food Facts
            {(!import.meta.env.VITE_USDA_API_KEY || import.meta.env.VITE_USDA_API_KEY === "YOUR_USDA_API_KEY_HERE") && (
              <span> • USDA FoodData Central (<a href="https://fdc.nal.usda.gov/api-key-signup.html" target="_blank" rel="noopener noreferrer" className="underline">add API key</a>)</span>
            )}
          </span>
        </p>
      )}

      {/* Search Results */}
      {!showCustomFoods && (
        <div className="space-y-2">
          {results.map((product, i) => (
            <div key={product.code || i} className="border rounded-lg bg-card p-3">
              <div className="flex items-start gap-3">
                {product.image_url && (
                  <img src={product.image_url} alt="" className="h-12 w-12 rounded-md object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.product_name || "Unknown product"}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.brands && `${product.brands} · `}
                    {Math.round(product.nutriments?.["energy-kcal_100g"] || 0)} kcal/100g
                  </p>
                  <p className="text-xs text-muted-foreground">
                    P {Math.round(product.nutriments?.proteins_100g || 0)}g · 
                    C {Math.round(product.nutriments?.carbohydrates_100g || 0)}g · 
                    F {Math.round(product.nutriments?.fat_100g || 0)}g
                  </p>
                </div>
              </div>
              {/* Hidden vitamins/minerals display
              {product.nutriments && (
                <div className="mt-2 pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {product.nutriments["vitamin-c_100g"] ? <span>Vit C: {product.nutriments["vitamin-c_100g"].toFixed(1)}mg · </span> : null}
                    {product.nutriments["calcium_100g"] ? <span>Calcium: {product.nutriments["calcium_100g"].toFixed(1)}mg · </span> : null}
                    {product.nutriments["iron_100g"] ? <span>Iron: {product.nutriments["iron_100g"].toFixed(1)}mg</span> : null}
                    {!product.nutriments["vitamin-c_100g"] && !product.nutriments["calcium_100g"] && !product.nutriments["iron_100g"] && (
                      <span className="text-xs">No additional nutrition data</span>
                    )}
                  </div>
                </div>
              )}
              */}
              <div className="flex gap-2 mt-2">
                <Button size="sm" className="flex-1" onClick={() => handleAdd(product)}>
                  Add to Log
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEditSearchResult(product)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit & Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Foods Database */}
      {showCustomFoods && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">My Custom Foods ({customFoods.length})</h3>
          {customFoods.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No custom foods saved yet.<br />
              Search for foods and click "Edit & Save" to correct and add them here.
            </p>
          ) : (
            customFoods.map((food) => (
              <div key={food.id} className="border rounded-lg bg-card p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{food.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {food.serving_size} · {Math.round(food.nutriments["energy-kcal_100g"])} kcal
                    </p>
                    <p className="text-xs text-muted-foreground">
                      P {Math.round(food.nutriments.proteins_100g)}g · 
                      C {Math.round(food.nutriments.carbohydrates_100g)}g · 
                      F {Math.round(food.nutriments.fat_100g)}g
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => {
                        const favorited = isFavorite(food.id);
                        if (favorited) {
                          removeFavorite(food.id);
                          toast({ title: "Removed", description: "Food removed from favorites." });
                        } else {
                          console.log("Adding to favorites:", food);
                          console.log("Nutriments:", food.nutriments);
                          addFavorite({
                            id: food.id,
                            name: food.product_name,
                            calories: food.nutriments?.["energy-kcal_100g"] ?? 0,
                            serving_size: food.serving_size,
                            protein: food.nutriments?.proteins_100g ?? 0,
                            carbs: food.nutriments?.carbohydrates_100g ?? 0,
                            fat: food.nutriments?.fat_100g ?? 0,
                            fiber: food.nutriments?.fiber_100g ?? 0,
                            sugar: food.nutriments?.sugars_100g ?? 0,
                            sodium: food.nutriments?.sodium_100g ?? 0,
                            addedAt: new Date().toISOString(),
                            // Vitamins
                            vitaminA: food.nutriments?.["vitamin-a_100g"] ?? 0,
                            vitaminD: food.nutriments?.["vitamin-d_100g"] ?? 0,
                            vitaminE: food.nutriments?.["vitamin-e_100g"] ?? 0,
                            vitaminK: food.nutriments?.["vitamin-k_100g"] ?? 0,
                            vitaminC: food.nutriments?.["vitamin-c_100g"] ?? 0,
                            vitaminB1: food.nutriments?.["vitamin-b1_100g"] ?? 0,
                            vitaminB2: food.nutriments?.["vitamin-b2_100g"] ?? 0,
                            vitaminB3: food.nutriments?.["vitamin-b3_100g"] ?? 0,
                            vitaminB6: food.nutriments?.["vitamin-b6_100g"] ?? 0,
                            vitaminB9: food.nutriments?.["vitamin-b9_100g"] ?? 0,
                            vitaminB12: food.nutriments?.["vitamin-b12_100g"] ?? 0,
                            biotin: food.nutriments?.biotin_100g ?? 0,
                            pantothenicAcid: food.nutriments?.["pantothenic-acid_100g"] ?? 0,
                            // Minerals
                            calcium: food.nutriments?.calcium_100g ?? 0,
                            iron: food.nutriments?.iron_100g ?? 0,
                            magnesium: food.nutriments?.magnesium_100g ?? 0,
                            phosphorus: food.nutriments?.phosphorus_100g ?? 0,
                            potassium: food.nutriments?.potassium_100g ?? 0,
                            zinc: food.nutriments?.zinc_100g ?? 0,
                            copper: food.nutriments?.copper_100g ?? 0,
                            selenium: food.nutriments?.selenium_100g ?? 0,
                            manganese: food.nutriments?.manganese_100g ?? 0,
                          });
                          toast({ title: "Added", description: "Food added to favorites." });
                        }
                      }}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(food.id) ? "text-rose-500 fill-rose-500" : "text-muted-foreground"}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleEditCustomFood(food)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive shrink-0"
                      onClick={() => handleDeleteCustomFood(food.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1" onClick={() => handleAddFromCustomDatabase(food)}>
                    Add to Log
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Custom Food Dialog */}
      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Custom Food</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Food Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Homemade Smoothie"
                value={customFood.product_name}
                onChange={e => setCustomFood({ ...customFood, product_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serving">Serving Size</Label>
              <Input
                id="serving"
                placeholder="e.g., 1 cup, 100g"
                value={customFood.serving_size}
                onChange={e => setCustomFood({ ...customFood, serving_size: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="0"
                  value={customFood.calories}
                  onChange={e => setCustomFood({ ...customFood, calories: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="0"
                  value={customFood.protein}
                  onChange={e => setCustomFood({ ...customFood, protein: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="0"
                  value={customFood.carbs}
                  onChange={e => setCustomFood({ ...customFood, carbs: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  placeholder="0"
                  value={customFood.fat}
                  onChange={e => setCustomFood({ ...customFood, fat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  placeholder="0"
                  value={customFood.fiber}
                  onChange={e => setCustomFood({ ...customFood, fiber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugar">Sugar (g)</Label>
                <Input
                  id="sugar"
                  type="number"
                  placeholder="0"
                  value={customFood.sugar}
                  onChange={e => setCustomFood({ ...customFood, sugar: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sodium">Sodium (mg)</Label>
              <Input
                id="sodium"
                type="number"
                placeholder="0"
                value={customFood.sodium}
                onChange={e => setCustomFood({ ...customFood, sodium: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button variant="outline" onClick={() => setCustomDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomFood}>Add to Log Only</Button>
            <Button onClick={handleSaveCustomToDatabase} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Add & Save to Database
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Search Result Dialog */}
      <Dialog open={editSearchDialogOpen} onOpenChange={setEditSearchDialogOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCustomFood ? "Edit Custom Food" : "Edit Nutrition Facts"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {editingCustomFood 
                ? "Update the nutrition facts for this custom food."
                : "Correct any errors in the nutrition facts before saving to your database."}
            </p>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Food Name</Label>
              <Input
                id="edit-name"
                value={customFood.product_name}
                onChange={e => setCustomFood({ ...customFood, product_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-serving">Serving Size</Label>
              <Input
                id="edit-serving"
                value={customFood.serving_size}
                onChange={e => setCustomFood({ ...customFood, serving_size: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-calories">Calories</Label>
                <Input
                  id="edit-calories"
                  type="number"
                  value={customFood.calories}
                  onChange={e => setCustomFood({ ...customFood, calories: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-protein">Protein (g)</Label>
                <Input
                  id="edit-protein"
                  type="number"
                  value={customFood.protein}
                  onChange={e => setCustomFood({ ...customFood, protein: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-carbs">Carbs (g)</Label>
                <Input
                  id="edit-carbs"
                  type="number"
                  value={customFood.carbs}
                  onChange={e => setCustomFood({ ...customFood, carbs: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fat">Fat (g)</Label>
                <Input
                  id="edit-fat"
                  type="number"
                  value={customFood.fat}
                  onChange={e => setCustomFood({ ...customFood, fat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fiber">Fiber (g)</Label>
                <Input
                  id="edit-fiber"
                  type="number"
                  value={customFood.fiber}
                  onChange={e => setCustomFood({ ...customFood, fiber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sugar">Sugar (g)</Label>
                <Input
                  id="edit-sugar"
                  type="number"
                  value={customFood.sugar}
                  onChange={e => setCustomFood({ ...customFood, sugar: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sodium">Sodium (mg)</Label>
              <Input
                id="edit-sodium"
                type="number"
                value={customFood.sodium}
                onChange={e => setCustomFood({ ...customFood, sodium: e.target.value })}
              />
            </div>
            
            {/* Vitamins & Minerals */}
            {editingSearchResult && (
              <VitaminsMineralsCard 
                nutriments={editingSearchResult.nutriments || {}} 
                servingSize={customFood.serving_size}
              />
            )}
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button variant="outline" onClick={() => {
              setEditSearchDialogOpen(false);
              setEditingCustomFood(null);
              setEditingSearchResult(null);
            }}>Cancel</Button>
            <Button 
              onClick={() => {
                if (editingCustomFood) {
                  handleUpdateCustomFood();
                } else {
                  handleSaveEditedSearchResult();
                }
              }} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingCustomFood ? "Update" : "Save to Database"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
