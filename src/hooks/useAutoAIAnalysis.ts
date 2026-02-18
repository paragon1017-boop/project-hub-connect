// src/hooks/useAutoAIAnalysis.ts
// Automatic AI analysis every 2 hours from 10 AM to midnight

import { useEffect, useState, useCallback } from 'react';
import { analyzeNutritionData, AIAnalysisResult } from '@/services/ai';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisSchedule {
  lastAnalysisTime: string;
  lastAnalysisDate: string;
  result: AIAnalysisResult | null;
  hasNewData: boolean;
}

interface ProgramGoal {
  type: 'bulking' | 'cutting' | null;
  targetCalories: number | null;
  name: string | null;
}

const ANALYSIS_DAYS = 7;
const ANALYSIS_TIMES = [10, 12, 14, 16, 18, 20, 22, 0];
const STORAGE_KEY = 'auto_ai_analysis';
const PROGRAMS_KEY = 'fitness_programs';

export function useAutoAIAnalysis() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [latestAnalysis, setLatestAnalysis] = useState<AIAnalysisResult | null>(null);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nextAnalysisTime, setNextAnalysisTime] = useState<Date | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [programGoal, setProgramGoal] = useState<ProgramGoal>({ type: null, targetCalories: null, name: null });
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

  const getMultiDayNutritionData = useCallback(async () => {
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
          try {
            foods = JSON.parse(foodData);
          } catch {}
        }
        
        const workoutKey = `workout_log_${user.id}_${dateStr}`;
        const workoutData = localStorage.getItem(workoutKey);
        if (workoutData) {
          try {
            workouts = JSON.parse(workoutData);
          } catch {}
        }
        
        const cardioKey = `cardio_log_${user.id}_${dateStr}`;
        const cardioData = localStorage.getItem(cardioKey);
        if (cardioData) {
          try {
            cardioSessions = JSON.parse(cardioData);
          } catch {}
        }
        
        const allWorkouts = [
          ...workouts.map((w: any) => ({
            name: w.name,
            duration: w.duration,
            intensity: w.intensity,
            caloriesBurned: w.caloriesBurned,
            type: 'strength'
          })),
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
            foods: foods,
            workouts: allWorkouts
          });
        }
      }
    } else {
      try {
        const { data: foodRows, error } = await supabase
          .from("food_log")
          .select("*")
          .eq("user_id", user.id)
          .gte("logged_date", startDate)
          .order("logged_date", { ascending: false });
        
        if (error) {
          console.error('Supabase query error:', error);
        }
        
        console.log('Fetched food rows:', foodRows?.length, 'for user', user.id, 'from', startDate);
        
        const foodByDate: Record<string, any[]> = {};
        if (foodRows) {
          foodRows.forEach((item: any) => {
            if (!foodByDate[item.logged_date]) {
              foodByDate[item.logged_date] = [];
            }
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
            try {
              workouts = JSON.parse(workoutData);
            } catch {}
          }
          
          const cardioKey = `cardio_log_${user.id}_${dateStr}`;
          const cardioData = localStorage.getItem(cardioKey);
          let cardioSessions: any[] = [];
          if (cardioData) {
            try {
              cardioSessions = JSON.parse(cardioData);
            } catch {}
          }
          
          const allWorkouts = [
            ...workouts.map((w: any) => ({
              name: w.name,
              duration: w.duration,
              intensity: w.intensity,
              caloriesBurned: w.caloriesBurned,
              type: 'strength'
            })),
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
              foods: foods,
              workouts: allWorkouts
            });
          }
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    }
    
    if (data.length > 0 && (goal.type || goal.targetCalories)) {
      data[0].programGoal = goal;
    }
    
    return data;
  }, [user, isAdminBypass, getActiveProgramGoal]);

  // Calculate next analysis time
  const getNextAnalysisTime = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Find next scheduled time
    for (const hour of ANALYSIS_TIMES) {
      if (hour > currentHour || (hour === 0 && currentHour >= 22)) {
        const nextTime = new Date(now);
        nextTime.setHours(hour, 0, 0, 0);
        if (hour === 0 && currentHour >= 22) {
          nextTime.setDate(nextTime.getDate() + 1);
        }
        return nextTime;
      }
    }
    
    // If past all times, next is 10 AM tomorrow
    const nextTime = new Date(now);
    nextTime.setDate(nextTime.getDate() + 1);
    nextTime.setHours(10, 0, 0, 0);
    return nextTime;
  }, []);

  // Check if analysis is due
  const isAnalysisDue = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;
    
    const schedule: AnalysisSchedule = JSON.parse(stored);
    const lastAnalysis = new Date(schedule.lastAnalysisTime);
    const now = new Date();
    const hoursSinceLastAnalysis = (now.getTime() - lastAnalysis.getTime()) / (1000 * 60 * 60);
    
    // Analysis is due if it's been 2+ hours and we're in the 10 AM - midnight window
    const currentHour = now.getHours();
    const inActiveWindow = currentHour >= 10 || currentHour === 0;
    
    return hoursSinceLastAnalysis >= 2 && inActiveWindow;
  }, []);

  // Check if there's new data since last analysis
  const hasNewDataSinceLastAnalysis = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;
    
    const schedule: AnalysisSchedule = JSON.parse(stored);
    const lastAnalysis = new Date(schedule.lastAnalysisTime);
    
    // Check food log modification time
    if (user) {
      const todayKey = format(new Date(), "yyyy-MM-dd");
      const foodLogKey = `food_log_${user.id}_${todayKey}`;
      const lastFoodUpdate = localStorage.getItem(`${foodLogKey}_lastupdate`);
      
      if (lastFoodUpdate) {
        const lastUpdateTime = new Date(lastFoodUpdate);
        return lastUpdateTime > lastAnalysis;
      }
    }
    
    return schedule.hasNewData !== false;
  }, [user]);

  // Run analysis
  const runAnalysis = useCallback(async (force = false) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "Please log in to use AI analysis",
      });
      return;
    }
    
    // Check if we should analyze
    if (!force && !isAnalysisDue()) {
      console.log('Analysis not due yet');
      return;
    }
    
    // Check if there's new data
    if (!force && !hasNewDataSinceLastAnalysis()) {
      console.log('No new data since last analysis');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const data = await getMultiDayNutritionData();
      const goal = getActiveProgramGoal();
      setProgramGoal(goal);
      
      if (data.length === 0) {
        console.log('No food data to analyze');
        setIsAnalyzing(false);
        toast({
          variant: "destructive",
          title: "No data to analyze",
          description: "Please log some food first before running AI analysis",
        });
        return;
      }
      
      const totalFoods = data.reduce((sum, d) => sum + (d.foods?.length || 0), 0);
      const totalWorkouts = data.reduce((sum, d) => sum + (d.workouts?.length || 0), 0);
      setDataStats({ totalFoods, totalWorkouts });
      
      if (totalFoods === 0 && totalWorkouts === 0) {
        console.log('No data to analyze');
        setIsAnalyzing(false);
        toast({
          variant: "destructive",
          title: "No data to analyze",
          description: "Please log some food or workouts first before running AI analysis",
        });
        return;
      }
      
      const result = await analyzeNutritionData(data);
      
      // Store analysis
      const schedule: AnalysisSchedule = {
        lastAnalysisTime: new Date().toISOString(),
        lastAnalysisDate: format(new Date(), "yyyy-MM-dd"),
        result: result,
        hasNewData: false
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
      setLatestAnalysis(result);
      setLastAnalysisTime(new Date());
      setNextAnalysisTime(getNextAnalysisTime());
      
      console.log('AI Analysis completed at', new Date().toLocaleTimeString());
      
      toast({
        title: "AI Analysis Complete!",
        description: "Your nutrition insights are ready to view",
      });
    } catch (error) {
      console.error('Auto analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAnalysisError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: `Error: ${errorMessage}. Please try again.`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, isAnalysisDue, hasNewDataSinceLastAnalysis, getMultiDayNutritionData, getNextAnalysisTime, toast]);

  // Load stored analysis on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const schedule: AnalysisSchedule = JSON.parse(stored);
        
        // Only use stored result if it's from today
        if (schedule.lastAnalysisDate === format(new Date(), "yyyy-MM-dd")) {
          setLatestAnalysis(schedule.result);
          setLastAnalysisTime(new Date(schedule.lastAnalysisTime));
        }
        
        setNextAnalysisTime(getNextAnalysisTime());
      } catch (e) {
        console.error('Error loading stored analysis:', e);
      }
    }
    
    // Run analysis if due when app opens
    runAnalysis();
  }, [runAnalysis, getNextAnalysisTime]);

  // Set up interval to check for analysis every minute
  useEffect(() => {
    const interval = setInterval(() => {
      runAnalysis();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [runAnalysis]);

  // Mark that new data has been added
  const markNewData = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const schedule: AnalysisSchedule = JSON.parse(stored);
      schedule.hasNewData = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    }
    
    // Also store last update time for food log
    if (user) {
      const todayKey = format(new Date(), "yyyy-MM-dd");
      const foodLogKey = `food_log_${user.id}_${todayKey}`;
      localStorage.setItem(`${foodLogKey}_lastupdate`, new Date().toISOString());
    }
  }, [user]);

  return {
    latestAnalysis,
    lastAnalysisTime,
    nextAnalysisTime,
    isAnalyzing,
    runAnalysis: () => runAnalysis(true),
    markNewData,
    analysisDays: ANALYSIS_DAYS,
    programGoal,
    dataStats
  };
}

export type { AnalysisSchedule };
