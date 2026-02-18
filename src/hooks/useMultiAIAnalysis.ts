// src/hooks/useMultiAIAnalysis.ts
// Multi-AI analysis hook using Gemini, Groq, and Mistral

import { useEffect, useState, useCallback } from 'react';
import { multiAIAnalysis, MultiAIResult } from '@/services/multiAI';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisSchedule {
  lastAnalysisTime: string;
  lastAnalysisDate: string;
  result: MultiAIResult | null;
  hasNewData: boolean;
}

const ANALYSIS_DAYS = 7;
const STORAGE_KEY = 'multi_ai_analysis';
const PROGRAMS_KEY = 'fitness_programs';

interface ProgramGoal {
  type: 'bulking' | 'cutting' | null;
  targetCalories: number | null;
  name: string | null;
}

export function useMultiAIAnalysis() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [latestResult, setLatestResult] = useState<MultiAIResult | null>(null);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nextAnalysisTime, setNextAnalysisTime] = useState<Date | null>(null);
  const [dataStats, setDataStats] = useState<{ totalWorkouts: number; totalFoods: number } | null>(null);

  const isAdminBypass = user?.id === "admin-bypass-id";

  const getActiveProgramGoal = useCallback((): ProgramGoal => {
    try {
      const stored = localStorage.getItem(PROGRAMS_KEY);
      if (!stored) return { type: null, targetCalories: null, name: null };
      
      const programs = JSON.parse(stored);
      const today = new Date();
      
      const activeProgram = programs.find((p: any) => {
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        return today >= start && today <= end;
      });
      
      if (activeProgram) {
        return {
          type: activeProgram.type,
          targetCalories: activeProgram.targetCalories,
          name: activeProgram.name
        };
      }
    } catch (e) {
      console.error('Error getting program goal:', e);
    }
    
    return { type: null, targetCalories: null, name: null };
  }, []);

  const getMultiDayData = useCallback(async () => {
    if (!user) return [];
    
    const data: any[] = [];
    const goal = getActiveProgramGoal();
    const startDate = format(subDays(new Date(), ANALYSIS_DAYS - 1), "yyyy-MM-dd");
    
    if (isAdminBypass) {
      for (let i = 0; i < ANALYSIS_DAYS; i++) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, "yyyy-MM-dd");
        
        let foods: any[] = [];
        let workouts: any[] = [];
        let cardioSessions: any[] = [];
        
        const foodLogKey = `food_log_${user.id}_${dateStr}`;
        const foodData = localStorage.getItem(foodLogKey);
        if (foodData) {
          try { foods = JSON.parse(foodData); } catch {}
        }
        
        const workoutKey = `workout_log_${user.id}_${dateStr}`;
        const workoutData = localStorage.getItem(workoutKey);
        if (workoutData) {
          try { workouts = JSON.parse(workoutData); } catch {}
        }
        
        const cardioKey = `cardio_log_${user.id}_${dateStr}`;
        const cardioData = localStorage.getItem(cardioKey);
        if (cardioData) {
          try { cardioSessions = JSON.parse(cardioData); } catch {}
        }
        
        const allWorkouts = [
          ...workouts.map((w: any) => ({ ...w, type: 'strength' })),
          ...cardioSessions.map((c: any) => ({ 
            name: `${c.icon} ${c.name}`,
            duration: c.duration,
            intensity: c.intensity,
            caloriesBurned: c.calories,
            type: 'cardio'
          }))
        ];
        
        if (foods.length > 0 || allWorkouts.length > 0) {
          const totalCalories = foods.reduce((sum: number, item: any) => sum + (item.calories * item.quantity || 0), 0);
          const totalProtein = foods.reduce((sum: number, item: any) => sum + (item.protein * item.quantity || 0), 0);
          const totalCarbs = foods.reduce((sum: number, item: any) => sum + (item.carbs * item.quantity || 0), 0);
          const totalFat = foods.reduce((sum: number, item: any) => sum + (item.fat * item.quantity || 0), 0);
          const totalFiber = foods.reduce((sum: number, item: any) => sum + ((item.fiber || 0) * item.quantity || 0), 0);
          const totalSugar = foods.reduce((sum: number, item: any) => sum + ((item.sugar || 0) * item.quantity || 0), 0);
          const totalSodium = foods.reduce((sum: number, item: any) => sum + ((item.sodium || 0) * item.quantity || 0), 0);
          
          const weightKey = `journal_weight_${user.id}_${dateStr}`;
          const waterKey = `journal_water_${user.id}_${dateStr}`;
          const weight = localStorage.getItem(weightKey);
          const water = localStorage.getItem(waterKey);
          
          data.push({
            date: dateStr,
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat,
            fiber: totalFiber,
            sugar: totalSugar,
            sodium: totalSodium,
            weight: weight ? Number(weight) : undefined,
            water: water ? Number(water) : 0,
            foods,
            workouts: allWorkouts,
            programGoal: i === 0 && (goal.type || goal.targetCalories) ? goal : undefined
          });
        }
      }
    } else {
      try {
        const { data: foodRows } = await supabase
          .from("food_log")
          .select("*")
          .eq("user_id", user.id)
          .gte("logged_date", startDate)
          .order("logged_date", { ascending: false });
        
        const foodByDate: Record<string, any[]> = {};
        if (foodRows) {
          foodRows.forEach((item: any) => {
            if (!foodByDate[item.logged_date]) foodByDate[item.logged_date] = [];
            foodByDate[item.logged_date].push({
              food_name: item.food_name,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
              fiber: item.fiber,
              sugar: item.sugar,
              sodium: item.sodium,
              quantity: item.quantity
            });
          });
        }
        
        for (let i = 0; i < ANALYSIS_DAYS; i++) {
          const date = subDays(new Date(), i);
          const dateStr = format(date, "yyyy-MM-dd");
          
          const foods = foodByDate[dateStr] || [];
          
          const workoutKey = `workout_log_${user.id}_${dateStr}`;
          const workoutData = localStorage.getItem(workoutKey);
          let workouts: any[] = [];
          if (workoutData) {
            try { workouts = JSON.parse(workoutData); } catch {}
          }
          
          const cardioKey = `cardio_log_${user.id}_${dateStr}`;
          const cardioData = localStorage.getItem(cardioKey);
          let cardioSessions: any[] = [];
          if (cardioData) {
            try { cardioSessions = JSON.parse(cardioData); } catch {}
          }
          
          const allWorkouts = [
            ...workouts.map((w: any) => ({ ...w, type: 'strength' })),
            ...cardioSessions.map((c: any) => ({ 
              name: `${c.icon} ${c.name}`,
              duration: c.duration,
              intensity: c.intensity,
              caloriesBurned: c.calories,
              type: 'cardio'
            }))
          ];
          
          if (foods.length > 0 || allWorkouts.length > 0) {
            const totalCalories = foods.reduce((sum: number, item: any) => sum + (item.calories * item.quantity || 0), 0);
            const totalProtein = foods.reduce((sum: number, item: any) => sum + (item.protein * item.quantity || 0), 0);
            const totalCarbs = foods.reduce((sum: number, item: any) => sum + (item.carbs * item.quantity || 0), 0);
            const totalFat = foods.reduce((sum: number, item: any) => sum + (item.fat * item.quantity || 0), 0);
            const totalFiber = foods.reduce((sum: number, item: any) => sum + ((item.fiber || 0) * item.quantity || 0), 0);
            const totalSugar = foods.reduce((sum: number, item: any) => sum + ((item.sugar || 0) * item.quantity || 0), 0);
            const totalSodium = foods.reduce((sum: number, item: any) => sum + ((item.sodium || 0) * item.quantity || 0), 0);
            
            const weightKey = `journal_weight_${user.id}_${dateStr}`;
            const waterKey = `journal_water_${user.id}_${dateStr}`;
            const weight = localStorage.getItem(weightKey);
            const water = localStorage.getItem(waterKey);
            
            data.push({
              date: dateStr,
              calories: totalCalories,
              protein: totalProtein,
              carbs: totalCarbs,
              fat: totalFat,
              fiber: totalFiber,
              sugar: totalSugar,
              sodium: totalSodium,
              weight: weight ? Number(weight) : undefined,
              water: water ? Number(water) : 0,
              foods,
              workouts: allWorkouts,
              programGoal: i === 0 && (goal.type || goal.targetCalories) ? goal : undefined
            });
          }
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    }
    
    return data;
  }, [user, isAdminBypass, getActiveProgramGoal]);

  const runAnalysis = useCallback(async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Not logged in" });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const data = await getMultiDayData();
      
      const totalFoods = data.reduce((sum, d) => sum + (d.foods?.length || 0), 0);
      const totalWorkouts = data.reduce((sum, d) => sum + (d.workouts?.length || 0), 0);
      setDataStats({ totalFoods, totalWorkouts });
      
      if (totalFoods === 0 && totalWorkouts === 0) {
        toast({
          variant: "destructive",
          title: "No data",
          description: "Please log some food or workouts first"
        });
        setIsAnalyzing(false);
        return;
      }
      
      const result = await multiAIAnalysis(data);
      
      const schedule: AnalysisSchedule = {
        lastAnalysisTime: new Date().toISOString(),
        lastAnalysisDate: format(new Date(), "yyyy-MM-dd"),
        result,
        hasNewData: false
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
      setLatestResult(result);
      setLastAnalysisTime(new Date());
      
      const successCount = [result.gemini, result.groq, result.mistral].filter(r => r?.success).length;
      
      toast({
        title: `${successCount}/3 AI Models Complete!`,
        description: `Analysis finished in ${result.totalLatency}ms`,
      });
    } catch (error) {
      console.error('Multi-AI analysis failed:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, getMultiDayData, toast]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const schedule: AnalysisSchedule = JSON.parse(stored);
        if (schedule.lastAnalysisDate === format(new Date(), "yyyy-MM-dd")) {
          setLatestResult(schedule.result);
          setLastAnalysisTime(new Date(schedule.lastAnalysisTime));
        }
      } catch {}
    }
  }, []);

  return {
    latestResult,
    lastAnalysisTime,
    isAnalyzing,
    runAnalysis,
    analysisDays: ANALYSIS_DAYS,
    dataStats
  };
}
