import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export interface CardioSession {
  id: string;
  name: string;
  icon: string;
  duration: number;
  intensity: "low" | "medium" | "high";
  calories: number;
  timestamp: string;
}

export function useCardioLog(date?: Date) {
  const { user } = useAuth();
  const dateStr = format(date || new Date(), "yyyy-MM-dd");
  const key = `cardio_log_${user?.id}_${dateStr}`;

  const [sessions, setSessions] = useState<CardioSession[]>([]);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      return;
    }
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setSessions(JSON.parse(raw) as CardioSession[]);
      } catch {
        setSessions([]);
      }
    } else {
      setSessions([]);
    }
  }, [user?.id, dateStr]);

  const addSession = (session: Omit<CardioSession, "id" | "timestamp">) => {
    const item: CardioSession = { 
      id: crypto.randomUUID(), 
      timestamp: new Date().toISOString(),
      ...session 
    };
    setSessions(prev => {
      const next = [item, ...prev];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
    return item;
  };

  const removeSession = (id: string) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  const totalCalories = sessions.reduce((sum, s) => sum + s.calories, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  return { sessions, addSession, removeSession, totalCalories, totalMinutes };
}

export default useCardioLog;
