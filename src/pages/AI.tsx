import { Target, Dumbbell, Calendar, Cpu, Zap, Brain, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, subDays } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TabType = 'groq' | 'mistral';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || "";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

const STORAGE_KEY = 'ai_analysis_cache';

const tabs: { id: TabType; name: string; icon: typeof Zap; color: string; border: string; bg: string }[] = [
  { id: 'groq', name: 'Groq', icon: Zap, color: 'text-orange-600', border: 'border-orange-200', bg: 'bg-orange-50' },
  { id: 'mistral', name: 'Mistral', icon: Brain, color: 'text-purple-600', border: 'border-purple-200', bg: 'bg-purple-50' },
];

interface AnalysisResult {
  summary: string;
  nutritionInsights: string[];
  hydrationStatus: string;
  weightTrend: string;
  workoutReview: string[];
  recommendations: string[];
  areasToImprove: string[];
  mealIdeas: string[];
}

interface ProviderState {
  analysis: AnalysisResult | null;
  lastTime: Date | null;
  loading: boolean;
  error: string | null;
}

function buildPrompt(days: any[]): string {
  const totalCalories = days.reduce((sum, d) => sum + d.calories, 0);
  const totalProtein = days.reduce((sum, d) => sum + d.protein, 0);
  const totalCarbs = days.reduce((sum, d) => sum + d.carbs, 0);
  const totalFat = days.reduce((sum, d) => sum + d.fat, 0);
  const totalFiber = days.reduce((sum, d) => sum + (d.fiber || 0), 0);
  const totalSugar = days.reduce((sum, d) => sum + (d.sugar || 0), 0);
  const totalSodium = days.reduce((sum, d) => sum + (d.sodium || 0), 0);
  const totalWater = days.reduce((sum, d) => sum + (d.water || 0), 0);
  const totalWorkouts = days.reduce((sum, d) => sum + (d.workouts?.length || 0), 0);
  const totalFoods = days.reduce((sum, d) => sum + (d.foods?.length || 0), 0);
  const totalWorkoutCalories = days.reduce((sum, d) => sum + (d.workoutCalories || 0), 0);
  const totalWorkoutMinutes = days.reduce((sum, d) => sum + (d.workoutMinutes || 0), 0);
  
  const avgCalories = Math.round(totalCalories / days.length);
  const avgProtein = Math.round(totalProtein / days.length);
  const avgCarbs = Math.round(totalCarbs / days.length);
  const avgFat = Math.round(totalFat / days.length);
  const avgFiber = Math.round(totalFiber / days.length);
  const avgSugar = Math.round(totalSugar / days.length);
  const avgSodium = Math.round(totalSodium / days.length);
  const avgWater = Math.round(totalWater / days.length);

  const weights = days.filter(d => d.weight).map(d => d.weight);
  const weightInfo = weights.length > 0 
    ? `Weight: ${weights[0]} → ${weights[weights.length-1]} lbs (change: ${(weights[weights.length-1] - weights[0]).toFixed(1)} lbs)`
    : 'No weight data';

  const uniqueFoods = [...new Set(days.flatMap(d => d.foods?.map((f: any) => f.food_name) || []))];

  return `Analyze this comprehensive nutrition and fitness data over ${days.length} days.

=== NUTRITION SUMMARY ===
Daily Averages:
- Calories: ${avgCalories} (total: ${totalCalories})
- Protein: ${avgProtein}g (total: ${totalProtein}g)
- Carbs: ${avgCarbs}g (total: ${totalCarbs}g)
- Fat: ${avgFat}g (total: ${totalFat}g)
- Fiber: ${avgFiber}g/day (goal: 25-35g)
- Sugar: ${avgSugar}g/day (limit: <50g)
- Sodium: ${avgSodium}mg/day (limit: <2300mg)

=== HYDRATION ===
- Total water: ${totalWater} oz
- Daily average: ${avgWater} oz (goal: 64-128 oz)

=== WEIGHT TRACKING ===
${weightInfo}

=== WORKOUT SUMMARY ===
- Total workouts: ${totalWorkouts}
- Total workout time: ${totalWorkoutMinutes} minutes
- Calories burned: ${totalWorkoutCalories} cal
- Workout frequency: ${(totalWorkouts / days.length).toFixed(1)} per day

=== FOOD VARIETY ===
- Total foods logged: ${totalFoods}
- Unique foods: ${uniqueFoods.length}
- Sample foods: ${uniqueFoods.slice(0, 15).join(', ')}

=== DAILY BREAKDOWN ===
${days.map(d => {
  const dayName = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });
  return `${d.date} (${dayName}): ${d.calories} cal | ${d.protein}g protein | ${d.fiber}g fiber | ${d.water}oz water | ${d.weight ? d.weight + 'lbs' : 'no weight'} | ${d.foods?.length || 0} meals | ${d.workouts?.length || 0} workouts (${d.workoutMinutes}min, ${d.workoutCalories}cal burned)`;
}).join('\n')}

=== CARDIO DETAILS ===
${days.map(d => {
  const cardioWorkouts = d.workouts?.filter((w: any) => w.type === 'cardio') || [];
  if (cardioWorkouts.length === 0) return null;
  return `${d.date}: ${cardioWorkouts.map((w: any) => `${w.name} (${w.duration}min, ${w.caloriesBurned}cal)`).join(', ')}`;
}).filter(Boolean).join('\n') || 'No cardio logged'}

Provide a helpful analysis. Respond in this exact format:

SUMMARY: [1-2 sentences max]

NUTRITION_INSIGHTS:
- [insight about calories/macros]
- [insight about fiber/sugar/sodium]
- [insight about protein distribution]

HYDRATION_STATUS: [water intake assessment]

WEIGHT_TREND: [weight trend analysis]

WORKOUT_REVIEW:
- [workout frequency/volume insight]
- [cardio assessment]

RECOMMENDATIONS:
- [top priority recommendation]
- [second recommendation]
- [third recommendation]

AREAS_TO_IMPROVE:
- [area 1]
- [area 2]

MEAL_IDEAS:
- [meal idea 1]
- [meal idea 2]`;
}

function parseResponse(text: string): AnalysisResult {
  const clean = (s: string) => s.replace(/\*\*/g, '').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  
  const getSection = (label: string): string => {
    const patterns = [
      new RegExp(`${label}[:\\s\\*]*(.*?)(?=\\n\\s*\\*?[A-Z_]+:|$)`, 'is'),
      new RegExp(`\\*\\*${label}\\*\\*[:\\s]*(.*?)(?=\\n\\s*\\*?\\*?[A-Z_]+:|$)`, 'is'),
    ];
    for (const regex of patterns) {
      const match = text.match(regex);
      if (match && match[1]) return clean(match[1]);
    }
    return "";
  };
  
  const getBullets = (section: string): string[] => {
    return section.split(/\n/)
      .map(line => line.replace(/^[-•*\d.]\s*/, "").replace(/^\*+|\*+$/g, "").trim())
      .filter(line => line.length > 5 && !line.match(/^[A-Z_]+:$/));
  };

  return {
    summary: (() => {
      const s = getSection("SUMMARY");
      return s.length > 150 ? s.substring(0, 147) + '...' : s;
    })(),
    nutritionInsights: getBullets(getSection("NUTRITION_INSIGHTS")).slice(0, 4),
    hydrationStatus: getSection("HYDRATION_STATUS"),
    weightTrend: getSection("WEIGHT_TREND"),
    workoutReview: getBullets(getSection("WORKOUT_REVIEW")).slice(0, 3),
    recommendations: getBullets(getSection("RECOMMENDATIONS")).slice(0, 4),
    areasToImprove: getBullets(getSection("AREAS_TO_IMPROVE")).slice(0, 3),
    mealIdeas: getBullets(getSection("MEAL_IDEAS")).slice(0, 4),
  };
}

export default function AI() {
  const [activeTab, setActiveTab] = useState<TabType>('groq');
  const [states, setStates] = useState<Record<TabType, ProviderState>>({
    groq: { analysis: null, lastTime: null, loading: false, error: null },
    mistral: { analysis: null, lastTime: null, loading: false, error: null },
  });
  const [dataStats, setDataStats] = useState({ totalFoods: 0, totalWorkouts: 0, days: 7 });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdminBypass = user?.id === "admin-bypass-id";

  // Load saved analyses from localStorage on mount
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.groq || parsed.mistral) {
          setStates(prev => ({
            groq: parsed.groq ? { 
              analysis: parsed.groq.analysis, 
              lastTime: parsed.groq.lastTime ? new Date(parsed.groq.lastTime) : null, 
              loading: false, 
              error: null 
            } : prev.groq,
            mistral: parsed.mistral ? { 
              analysis: parsed.mistral.analysis, 
              lastTime: parsed.mistral.lastTime ? new Date(parsed.mistral.lastTime) : null, 
              loading: false, 
              error: null 
            } : prev.mistral,
          }));
        }
      } catch (e) {
        console.error('Error loading saved AI analysis:', e);
      }
    }
  }, [user]);

  // Save analyses to localStorage when they change
  const saveToStorage = (newStates: Record<TabType, ProviderState>) => {
    if (!user) return;
    const toSave = {
      groq: newStates.groq.analysis ? {
        analysis: newStates.groq.analysis,
        lastTime: newStates.groq.lastTime?.toISOString()
      } : null,
      mistral: newStates.mistral.analysis ? {
        analysis: newStates.mistral.analysis,
        lastTime: newStates.mistral.lastTime?.toISOString()
      } : null,
    };
    localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(toSave));
  };

  const getData = async () => {
    if (!user) return [];
    
    // Debug: show all water keys in localStorage
    const allKeys = Object.keys(localStorage);
    const waterKeys = allKeys.filter(k => k.includes('journal_water'));
    console.log('All water keys in localStorage:', waterKeys);
    console.log('Current user.id:', user.id);
    
    const data: any[] = [];
    const startDate = format(subDays(new Date(), 6), "yyyy-MM-dd");
    
    // Fetch all food data once for non-admin users
    let foodByDate: Record<string, any[]> = {};
    if (!isAdminBypass) {
      const { data: foodRows } = await supabase
        .from("food_log")
        .select("*")
        .eq("user_id", user.id)
        .gte("logged_date", startDate);
      
      if (foodRows) {
        foodRows.forEach((item: any) => {
          if (!foodByDate[item.logged_date]) foodByDate[item.logged_date] = [];
          foodByDate[item.logged_date].push(item);
        });
      }
    }
    
    for (let i = 0; i < 7; i++) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "yyyy-MM-dd");
      
      let foods: any[] = [];
      let workouts: any[] = [];
      let weight: number | null = null;
      let water: number = 0;
      
      // Get food data
      if (isAdminBypass) {
        const foodData = localStorage.getItem(`food_log_${user.id}_${dateStr}`);
        if (foodData) try { foods = JSON.parse(foodData); } catch {}
      } else {
        foods = foodByDate[dateStr] || [];
      }
      
      // Get workouts
      const workoutData = localStorage.getItem(`workout_log_${user.id}_${dateStr}`);
      const cardioData = localStorage.getItem(`cardio_log_${user.id}_${dateStr}`);
      
      if (workoutData) {
        try {
          const parsed = JSON.parse(workoutData);
          workouts.push(...parsed.map((w: any) => ({ ...w, type: 'strength' })));
        } catch {}
      }
      if (cardioData) {
        try {
          const parsed = JSON.parse(cardioData);
          workouts.push(...parsed.map((c: any) => ({ 
            name: c.name, 
            duration: c.duration, 
            caloriesBurned: c.calories,
            intensity: c.intensity,
            type: 'cardio' 
          })));
        } catch {}
      }
      
      // Get weight and water
      const weightKey = `journal_weight_${user.id}_${dateStr}`;
      const waterKey = `journal_water_${user.id}_${dateStr}`;
      const weightData = localStorage.getItem(weightKey);
      const waterData = localStorage.getItem(waterKey);
      
      console.log(`[${dateStr}] Looking for key: ${waterKey}`);
      console.log(`[${dateStr}] Water raw:`, waterData);
      console.log(`[${dateStr}] User ID:`, user.id);
      
      if (weightData) weight = Number(weightData);
      if (waterData) water = Number(waterData);
      
      // Calculate totals
      const totalCalories = foods.reduce((s, f) => s + (f.calories * f.quantity || 0), 0);
      const totalProtein = foods.reduce((s, f) => s + (f.protein * f.quantity || 0), 0);
      const totalCarbs = foods.reduce((s, f) => s + (f.carbs * f.quantity || 0), 0);
      const totalFat = foods.reduce((s, f) => s + (f.fat * f.quantity || 0), 0);
      const totalFiber = foods.reduce((s, f) => s + ((f.fiber || 0) * f.quantity || 0), 0);
      const totalSugar = foods.reduce((s, f) => s + ((f.sugar || 0) * f.quantity || 0), 0);
      const totalSodium = foods.reduce((s, f) => s + ((f.sodium || 0) * f.quantity || 0), 0);
      const workoutCalories = workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
      const workoutMinutes = workouts.reduce((s, w) => s + (w.duration || 0), 0);
      
      console.log(`[${dateStr}] foods:${foods.length}, workouts:${workouts.length}, water:${water}, weight:${weight}`);
      
      if (foods.length > 0 || workouts.length > 0 || water > 0 || weight) {
        data.push({
          date: dateStr,
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat,
          fiber: Math.round(totalFiber),
          sugar: Math.round(totalSugar),
          sodium: Math.round(totalSodium),
          water: Math.round(water),
          weight,
          foods,
          workouts,
          workoutCalories: Math.round(workoutCalories),
          workoutMinutes: Math.round(workoutMinutes),
        });
      }
    }
    
    console.log('Final data for AI:', data);
    return data;
  };

  const callAPI = async (provider: TabType, prompt: string): Promise<AnalysisResult> => {
    if (provider === 'groq') {
      if (!GROQ_API_KEY) throw new Error("Groq API key not configured");
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      return parseResponse(json.choices?.[0]?.message?.content || "");
    }
    
    if (provider === 'mistral') {
      if (!MISTRAL_API_KEY) throw new Error("Mistral API key not configured");
      const res = await fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${MISTRAL_API_KEY}` },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      return parseResponse(json.choices?.[0]?.message?.content || "");
    }
    
    throw new Error("Unknown provider");
  };

  const runAnalysis = async (provider: TabType) => {
    setStates(prev => ({ ...prev, [provider]: { ...prev[provider], loading: true, error: null } }));
    
    try {
      const data = await getData();
      
      const totalFoods = data.reduce((s, d) => s + (d.foods?.length || 0), 0);
      const totalWorkouts = data.reduce((s, d) => s + (d.workouts?.length || 0), 0);
      setDataStats({ totalFoods, totalWorkouts, days: data.length || 7 });
      
      if (totalFoods === 0 && totalWorkouts === 0) {
        throw new Error("No data to analyze. Please log some food or workouts first.");
      }
      
      const prompt = buildPrompt(data);
      const analysis = await callAPI(provider, prompt);
      
      setStates(prev => {
        const newStates = { 
          ...prev, 
          [provider]: { analysis, lastTime: new Date(), loading: false, error: null } 
        };
        saveToStorage(newStates);
        return newStates;
      });
      
      toast({ title: `${tabs.find(t => t.id === provider)?.name} analysis complete!` });
    } catch (error) {
      setStates(prev => ({ 
        ...prev, 
        [provider]: { ...prev[provider], loading: false, error: error instanceof Error ? error.message : 'Unknown error' } 
      }));
      toast({ variant: "destructive", title: "Analysis failed", description: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const current = states[activeTab];
  const config = tabs.find(t => t.id === activeTab)!;
  const Icon = config.icon;

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <header className="mb-4 flex items-center gap-2">
        <Cpu className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-bold font-display">AI Analysis</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                activeTab === tab.id
                  ? `${tab.bg} ${tab.border} ${tab.color}`
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              )}
            >
              <TabIcon className="h-4 w-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="bg-muted/50">
          <CardContent className="pt-3 pb-3 text-center">
            <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{dataStats.days}</p>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="pt-3 pb-3 text-center">
            <Dumbbell className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{dataStats.totalWorkouts}</p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="pt-3 pb-3 text-center">
            <Target className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{dataStats.totalFoods}</p>
            <p className="text-xs text-muted-foreground">Foods</p>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Card */}
      <Card className={`mb-6 ${config.border}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${config.color}`} />
              <CardTitle className={`text-lg ${config.color}`}>{config.name} Analysis</CardTitle>
            </div>
            <Button size="sm" onClick={() => runAnalysis(activeTab)} disabled={current.loading}>
              {current.loading ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Icon className="h-4 w-4 mr-1" />
              )}
              {current.loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          {current.lastTime && (
            <p className="text-xs text-muted-foreground mt-2">
              Last: {formatDistanceToNow(current.lastTime, { addSuffix: true })}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {current.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {current.error}
            </div>
          )}
          
          {!current.analysis && !current.loading && !current.error && (
            <div className="text-center py-6 text-muted-foreground">
              <Icon className={`h-10 w-10 mx-auto mb-2 ${config.color} opacity-50`} />
              <p>Click "Analyze" to get insights from {config.name}</p>
            </div>
          )}
          
          {current.analysis && (
            <>
              {/* Summary */}
              <div className={`rounded-lg p-3 ${config.bg} border`}>
                <p className="text-sm font-medium">{current.analysis.summary}</p>
              </div>

              {/* Nutrition Insights */}
              {current.analysis.nutritionInsights?.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <h4 className="text-xs font-semibold text-green-800 uppercase mb-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Nutrition Insights
                  </h4>
                  <ul className="space-y-1">
                    {current.analysis.nutritionInsights.map((i, idx) => (
                      <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                        <span>•</span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hydration & Weight Row */}
              <div className="grid grid-cols-2 gap-2">
                {current.analysis.hydrationStatus && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h4 className="text-xs font-semibold text-blue-800 uppercase mb-1">Hydration</h4>
                    <p className="text-xs text-blue-700">{current.analysis.hydrationStatus}</p>
                  </div>
                )}
                {current.analysis.weightTrend && (
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h4 className="text-xs font-semibold text-purple-800 uppercase mb-1">Weight Trend</h4>
                    <p className="text-xs text-purple-700">{current.analysis.weightTrend}</p>
                  </div>
                )}
              </div>

              {/* Workout Review */}
              {current.analysis.workoutReview?.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <h4 className="text-xs font-semibold text-orange-800 uppercase mb-2 flex items-center gap-1">
                    <Dumbbell className="h-3 w-3" /> Workout Review
                  </h4>
                  <ul className="space-y-1">
                    {current.analysis.workoutReview.map((w, idx) => (
                      <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                        <span>•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {current.analysis.recommendations?.length > 0 && (
                <div className="pt-2 border-t">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Recommendations</h4>
                  <ul className="space-y-1.5">
                    {current.analysis.recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas to Improve */}
              {current.analysis.areasToImprove?.length > 0 && (
                <div className="pt-2 border-t">
                  <h4 className="text-xs font-semibold text-amber-700 uppercase mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Areas to Improve
                  </h4>
                  <ul className="space-y-1">
                    {current.analysis.areasToImprove.map((w, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-1.5">
                        <span>→</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meal Ideas */}
              {current.analysis.mealIdeas?.length > 0 && (
                <div className="pt-2 border-t">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Meal Ideas</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {current.analysis.mealIdeas.map((m, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
