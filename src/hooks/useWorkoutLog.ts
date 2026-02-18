import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export interface WorkoutItem {
  id: string;
  name: string;
  duration?: number;
  intensity?: "Low" | "Medium" | "High";
  caloriesBurned?: number;
}

export function useWorkoutLog(date?: Date) {
  const { user } = useAuth();
  const dateStr = format(date || new Date(), "yyyy-MM-dd");
  const key = `workout_log_${user?.id}_${dateStr}`;

  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);

  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      return;
    }
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setWorkouts(JSON.parse(raw) as WorkoutItem[]);
      } catch {
        setWorkouts([]);
      }
    } else {
      setWorkouts([]);
    }
  }, [user?.id, dateStr]);

  const addWorkout = (w: Omit<WorkoutItem, "id">) => {
    const item: WorkoutItem = { id: crypto.randomUUID(), ...w };
    setWorkouts(prev => {
      const next = [item, ...prev];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  const addMultipleWorkouts = (items: Omit<WorkoutItem, "id">[]) => {
    const newItems: WorkoutItem[] = items.map(w => ({ id: crypto.randomUUID(), ...w }));
    setWorkouts(prev => {
      const next = [...newItems, ...prev];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  const removeWorkout = (id: string) => {
    const next = workouts.filter((w) => w.id !== id);
    setWorkouts(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const updateWorkout = (id: string, updates: Partial<Omit<WorkoutItem, "id">>) => {
    setWorkouts(prev => {
      const next = prev.map(w => w.id === id ? { ...w, ...updates } : w);
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  return { workouts, addWorkout, addMultipleWorkouts, removeWorkout, updateWorkout };
}

export default useWorkoutLog;
