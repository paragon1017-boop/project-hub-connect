import { useState } from "react";
import { useFoodLog } from "@/hooks/useFoodLog";
import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CalorieRing from "@/components/CalorieRing";
import NutritionCard from "@/components/NutritionCard";
import FoodLogItem from "@/components/FoodLogItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WorkoutsPanel from "@/components/WorkoutsPanel";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookOpen, Scale, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { format, subDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface FoodLogItemType {
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

export default function Index() {
  const { foodLog, totals, deleteFood, updateFood, isLoading } = useFoodLog();
  const { profile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const goal = profile?.calorie_goal || 2000;
  const isAdminBypass = user?.id === "admin-bypass-id";

  // History chart data - last 14 days
  const { data: historyData = [] } = useQuery({
    queryKey: ["homeHistory", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const days = 14;
      const start = subDays(new Date(), days - 1);
      const items: any[] = [];
      
      for (let d = new Date(start); d <= new Date(); d.setDate(d.getDate() + 1)) {
        const dateStr = format(d, "yyyy-MM-dd");
        
        if (isAdminBypass) {
          const key = `food_log_${user.id}_${dateStr}`;
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (Array.isArray(parsed)) {
                items.push(...parsed);
              }
            } catch (e) {}
          }
        } else {
          const { data: rows } = await supabase
            .from("food_log")
            .select("logged_date, calories, quantity")
            .eq("user_id", user.id)
            .eq("logged_date", dateStr);
          if (rows) items.push(...rows);
        }
      }
      return items;
    },
    enabled: !!user,
  });

  // Group history by date
  const groupedHistory = historyData.reduce<Record<string, number>>((acc, row) => {
    const d = row.logged_date;
    if (!acc[d]) acc[d] = 0;
    acc[d] += (row.calories || 0) * (row.quantity || 1);
    return acc;
  }, {});

  const chartData = Array.from({ length: 14 }, (_, i) => {
    const date = format(subDays(new Date(), 13 - i), "yyyy-MM-dd");
    const label = format(subDays(new Date(), 13 - i), "MMM d");
    return { date: label, calories: Math.round(groupedHistory[date] || 0) };
  });
  
  const todayKey = format(new Date(), "yyyy-MM-dd");
  
  // Daily weight tracking
  const getDailyWeight = (): number | undefined => {
    if (!user) return undefined;
    const key = `journal_weight_${user.id}_${todayKey}`;
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : undefined;
  };
  
  const [todayWeight, setTodayWeight] = useState<number | undefined>(getDailyWeight());
  
  const saveDailyWeight = (weight: number | undefined) => {
    if (!user) return;
    const key = `journal_weight_${user.id}_${todayKey}`;
    if (weight !== undefined) {
      localStorage.setItem(key, String(weight));
    } else {
      localStorage.removeItem(key);
    }
    setTodayWeight(weight);
  };
  
  // Daily water tracking
  const getDailyWater = (): number => {
    if (!user) return 0;
    const key = `journal_water_${user.id}_${todayKey}`;
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : 0;
  };
  
  const [todayWater, setTodayWater] = useState<number>(getDailyWater());
  
  const saveDailyWater = (water: number) => {
    if (!user) return;
    const key = `journal_water_${user.id}_${todayKey}`;
    localStorage.setItem(key, String(Math.max(0, water)));
    setTodayWater(Math.max(0, water));
  };
  
  const addWater = (amount: number) => {
    saveDailyWater(todayWater + amount);
  };
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodLogItemType | null>(null);
  const [editForm, setEditForm] = useState({
    food_name: "",
    serving_size: "",
    quantity: "1",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
  });

  const handleEdit = (item: FoodLogItemType) => {
    setEditingItem(item);
    setEditForm({
      food_name: item.food_name,
      serving_size: item.serving_size || "",
      quantity: String(item.quantity),
      calories: String(item.calories),
      protein: String(item.protein),
      carbs: String(item.carbs),
      fat: String(item.fat),
      fiber: String(item.fiber),
      sugar: String(item.sugar),
      sodium: String(item.sodium),
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    const updatedItem: FoodLogItemType = {
      ...editingItem,
      food_name: editForm.food_name,
      serving_size: editForm.serving_size,
      quantity: Number(editForm.quantity) || 1,
      calories: Number(editForm.calories) || 0,
      protein: Number(editForm.protein) || 0,
      carbs: Number(editForm.carbs) || 0,
      fat: Number(editForm.fat) || 0,
      fiber: Number(editForm.fiber) || 0,
      sugar: Number(editForm.sugar) || 0,
      sodium: Number(editForm.sodium) || 0,
    };

    updateFood.mutate(updatedItem, {
      onSuccess: () => {
        toast({ title: "Updated!", description: `${updatedItem.food_name} has been updated.` });
        setEditDialogOpen(false);
        setEditingItem(null);
      },
      onError: (error) => {
        toast({ variant: "destructive", title: "Error", description: error.message || "Failed to update food." });
      },
    });
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-2">
      <div className="flex justify-center mb-4 gap-6">
        <CalorieRing consumed={totals.calories} goal={goal} />
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2">Last 14 Days</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={3} />
              <YAxis hide />
              <Tooltip 
                formatter={(value: number) => [`${value} kcal`, "Calories"]}
                labelStyle={{ fontSize: 12 }}
                contentStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="calories" fill="hsl(152, 58%, 42%)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        <NutritionCard label="Protein" value={totals.protein} unit="g" color="hsl(var(--nutri-blue))" />
        <NutritionCard label="Carbs" value={totals.carbs} unit="g" color="hsl(var(--nutri-orange))" />
        <NutritionCard label="Fat" value={totals.fat} unit="g" color="hsl(var(--nutri-red))" />
        <NutritionCard label="Fiber" value={totals.fiber} unit="g" color="hsl(var(--nutri-green))" />
      </div>

      {/* Today's Water */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Droplets className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Today's Water</h3>
        </div>
        <div className="flex gap-3">
          <Input
            type="number"
            step="1"
            placeholder="Enter water in oz"
            value={todayWater || ""}
            onChange={e => {
              const water = e.target.value ? Number(e.target.value) : 0;
              saveDailyWater(water);
            }}
            className="text-lg flex-1"
          />
          <Button 
            variant="outline" 
            onClick={() => navigate('/journal')}
            className="shrink-0"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Log
          </Button>
        </div>
        <div className="text-xs text-blue-600 text-center mt-2">
          Goal: 64 oz (128 oz = 1 gallon) · {Math.round((todayWater / 64) * 100)}% complete
        </div>
      </div>

      {/* Today's Weight */}
      <div className="bg-primary/10 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Today's Weight</h3>
        </div>
        <div className="flex gap-3">
          <Input
            type="number"
            step="0.1"
            placeholder="Enter weight in lbs"
            value={todayWeight ?? ""}
            onChange={e => {
              const weight = e.target.value ? Number(e.target.value) : undefined;
              saveDailyWeight(weight);
            }}
            className="text-lg flex-1"
          />
          <Button 
            variant="outline" 
            onClick={() => navigate('/journal')}
            className="shrink-0"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View Journal
          </Button>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Food Log</h2>
      
      {/* Water entry in food log */}
      {todayWater > 0 && (
        <div className="flex items-center justify-between border rounded-lg p-3 bg-blue-50 mb-2">
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium text-blue-900">Water</p>
              <p className="text-xs text-blue-600">{todayWater} oz</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => saveDailyWater(todayWater + 8)}
              className="text-blue-600"
            >
              +8oz
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => saveDailyWater(Math.max(0, todayWater - 8))}
              className="text-blue-600"
            >
              -8oz
            </Button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : foodLog.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No food logged today. Use Scan or Search to add food!</p>
      ) : (
        <div className="space-y-2">
          {foodLog.map(item => (
            <FoodLogItem
              key={item.id}
              item={item}
              onDelete={id => {
                deleteFood.mutate(id);
              }}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Food</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Food Name</Label>
              <Input
                id="edit-name"
                value={editForm.food_name}
                onChange={e => setEditForm({ ...editForm, food_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-serving">Serving Size</Label>
                <Input
                  id="edit-serving"
                  value={editForm.serving_size}
                  onChange={e => setEditForm({ ...editForm, serving_size: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  step="0.1"
                  value={editForm.quantity}
                  onChange={e => setEditForm({ ...editForm, quantity: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-calories">Calories (per serving)</Label>
                <Input
                  id="edit-calories"
                  type="number"
                  value={editForm.calories}
                  onChange={e => setEditForm({ ...editForm, calories: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-protein">Protein (g)</Label>
                <Input
                  id="edit-protein"
                  type="number"
                  value={editForm.protein}
                  onChange={e => setEditForm({ ...editForm, protein: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-carbs">Carbs (g)</Label>
                <Input
                  id="edit-carbs"
                  type="number"
                  value={editForm.carbs}
                  onChange={e => setEditForm({ ...editForm, carbs: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fat">Fat (g)</Label>
                <Input
                  id="edit-fat"
                  type="number"
                  value={editForm.fat}
                  onChange={e => setEditForm({ ...editForm, fat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fiber">Fiber (g)</Label>
                <Input
                  id="edit-fiber"
                  type="number"
                  value={editForm.fiber}
                  onChange={e => setEditForm({ ...editForm, fiber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sugar">Sugar (g)</Label>
                <Input
                  id="edit-sugar"
                  type="number"
                  value={editForm.sugar}
                  onChange={e => setEditForm({ ...editForm, sugar: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sodium">Sodium (mg)</Label>
              <Input
                id="edit-sodium"
                type="number"
                value={editForm.sodium}
                onChange={e => setEditForm({ ...editForm, sodium: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <WorkoutsPanel />
    </div>
  );
}
