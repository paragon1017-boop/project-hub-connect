import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
}

export interface RoutineExercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

const MAX_ROUTINES = 7;
const STORAGE_KEY = "saved_routines";

export function useRoutines() {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load routines from localStorage
  useEffect(() => {
    if (!user) {
      setRoutines([]);
      setIsLoaded(true);
      return;
    }

    const userKey = `${STORAGE_KEY}_${user.id}`;
    const stored = localStorage.getItem(userKey);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRoutines(parsed);
      } catch {
        setRoutines([]);
      }
    }
    setIsLoaded(true);
  }, [user]);

  // Save routines to localStorage
  const saveToStorage = useCallback((newRoutines: Routine[]) => {
    if (!user) return;
    const userKey = `${STORAGE_KEY}_${user.id}`;
    localStorage.setItem(userKey, JSON.stringify(newRoutines));
  }, [user]);

  // Add a new routine
  const addRoutine = useCallback((name: string, exercises: RoutineExercise[]) => {
    if (routines.length >= MAX_ROUTINES) {
      return { success: false, error: `Maximum ${MAX_ROUTINES} routines allowed. Delete one first.` };
    }

    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      name: name.trim() || `Routine ${routines.length + 1}`,
      exercises,
      createdAt: new Date().toISOString(),
    };

    const updated = [...routines, newRoutine];
    setRoutines(updated);
    saveToStorage(updated);
    return { success: true };
  }, [routines, saveToStorage]);

  // Update an existing routine
  const updateRoutine = useCallback((id: string, updates: Partial<Routine>) => {
    const updated = routines.map(r => 
      r.id === id ? { ...r, ...updates } : r
    );
    setRoutines(updated);
    saveToStorage(updated);
  }, [routines, saveToStorage]);

  // Delete a routine
  const deleteRoutine = useCallback((id: string) => {
    const updated = routines.filter(r => r.id !== id);
    setRoutines(updated);
    saveToStorage(updated);
  }, [routines, saveToStorage]);

  // Get a routine by ID
  const getRoutine = useCallback((id: string) => {
    return routines.find(r => r.id === id);
  }, [routines]);

  // Get available slots
  const availableSlots = MAX_ROUTINES - routines.length;

  return {
    routines,
    isLoaded,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutine,
    availableSlots,
    maxRoutines: MAX_ROUTINES,
  };
}
