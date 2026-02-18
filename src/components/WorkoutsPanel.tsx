import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkoutLog, WorkoutItem } from "@/hooks/useWorkoutLog";
import { useCardioLog, CardioSession } from "@/hooks/useCardioLog";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Zap } from "lucide-react";

interface ParsedWorkout {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
}

// Parse workout name like "Bench Press (3x10 @ 135lbs)" into components
function parseWorkoutName(fullName: string): ParsedWorkout {
  const match = fullName.match(/^(.*?)\s*\((\d+)x(\d+)(?:\s*@\s*(\d+)lbs)?\)$/);
  if (match) {
    return {
      name: match[1].trim(),
      sets: parseInt(match[2]),
      reps: parseInt(match[3]),
      weight: match[4] ? parseInt(match[4]) : undefined,
    };
  }
  return { name: fullName };
}

// Build workout name from components
function buildWorkoutName(parsed: ParsedWorkout): string {
  if (parsed.sets && parsed.reps) {
    const weightStr = parsed.weight ? ` @ ${parsed.weight}lbs` : '';
    return `${parsed.name} (${parsed.sets}x${parsed.reps}${weightStr})`;
  }
  return parsed.name;
}

export default function WorkoutsPanel() {
  const { user } = useAuth();
  const { workouts, removeWorkout, updateWorkout } = useWorkoutLog();
  const { sessions: cardioSessions, removeSession: removeCardioSession, totalCalories: cardioCalories, totalMinutes: cardioMinutes } = useCardioLog();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
  });

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const hasWorkouts = workouts.length > 0 || cardioSessions.length > 0;
  const totalWorkoutCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0) + cardioCalories;

  const openEditDialog = (workout: WorkoutItem) => {
    const parsed = parseWorkoutName(workout.name);
    setEditingWorkout(workout);
    setEditForm({
      name: parsed.name,
      sets: parsed.sets?.toString() || "",
      reps: parsed.reps?.toString() || "",
      weight: parsed.weight?.toString() || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingWorkout) return;
    
    const parsed: ParsedWorkout = {
      name: editForm.name.trim(),
      sets: editForm.sets ? parseInt(editForm.sets) : undefined,
      reps: editForm.reps ? parseInt(editForm.reps) : undefined,
      weight: editForm.weight ? parseFloat(editForm.weight) : undefined,
    };

    const newName = buildWorkoutName(parsed);
    
    updateWorkout(editingWorkout.id, { name: newName });
    setEditDialogOpen(false);
    setEditingWorkout(null);
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-4 bg-card rounded shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Today's Workouts</h3>
        <div className="text-xs text-muted-foreground">
          {todayKey}
          {totalWorkoutCalories > 0 && <span className="ml-2 text-orange-600">{totalWorkoutCalories} cal</span>}
        </div>
      </div>

      {!hasWorkouts ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No workouts logged today. Go to Routine or Cardio tab to add workouts!
        </p>
      ) : (
        <div className="space-y-2">
          {/* Strength Workouts */}
          {workouts.map((w) => (
            <div key={w.id} className="flex items-center justify-between border rounded p-2 bg-white/60">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{w.name}</div>
                <div className="text-xs text-muted-foreground">
                  {w.duration ?? 0}m • {w.intensity ?? ''}{w.caloriesBurned ? ` • ${w.caloriesBurned} kcal` : ''}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => openEditDialog(w)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeWorkout(w.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {/* Cardio Sessions */}
          {cardioSessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between border rounded p-2 bg-orange-50/60">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xl">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate flex items-center gap-1">
                    <Zap className="h-3 w-3 text-orange-500" />
                    {s.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.duration}m • {s.intensity} • <span className="text-orange-600 font-medium">{s.calories} kcal</span>
                    <span className="ml-2">{formatTime(s.timestamp)}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive"
                onClick={() => removeCardioSession(s.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {/* Cardio Summary */}
          {cardioSessions.length > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Cardio Total: {cardioMinutes} min</span>
              <span className="text-orange-600 font-medium">{cardioCalories} calories burned</span>
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Exercise Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="e.g., Bench Press"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-sets">Sets</Label>
                <Input
                  id="edit-sets"
                  type="number"
                  value={editForm.sets}
                  onChange={e => setEditForm({ ...editForm, sets: e.target.value })}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-reps">Reps</Label>
                <Input
                  id="edit-reps"
                  type="number"
                  value={editForm.reps}
                  onChange={e => setEditForm({ ...editForm, reps: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-weight">Weight (lbs)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  value={editForm.weight}
                  onChange={e => setEditForm({ ...editForm, weight: e.target.value })}
                  placeholder="135"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
