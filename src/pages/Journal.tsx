import { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, TrendingUp, Calendar, Target, ChevronRight, X, Download, Bot, Dumbbell, Utensils } from "lucide-react";
import JournalExportModal from "@/components/JournalExportModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useRoutines } from "@/hooks/useRoutines";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Heart, Save } from "lucide-react";

interface Program {
  id: string;
  name: string;
  type: "bulking" | "cutting";
  startDate: string;
  endDate: string;
  targetCalories: number;
  notes: string;
}

interface FoodItem {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  quantity: number;
  serving_size?: string;
}

interface WorkoutItem {
  id: string;
  name: string;
  duration?: number;
  intensity?: 'Low'|'Medium'|'High';
  caloriesBurned?: number;
}

interface DailyLog {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: FoodItem[];
  workouts?: WorkoutItem[];
}

const STORAGE_KEY = "fitness_programs";
const PROFILE_KEY = "journal_profile";

export default function Journal() {
  // Profile info (height, age, gender) - set once, persists across days
  type ProfileInfo = {
    height?: number;
    age?: number;
    gender?: string;
  };
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({});
  
  // Load profile from localStorage (set once)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setProfileInfo(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);
  
  // Persist profile
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileInfo));
  }, [profileInfo]);
  
  // Daily weight tracking function
  const getDailyWeight = (dateStr: string): number | undefined => {
    if (!user) return undefined;
    const key = `journal_weight_${user.id}_${dateStr}`;
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : undefined;
  };

  const setDailyWeight = (dateStr: string, weight: number | undefined) => {
    if (!user) return;
    const key = `journal_weight_${user.id}_${dateStr}`;
    if (weight !== undefined) {
      localStorage.setItem(key, String(weight));
    } else {
      localStorage.removeItem(key);
    }
  };

  // Daily water tracking function
  const getDailyWater = (dateStr: string): number => {
    if (!user) return 0;
    const key = `journal_water_${user.id}_${dateStr}`;
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : 0;
  };

  const setDailyWater = (dateStr: string, water: number) => {
    if (!user) return;
    const key = `journal_water_${user.id}_${dateStr}`;
    localStorage.setItem(key, String(Math.max(0, water)));
  };
  const { user } = useAuth();
  const { routines } = useRoutines();
  const { favorites } = useFavorites();
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DailyLog | null>(null);
  const [newProgram, setNewProgram] = useState({
    name: "",
    type: "bulking" as "bulking" | "cutting",
    duration: 30,
    targetCalories: 2500,
    notes: "",
  });
  const [programToExport, setProgramToExport] = useState<Program | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportPayload, setExportPayload] = useState<any>(null);
  const [dayWeight, setDayWeight] = useState<string>("");
  const [dayWater, setDayWater] = useState<string>("");

  // Update weight and water state when selected day changes
  useEffect(() => {
    if (selectedDay) {
      const weight = getDailyWeight(selectedDay.date);
      setDayWeight(weight !== undefined ? String(weight) : "");
      const water = getDailyWater(selectedDay.date);
      setDayWater(water ? String(water) : "");
    } else {
      setDayWeight("");
      setDayWater("");
    }
  }, [selectedDay]);

  const buildExportForProgram = (prog: Program) => {
    const logs = getProgramLogs(prog);
    const days = logs.map(log => ({
      date: log.date,
      calories: log.calories,
      protein: log.protein,
      carbs: log.carbs,
      fat: log.fat,
      weight: getDailyWeight(log.date),
      water: getDailyWater(log.date),
      foods: (log.items || []).map(item => ({
        food_name: item.food_name,
        serving_size: item.serving_size,
        quantity: item.quantity,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat
      })),
      workouts: (log.workouts || []).map((w: any) => ({
        name: w.name,
        duration: w.duration,
        intensity: w.intensity,
        caloriesBurned: w.caloriesBurned
      }))
    }));
    return {
      generatedAt: new Date().toISOString(),
      demographics: {
        ...profileInfo,
        weight: undefined // Weight is now tracked per day separately
      },
      program: {
        id: prog.id,
        name: prog.name,
        type: prog.type,
        startDate: prog.startDate,
        endDate: prog.endDate,
        targetCalories: prog.targetCalories,
        notes: prog.notes,
        days
      }
    };
  };

  const prepareExport = (prog: Program) => {
    const payload = buildExportForProgram(prog);
    setProgramToExport(prog);
    setExportPayload(payload);
    setIsExportOpen(true);
  };

  // Export a single day
  const prepareDayExport = (day: DailyLog) => {
    const dailyWeight = getDailyWeight(day.date);
    const dailyWater = getDailyWater(day.date);
    const payload = {
      generatedAt: new Date().toISOString(),
      demographics: {
        ...profileInfo,
        weight: dailyWeight
      },
      day: {
        date: day.date,
        calories: day.calories,
        protein: day.protein,
        carbs: day.carbs,
        fat: day.fat,
        weight: dailyWeight,
        water: dailyWater,
        foods: (day.items || []).map(item => ({
          food_name: item.food_name,
          serving_size: item.serving_size,
          quantity: item.quantity,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: (item as any).fiber,
          sugar: (item as any).sugar,
          sodium: (item as any).sodium,
        })),
        workouts: (day.workouts || []).map((w: any) => ({
          name: w.name,
          duration: w.duration,
          intensity: w.intensity,
          caloriesBurned: w.caloriesBurned
        }))
      }
    };
    setExportPayload(payload);
    setIsExportOpen(true);
  };

  // Load programs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPrograms(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load programs", e);
      }
    }
  }, []);

  // Save programs to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  }, [programs]);

  const handleCreateProgram = () => {
    if (!newProgram.name) return;
    
    const program: Program = {
      id: crypto.randomUUID(),
      name: newProgram.name,
      type: newProgram.type,
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addDays(new Date(), newProgram.duration), "yyyy-MM-dd"),
      targetCalories: newProgram.targetCalories,
      notes: newProgram.notes,
    };
    
    setPrograms([program, ...programs]);
    setIsCreateDialogOpen(false);
    setNewProgram({
      name: "",
      type: "bulking",
      duration: 30,
      targetCalories: 2500,
      notes: "",
    });
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter(p => p.id !== id));
    if (selectedProgram?.id === id) {
      setSelectedProgram(null);
    }
  };

  const getProgramLogs = (program: Program): DailyLog[] => {
    if (!user) return [];
    
    const logs: DailyLog[] = [];
    const start = parseISO(program.startDate);
    const end = parseISO(program.endDate);
    const today = new Date();
    
    for (let d = new Date(start); d <= end && d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, "yyyy-MM-dd");
      const key = `food_log_${user.id}_${dateStr}`;
      const data = localStorage.getItem(key);
      
      if (data) {
        try {
          const items = JSON.parse(data);
          if (Array.isArray(items)) {
            const dayLog: DailyLog = {
              date: dateStr,
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              items: [],
            };
            
            items.forEach((item: any) => {
              const foodItem: FoodItem = {
                id: item.id,
                food_name: item.food_name,
                calories: item.calories || 0,
                protein: item.protein || 0,
                carbs: item.carbs || 0,
                fat: item.fat || 0,
                quantity: item.quantity || 1,
                serving_size: item.serving_size,
              };
            dayLog.items.push(foodItem);
              dayLog.calories += foodItem.calories * foodItem.quantity;
              dayLog.protein += foodItem.protein * foodItem.quantity;
              dayLog.carbs += foodItem.carbs * foodItem.quantity;
              dayLog.fat += foodItem.fat * foodItem.quantity;
            });
            
            try {
              const wRaw = localStorage.getItem(`workout_log_${user?.id}_${dateStr}`);
              if (wRaw) dayLog.workouts = JSON.parse(wRaw) as WorkoutItem[];
            } catch {
              // ignore
            }
            logs.push(dayLog);
          }
        } catch (e) {
          console.error("Parse error", e);
        }
      }
    }
    
    return logs;
  };

  const { toast } = useToast();
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [foodDraft, setFoodDraft] = useState<{ food_name: string; serving_size: string; quantity: string; calories: string; protein: string; carbs: string; fat: string; fiber: string; sugar: string; sodium: string } | null>(null);

  // Inline editing helpers for foods
  const startFoodEdit = (food: FoodItem) => {
    setEditingFoodId(food.id)
    setFoodDraft({
      food_name: food.food_name,
      serving_size: food.serving_size ?? '',
      quantity: String(food.quantity ?? 1),
      calories: String(food.calories ?? 0),
      protein: String(food.protein ?? 0),
      carbs: String(food.carbs ?? 0),
      fat: String(food.fat ?? 0),
      fiber: String((food as any).fiber ?? 0),
      sugar: String((food as any).sugar ?? 0),
      sodium: String((food as any).sodium ?? 0),
    })
  }

  const cancelFoodEdit = () => {
    setEditingFoodId(null)
    setFoodDraft(null)
  }

  const saveFoodEdit = (dateStr: string, itemId: string) => {
    if (!foodDraft) return
    const updated: FoodItem = {
      id: itemId,
      food_name: foodDraft.food_name,
      serving_size: foodDraft.serving_size,
      quantity: Number(foodDraft.quantity) || 1,
      calories: Number(foodDraft.calories) || 0,
      protein: Number(foodDraft.protein) || 0,
      carbs: Number(foodDraft.carbs) || 0,
      fat: Number(foodDraft.fat) || 0,
      fiber: Number(foodDraft.fiber) || 0,
      sugar: Number(foodDraft.sugar) || 0,
      sodium: Number(foodDraft.sodium) || 0,
    }
    const key = `food_log_${user?.id}_${dateStr}`
    const raw = localStorage.getItem(key)
    if (raw) {
      const items = JSON.parse(raw) as FoodItem[]
      const idx = items.findIndex(i => i.id === itemId)
      if (idx >= 0) {
        items[idx] = updated
        localStorage.setItem(key, JSON.stringify(items))
        const refreshed = buildDayForDate(dateStr)
        if (refreshed) setSelectedDay(refreshed)
      }
    }
    setEditingFoodId(null)
    setFoodDraft(null)
    toast({ title: 'Saved', description: 'Food item updated.' })
  }

  // Day refresh helper
  const buildDayForDate = (dateStr: string): DailyLog | null => {
    const dayLog: DailyLog = { date: dateStr, calories: 0, protein: 0, carbs: 0, fat: 0, items: [], workouts: [] }
    const foodsRaw = localStorage.getItem(`food_log_${user?.id}_${dateStr}`)
    if (foodsRaw) {
      try {
        const items = JSON.parse(foodsRaw) as FoodItem[]
        items.forEach(fi => {
          dayLog.items.push(fi)
          dayLog.calories += (fi.calories || 0) * (fi.quantity || 1)
          dayLog.protein += (fi.protein || 0) * (fi.quantity || 1)
          dayLog.carbs += (fi.carbs || 0) * (fi.quantity || 1)
          dayLog.fat += (fi.fat || 0) * (fi.quantity || 1)
        })
      } catch {}
    }
    const wRaw = localStorage.getItem(`workout_log_${user?.id}_${dateStr}`)
    if (wRaw) {
      try { dayLog.workouts = JSON.parse(wRaw) as WorkoutItem[] } catch {}
    }
    return dayLog
  }
  const addFoodToDate = (dateStr: string, foodData: Omit<FoodItem, "id">) => {
    if (!user) return;
    
    const key = `food_log_${user.id}_${dateStr}`;
    const existing = localStorage.getItem(key);
    const items: FoodItem[] = existing ? JSON.parse(existing) : [];
    
    const newItem: FoodItem = {
      id: crypto.randomUUID(),
      ...foodData,
    };
    
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    
    // Refresh the selected day if it's the one we just modified
    if (selectedDay?.date === dateStr) {
      const updatedLog = getProgramLogs({
        id: "temp",
        name: "temp",
        type: "bulking",
        startDate: dateStr,
        endDate: dateStr,
        targetCalories: 2000,
        notes: "",
      }).find(l => l.date === dateStr);
      
      if (updatedLog) {
        setSelectedDay(updatedLog);
      }
    }
    
    toast({ title: "Added!", description: `${foodData.food_name} added to ${format(parseISO(dateStr), "MMM d")}` });
  };

  // Add workout to a specific date
  const addWorkoutToDate = (dateStr: string, workoutData: Omit<WorkoutItem, "id">) => {
    if (!user) return;
    
    const key = `workout_log_${user.id}_${dateStr}`;
    const existing = localStorage.getItem(key);
    const workouts: WorkoutItem[] = existing ? JSON.parse(existing) : [];
    
    const newWorkout: WorkoutItem = {
      id: crypto.randomUUID(),
      ...workoutData,
    };
    
    workouts.push(newWorkout);
    localStorage.setItem(key, JSON.stringify(workouts));
    
    // Refresh the selected day if it's the one we just modified
    if (selectedDay?.date === dateStr) {
      const updatedLog = getProgramLogs({
        id: "temp",
        name: "temp",
        type: "bulking",
        startDate: dateStr,
        endDate: dateStr,
        targetCalories: 2000,
        notes: "",
      }).find(l => l.date === dateStr);
      
      if (updatedLog) {
        setSelectedDay(updatedLog);
      }
    }
    
  toast({ title: "Added!", description: `${workoutData.name} added to ${format(parseISO(dateStr), "MMM d")}` });
  };

  // Inline editing: workouts
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [workoutDraft, setWorkoutDraft] = useState<{ name: string; duration: string; intensity: string; caloriesBurned: string } | null>(null);

  const startWorkoutEdit = (w: WorkoutItem) => {
    setEditingWorkoutId(w.id)
    setWorkoutDraft({
      name: w.name,
      duration: String(w.duration ?? ''),
      intensity: w.intensity ?? 'Medium',
      caloriesBurned: String(w.caloriesBurned ?? ''),
    })
  }

  const cancelWorkoutEdit = () => {
    setEditingWorkoutId(null)
    setWorkoutDraft(null)
  }

  const saveWorkoutEdit = (dateStr: string, workoutId: string) => {
    if (!workoutDraft) return
    const updates: Partial<WorkoutItem> = {
      name: workoutDraft.name,
      duration: workoutDraft.duration ? Number(workoutDraft.duration) : undefined,
      intensity: (workoutDraft.intensity as any) || undefined,
      caloriesBurned: workoutDraft.caloriesBurned ? Number(workoutDraft.caloriesBurned) : undefined,
    }
    const key = `workout_log_${user?.id}_${dateStr}`
    const raw = localStorage.getItem(key)
    if (raw) {
      const list = JSON.parse(raw) as WorkoutItem[]
      const idx = list.findIndex(w => w.id === workoutId)
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...updates }
        localStorage.setItem(key, JSON.stringify(list))
        const refreshed = buildDayForDate(dateStr)
        if (refreshed) setSelectedDay(refreshed)
      }
    }
    setEditingWorkoutId(null)
    setWorkoutDraft(null)
    toast({ title: 'Saved', description: 'Workout updated.' })
  }

  // Update food item
  const updateFoodItem = (dateStr: string, itemId: string, updates: Partial<FoodItem>) => {
    if (!user) return;
    
    const key = `food_log_${user.id}_${dateStr}`;
    const existing = localStorage.getItem(key);
    if (!existing) return;
    
    const items: FoodItem[] = JSON.parse(existing);
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    localStorage.setItem(key, JSON.stringify(updatedItems));
    
    // Refresh the selected day
    if (selectedDay?.date === dateStr) {
      const updatedLog = getProgramLogs({
        id: "temp",
        name: "temp",
        type: "bulking",
        startDate: dateStr,
        endDate: dateStr,
        targetCalories: 2000,
        notes: "",
      }).find(l => l.date === dateStr);
      
      if (updatedLog) {
        setSelectedDay(updatedLog);
      }
    }
    
    toast({ title: "Updated!", description: "Food item updated successfully." });
  };

  // Delete food item
  const deleteFoodItem = (dateStr: string, itemId: string) => {
    if (!user) return;
    
    const key = `food_log_${user.id}_${dateStr}`;
    const existing = localStorage.getItem(key);
    if (!existing) return;
    
    const items: FoodItem[] = JSON.parse(existing);
    const updatedItems = items.filter(item => item.id !== itemId);
    
    localStorage.setItem(key, JSON.stringify(updatedItems));
    
    // Refresh the selected day
    if (selectedDay?.date === dateStr) {
      const updatedLog = getProgramLogs({
        id: "temp",
        name: "temp",
        type: "bulking",
        startDate: dateStr,
        endDate: dateStr,
        targetCalories: 2000,
        notes: "",
      }).find(l => l.date === dateStr);
      
      if (updatedLog) {
        setSelectedDay(updatedLog);
      }
    }
    
    toast({ title: "Deleted!", description: "Food item removed." });
  };

  // Update workout
  const updateWorkoutItem = (dateStr: string, workoutId: string, updates: Partial<WorkoutItem>) => {
    if (!user) return;
    
    const key = `workout_log_${user.id}_${dateStr}`;
    const existing = localStorage.getItem(key);
    if (!existing) return;
    
    const workouts: WorkoutItem[] = JSON.parse(existing);
    const updatedWorkouts = workouts.map(workout => 
      workout.id === workoutId ? { ...workout, ...updates } : workout
    );
    
    localStorage.setItem(key, JSON.stringify(updatedWorkouts));
    
    // Refresh the selected day
    if (selectedDay?.date === dateStr) {
      const updatedLog = getProgramLogs({
        id: "temp",
        name: "temp",
        type: "bulking",
        startDate: dateStr,
        endDate: dateStr,
        targetCalories: 2000,
        notes: "",
      }).find(l => l.date === dateStr);
      
      if (updatedLog) {
        setSelectedDay(updatedLog);
      }
    }
    
    toast({ title: "Updated!", description: "Workout updated successfully." });
  };

  // Delete workout
  const deleteWorkoutItem = (dateStr: string, workoutId: string) => {
    if (!user) return;
    
    const key = `workout_log_${user.id}_${dateStr}`;
    const existing = localStorage.getItem(key);
    if (!existing) return;
    
    const workouts: WorkoutItem[] = JSON.parse(existing);
    const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
    
    localStorage.setItem(key, JSON.stringify(updatedWorkouts));
    
    // Refresh the selected day
    if (selectedDay?.date === dateStr) {
      const updatedLog = getProgramLogs({
        id: "temp",
        name: "temp",
        type: "bulking",
        startDate: dateStr,
        endDate: dateStr,
        targetCalories: 2000,
        notes: "",
      }).find(l => l.date === dateStr);
      
      if (updatedLog) {
        setSelectedDay(updatedLog);
      }
    }
    
    toast({ title: "Deleted!", description: "Workout removed." });
  };

  // Dialog states for adding items
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false);
  const [addWorkoutDialogOpen, setAddWorkoutDialogOpen] = useState(false);
  const [newFood, setNewFood] = useState({
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
    quantity: "1",
    serving_size: "serving",
  });
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    duration: "",
    intensity: "Medium" as "Low" | "Medium" | "High",
    caloriesBurned: "",
  });

  // Edit dialog states
  const [editFoodDialogOpen, setEditFoodDialogOpen] = useState(false);
  const [editWorkoutDialogOpen, setEditWorkoutDialogOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutItem | null>(null);
  const [editFoodForm, setEditFoodForm] = useState({
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
    quantity: "1",
    serving_size: "serving",
  });
  const [editWorkoutForm, setEditWorkoutForm] = useState({
    name: "",
    duration: "",
    intensity: "Medium" as "Low" | "Medium" | "High",
    caloriesBurned: "",
  });

  const calculateStats = (logs: DailyLog[], targetCalories: number) => {
    if (logs.length === 0) return null;
    
    const avgCalories = logs.reduce((sum, log) => sum + log.calories, 0) / logs.length;
    const avgProtein = logs.reduce((sum, log) => sum + log.protein, 0) / logs.length;
    const avgCarbs = logs.reduce((sum, log) => sum + log.carbs, 0) / logs.length;
    const avgFat = logs.reduce((sum, log) => sum + log.fat, 0) / logs.length;
    
    const daysOnTarget = logs.filter(log => Math.abs(log.calories - targetCalories) <= 200).length;
    const consistency = Math.round((daysOnTarget / logs.length) * 100);
    
    return {
      avgCalories: Math.round(avgCalories),
      avgProtein: Math.round(avgProtein),
      avgCarbs: Math.round(avgCarbs),
      avgFat: Math.round(avgFat),
      consistency,
      totalDays: logs.length,
    };
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <header className="mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-display">Journal</h1>
      </header>

      {/* Profile Settings - Height, Age, Gender (set once, persists) */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Profile Settings (set once)</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col">
            <Label htmlFor="height" className="text-xs mb-1">Height (in)</Label>
            <Input
              id="height"
              type="number"
              value={profileInfo.height ?? ""}
              onChange={e => setProfileInfo({ ...profileInfo, height: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="e.g., 70"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="age" className="text-xs mb-1">Age</Label>
            <Input
              id="age"
              type="number"
              value={profileInfo.age ?? ""}
              onChange={e => setProfileInfo({ ...profileInfo, age: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="e.g., 30"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="gender" className="text-xs mb-1">Gender</Label>
            <select
              id="gender"
              value={profileInfo.gender ?? ""}
              onChange={e => setProfileInfo({ ...profileInfo, gender: e.target.value })}
              className="border rounded px-2 py-2 h-10"
            >
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Program Button */}
      <Button 
        className="w-full mb-6" 
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Start New Program
      </Button>

      {programs.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No programs yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start a bulking or cutting program to track your progress!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Your Programs
          </h2>
          
          {programs.map(program => {
            const logs = getProgramLogs(program);
            const stats = calculateStats(logs, program.targetCalories);
            const daysRemaining = differenceInDays(parseISO(program.endDate), new Date());
            const isActive = daysRemaining > 0;
            
            return (
              <Card 
                key={program.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedProgram?.id === program.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedProgram(selectedProgram?.id === program.id ? null : program)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        const ok = window.confirm(`Are you sure you want to delete '${program.name}'?`);
                        if (ok) {
                          handleDeleteProgram(program.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => { e.stopPropagation(); prepareExport(program); }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      program.type === "bulking" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {program.type === "bulking" ? "🔥 Bulking" : "✂️ Cutting"}
                    </span>
                    {isActive ? (
                      <span className="text-green-600">{daysRemaining} days left</span>
                    ) : (
                      <span className="text-gray-500">Completed</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(program.startDate), "MMM d")} - {format(parseISO(program.endDate), "MMM d, yyyy")}
                  </div>
                  
                  {stats && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-muted rounded p-2 text-center">
                        <p className="text-muted-foreground">Avg Calories</p>
                        <p className="font-semibold text-lg">{stats.avgCalories}</p>
                        <p className="text-muted-foreground">/ {program.targetCalories}</p>
                      </div>
                      <div className="bg-muted rounded p-2 text-center">
                        <p className="text-muted-foreground">Protein</p>
                        <p className="font-semibold text-lg">{stats.avgProtein}g</p>
                      </div>
                      <div className="bg-muted rounded p-2 text-center">
                        <p className="text-muted-foreground">Consistency</p>
                        <p className="font-semibold text-lg">{stats.consistency}%</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedProgram?.id === program.id && logs.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-semibold mb-3">Daily Progress</h3>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={logs}>
                            <XAxis 
                              dataKey="date" 
                              tick={{ fontSize: 10 }}
                              tickFormatter={(date) => format(parseISO(date), "MMM d")}
                            />
                            <YAxis tick={{ fontSize: 10 }} width={40} />
                            <Tooltip 
                              labelFormatter={(date) => format(parseISO(date as string), "MMM d, yyyy")}
                            />
                            <ReferenceLine 
                              y={program.targetCalories} 
                              stroke="#888" 
                              strokeDasharray="3 3" 
                              label={{ value: "Target", position: "right" }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="calories" 
                              stroke="hsl(152, 58%, 42%)" 
                              strokeWidth={2}
                              dot={{ r: 3, fill: "hsl(152, 58%, 42%)", strokeWidth: 0 }}
                              activeDot={{ r: 6, onClick: (e: any) => {
                                const dayData = logs.find(l => l.date === e.payload.date);
                                if (dayData) setSelectedDay(dayData);
                              }}}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Click a point on the chart to see what you ate that day
                      </p>
                      
                      {/* Day by day list */}
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Daily Breakdown</h4>
                        {logs.map((log) => (
                          <button
                            key={log.date}
                            onClick={() => setSelectedDay(log)}
                            className="w-full flex items-center justify-between p-2 bg-muted rounded hover:bg-muted/80 transition-colors text-left"
                          >
                            <span className="text-sm font-medium">
                              {format(parseISO(log.date), "EEE, MMM d")}
                            </span>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="font-semibold">{Math.round(log.calories)} kcal</span>
                              <span className="text-muted-foreground">{log.items.length} items</span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span>Days logged: {stats?.totalDays}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>On target: {Math.round((logs.filter(l => Math.abs(l.calories - program.targetCalories) <= 200).length / logs.length) * 100)}%</span>
                        </div>
                      </div>
                      
                      {program.notes && (
                        <div className="mt-3 p-2 bg-muted rounded text-sm">
                          <p className="text-muted-foreground text-xs mb-1">Notes:</p>
                          <p>{program.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedProgram?.id !== program.id && (
                    <div className="mt-2 text-xs text-muted-foreground flex items-center">
                      Click to view details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Program Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Start New Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Program Name</Label>
              <Input
                id="name"
                placeholder="e.g., Summer Cut 2025"
                value={newProgram.name}
                onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Program Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={newProgram.type === "bulking" ? "default" : "outline"}
                  onClick={() => setNewProgram({ ...newProgram, type: "bulking" })}
                >
                  🔥 Bulking
                </Button>
                <Button
                  type="button"
                  variant={newProgram.type === "cutting" ? "default" : "outline"}
                  onClick={() => setNewProgram({ ...newProgram, type: "cutting" })}
                >
                  ✂️ Cutting
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min={7}
                max={365}
                value={newProgram.duration}
                onChange={(e) => setNewProgram({ ...newProgram, duration: parseInt(e.target.value) || 30 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calories">Daily Calorie Target</Label>
              <Input
                id="calories"
                type="number"
                min={1000}
                max={10000}
                value={newProgram.targetCalories}
                onChange={(e) => setNewProgram({ ...newProgram, targetCalories: parseInt(e.target.value) || 2000 })}
              />
              <p className="text-xs text-muted-foreground">
                {newProgram.type === "bulking" 
                  ? "Bulking typically requires 2500-3500+ calories" 
                  : "Cutting typically requires 1500-2000 calories"}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Goals, targets, etc."
                value={newProgram.notes}
                onChange={(e) => setNewProgram({ ...newProgram, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProgram} disabled={!newProgram.name}>
              Start Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Detail Dialog */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-md w-full max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {selectedDay && format(parseISO(selectedDay.date), "EEEE, MMMM d, yyyy")}
              </DialogTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => selectedDay && prepareDayExport(selectedDay)}
                  title="Export this day"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedDay(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {selectedDay && (
            <div className="space-y-4">
              {/* Daily Weight Input */}
              <div className="bg-primary/10 rounded-lg p-4">
                <Label htmlFor="daily-weight" className="text-sm font-semibold mb-2 block">Daily Weight (lbs)</Label>
                <Input
                  id="daily-weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter weight for this day"
                  value={dayWeight}
                  onChange={e => {
                    const newWeight = e.target.value;
                    setDayWeight(newWeight);
                    const weightNum = newWeight ? Number(newWeight) : undefined;
                    setDailyWeight(selectedDay.date, weightNum);
                  }}
                  className="text-lg"
                />
              </div>

              {/* Daily Water Input */}
              <div className="bg-blue-50 rounded-lg p-4">
                <Label htmlFor="daily-water" className="text-sm font-semibold mb-2 block text-blue-900">Daily Water (oz) - 128 oz = 1 gallon</Label>
                <Input
                  id="daily-water"
                  type="number"
                  step="1"
                  placeholder="Enter water intake for this day"
                  value={dayWater}
                  onChange={e => {
                    const newWater = e.target.value;
                    setDayWater(newWater);
                    const waterNum = newWater ? Number(newWater) : 0;
                    setDailyWater(selectedDay.date, waterNum);
                  }}
                  className="text-lg border-blue-200"
                />
                <p className="text-xs text-blue-600 mt-1">Goal: 64 oz · {dayWater ? Math.round((Number(dayWater) / 64) * 100) : 0}% complete</p>
              </div>

              {/* Day totals */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="text-xl font-bold">{Math.round(selectedDay.calories)}</p>
                </div>
                <div className="bg-muted rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="text-xl font-bold">{Math.round(selectedDay.protein)}g</p>
                </div>
                <div className="bg-muted rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="text-xl font-bold">{Math.round(selectedDay.carbs)}g</p>
                </div>
                <div className="bg-muted rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="text-xl font-bold">{Math.round(selectedDay.fat)}g</p>
                </div>
              </div>

              {/* Food items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold">Foods Eaten ({selectedDay.items.length} items)</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAddFoodDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Food
                  </Button>
                </div>
                {selectedDay.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No foods logged for this day.</p>
                ) : (
                  <div className="space-y-2">
              {selectedDay.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.food_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.serving_size || 'serving'}
                    </p>
                  </div>
                  <div className="text-right text-xs shrink-0">
                    <p className="font-semibold">{Math.round(item.calories * item.quantity)} kcal</p>
                    <p className="text-muted-foreground">
                      P {Math.round(item.protein * item.quantity)}g • 
                      C {Math.round(item.carbs * item.quantity)}g • 
                      F {Math.round(item.fat * item.quantity)}g
                    </p>
                  </div>
                   <div className="flex gap-2 shrink-0">
                     <button onClick={() => startFoodEdit(item)} className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1.5 text-sm font-medium">Edit</button>
                     <button onClick={() => deleteFoodItem(selectedDay.date, item.id)} className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1.5 text-sm font-medium">Delete</button>
                   </div>
                </div>
              ))}
                  </div>
                )}
              </div>

              {/* Workouts */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold">Workouts ({selectedDay.workouts?.length || 0})</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAddWorkoutDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Workout
                  </Button>
                </div>
                {(!selectedDay.workouts || selectedDay.workouts.length === 0) ? (
                  <p className="text-sm text-muted-foreground">No workouts logged for this day.</p>
                ) : (
                  <div className="space-y-2">
              {selectedDay.workouts.map((workout) => (
                <div key={workout.id} className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{workout.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {workout.duration ? `${workout.duration} min` : ''}
                      {workout.duration && workout.intensity ? ' • ' : ''}
                      {workout.intensity || ''}
                    </p>
                  </div>
                  {workout.caloriesBurned && (
                    <div className="text-right text-xs shrink-0">
                      <p className="font-semibold text-orange-600">-{workout.caloriesBurned} kcal</p>
                    </div>
                  )}
                   <div className="flex gap-2 shrink-0">
                     <button className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1.5 text-sm font-medium" onClick={() => startWorkoutEdit(workout)}>Edit</button>
                     <button className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1.5 text-sm font-medium" onClick={() => deleteWorkoutItem(selectedDay.date, workout.id)}>Delete</button>
                   </div>
                </div>
              ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Food Modal - Full Screen */}
      <Dialog open={!!editingFoodId && !!foodDraft} onOpenChange={() => { if (editingFoodId) cancelFoodEdit(); }}>
        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Food</DialogTitle>
          </DialogHeader>
          {foodDraft && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-base">Food Name</Label>
                <Input 
                  className="text-lg" 
                  value={foodDraft.food_name} 
                  onChange={e => setFoodDraft({ ...foodDraft, food_name: e.target.value })} 
                  placeholder="e.g., Chicken Breast" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Serving Size</Label>
                  <Input 
                    value={foodDraft.serving_size} 
                    onChange={e => setFoodDraft({ ...foodDraft, serving_size: e.target.value })} 
                    placeholder="e.g., 100g" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={foodDraft.quantity} 
                    onChange={e => setFoodDraft({ ...foodDraft, quantity: e.target.value })} 
                    placeholder="1" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Calories</Label>
                <Input 
                  type="number" 
                  className="text-lg"
                  value={foodDraft.calories} 
                  onChange={e => setFoodDraft({ ...foodDraft, calories: e.target.value })} 
                  placeholder="0" 
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Protein (g)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={foodDraft.protein} 
                    onChange={e => setFoodDraft({ ...foodDraft, protein: e.target.value })} 
                    placeholder="0" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Carbs (g)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={foodDraft.carbs} 
                    onChange={e => setFoodDraft({ ...foodDraft, carbs: e.target.value })} 
                    placeholder="0" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fat (g)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={foodDraft.fat} 
                    onChange={e => setFoodDraft({ ...foodDraft, fat: e.target.value })} 
                    placeholder="0" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Fiber (g)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={foodDraft.fiber} 
                    onChange={e => setFoodDraft({ ...foodDraft, fiber: e.target.value })} 
                    placeholder="0" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sugar (g)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={foodDraft.sugar} 
                    onChange={e => setFoodDraft({ ...foodDraft, sugar: e.target.value })} 
                    placeholder="0" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sodium (mg)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={foodDraft.sodium} 
                    onChange={e => setFoodDraft({ ...foodDraft, sodium: e.target.value })} 
                    placeholder="0" 
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={cancelFoodEdit} className="flex-1">Cancel</Button>
            <Button 
              onClick={() => editingFoodId && selectedDay && saveFoodEdit(selectedDay.date, editingFoodId)} 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Workout Modal - Full Screen */}
      <Dialog open={!!editingWorkoutId && !!workoutDraft} onOpenChange={() => { if (editingWorkoutId) cancelWorkoutEdit(); }}>
        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Workout</DialogTitle>
          </DialogHeader>
          {workoutDraft && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-base">Workout Name</Label>
                <Input 
                  className="text-lg" 
                  value={workoutDraft.name} 
                  onChange={e => setWorkoutDraft({ ...workoutDraft, name: e.target.value })} 
                  placeholder="e.g., Bench Press" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input 
                    type="number" 
                    value={workoutDraft.duration} 
                    onChange={e => setWorkoutDraft({ ...workoutDraft, duration: e.target.value })} 
                    placeholder="30" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Intensity</Label>
                  <select 
                    className="w-full border rounded px-3 py-2"
                    value={workoutDraft.intensity} 
                    onChange={e => setWorkoutDraft({ ...workoutDraft, intensity: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Calories Burned</Label>
                <Input 
                  type="number" 
                  className="text-lg"
                  value={workoutDraft.caloriesBurned} 
                  onChange={e => setWorkoutDraft({ ...workoutDraft, caloriesBurned: e.target.value })} 
                  placeholder="0" 
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={cancelWorkoutEdit} className="flex-1">Cancel</Button>
            <Button 
              onClick={() => editingWorkoutId && selectedDay && saveWorkoutEdit(selectedDay.date, editingWorkoutId)} 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Food Dialog */}
      <Dialog open={addFoodDialogOpen} onOpenChange={setAddFoodDialogOpen}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Add Food to {selectedDay && format(parseISO(selectedDay.date), "MMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          
          {/* Favorite Foods Section */}
          {favorites.length > 0 && (
            <div className="mb-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                <Heart className="h-3 w-3 inline mr-1" />
                Favorite Foods
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {favorites.map((fav) => (
                  <Button
                    key={fav.id}
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start truncate"
                    onClick={() => {
                      if (selectedDay) {
                        addFoodToDate(selectedDay.date, {
                          food_name: fav.name,
                          calories: fav.calories || 0,
                          protein: fav.protein || 0,
                          carbs: fav.carbs || 0,
                          fat: fav.fat || 0,
                          quantity: 1,
                          serving_size: fav.serving_size || "serving",
                        });
                        setAddFoodDialogOpen(false);
                      }
                    }}
                  >
                    {fav.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4 py-4 border-t">
            <div className="space-y-2">
              <Label>Or Add Custom Food</Label>
              <Input
                placeholder="e.g., Chicken Breast"
                value={newFood.food_name}
                onChange={(e) => setNewFood({ ...newFood, food_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Calories</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newFood.calories}
                  onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Protein (g)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newFood.protein}
                  onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Carbs (g)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newFood.carbs}
                  onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fat (g)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newFood.fat}
                  onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Fiber (g)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newFood.fiber}
                  onChange={(e) => setNewFood({ ...newFood, fiber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sugar (g)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newFood.sugar}
                  onChange={(e) => setNewFood({ ...newFood, sugar: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sodium (mg)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newFood.sodium}
                  onChange={(e) => setNewFood({ ...newFood, sodium: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="1"
                  value={newFood.quantity}
                  onChange={(e) => setNewFood({ ...newFood, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Serving Size</Label>
                <Input
                  placeholder="serving"
                  value={newFood.serving_size}
                  onChange={(e) => setNewFood({ ...newFood, serving_size: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFoodDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (selectedDay && newFood.food_name.trim()) {
                  addFoodToDate(selectedDay.date, {
                    food_name: newFood.food_name,
                    calories: Number(newFood.calories) || 0,
                    protein: Number(newFood.protein) || 0,
                    carbs: Number(newFood.carbs) || 0,
                    fat: Number(newFood.fat) || 0,
                    fiber: Number(newFood.fiber) || 0,
                    sugar: Number(newFood.sugar) || 0,
                    sodium: Number(newFood.sodium) || 0,
                    quantity: Number(newFood.quantity) || 1,
                    serving_size: newFood.serving_size,
                  });
                  setNewFood({
                    food_name: "",
                    calories: "",
                    protein: "",
                    carbs: "",
                    fat: "",
                    fiber: "",
                    sugar: "",
                    sodium: "",
                    quantity: "1",
                    serving_size: "serving",
                  });
                  setAddFoodDialogOpen(false);
                }
              }}
              disabled={!newFood.food_name.trim()}
            >
              Add Food
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Workout Dialog */}
      <Dialog open={addWorkoutDialogOpen} onOpenChange={setAddWorkoutDialogOpen}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Add Workout to {selectedDay && format(parseISO(selectedDay.date), "MMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          
          {/* Saved Routines Section */}
          {routines.length > 0 && (
            <div className="mb-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                <Save className="h-3 w-3 inline mr-1" />
                Saved Routines
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {routines.map((routine) => (
                  <Button
                    key={routine.id}
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start"
                    onClick={() => {
                      if (selectedDay) {
                        // Add all exercises from the routine
                        routine.exercises.forEach((exercise) => {
                          const durationText = exercise.sets && exercise.reps 
                            ? `${exercise.sets}x${exercise.reps}${exercise.weight ? ` @ ${exercise.weight}lbs` : ''}`
                            : '';
                          
                          addWorkoutToDate(selectedDay.date, {
                            name: exercise.name + (durationText ? ` (${durationText})` : ''),
                            intensity: "Medium",
                          });
                        });
                        setAddWorkoutDialogOpen(false);
                        toast({ 
                          title: "Routine Added!", 
                          description: `${routine.name} (${routine.exercises.length} exercises) added to ${format(parseISO(selectedDay.date), "MMM d")}` 
                        });
                      }
                    }}
                  >
                    <span className="truncate">{routine.name}</span>
                    <span className="ml-auto text-muted-foreground">({routine.exercises.length})</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4 py-4 border-t">
            <div className="space-y-2">
              <Label>Or Add Custom Workout</Label>
              <Input
                placeholder="e.g., Bench Press"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Calories Burned</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newWorkout.caloriesBurned}
                  onChange={(e) => setNewWorkout({ ...newWorkout, caloriesBurned: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Intensity</Label>
              <select
                className="w-full border rounded px-3 py-2"
                value={newWorkout.intensity}
                onChange={(e) => setNewWorkout({ ...newWorkout, intensity: e.target.value as "Low" | "Medium" | "High" })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWorkoutDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (selectedDay && newWorkout.name.trim()) {
                  addWorkoutToDate(selectedDay.date, {
                    name: newWorkout.name,
                    duration: newWorkout.duration ? Number(newWorkout.duration) : undefined,
                    intensity: newWorkout.intensity,
                    caloriesBurned: newWorkout.caloriesBurned ? Number(newWorkout.caloriesBurned) : undefined,
                  });
                  setNewWorkout({
                    name: "",
                    duration: "",
                    intensity: "Medium",
                    caloriesBurned: "",
                  });
                  setAddWorkoutDialogOpen(false);
                }
              }}
              disabled={!newWorkout.name.trim()}
            >
              Add Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <JournalExportModal open={isExportOpen} onOpen={setIsExportOpen} payload={exportPayload} />
    </div>
  );
}
