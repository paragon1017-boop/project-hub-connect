import React, { useState } from "react";
import WorkoutsPanel from "@/components/WorkoutsPanel";
import { useRoutines } from "@/hooks/useRoutines";
import { useWorkoutLog } from "@/hooks/useWorkoutLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  Save, 
  Dumbbell,
  X
} from "lucide-react";

interface ExerciseInput {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export default function Workouts() {
  const { routines, isLoaded, addRoutine, deleteRoutine, availableSlots } = useRoutines();
  const { addMultipleWorkouts, workouts } = useWorkoutLog();
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState<ExerciseInput[]>([{ name: "", sets: "", reps: "", weight: "" }]);
  const [error, setError] = useState("");

  // Add exercise input field
  const addExerciseField = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }]);
  };

  // Remove exercise input field
  const removeExerciseField = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  // Update exercise field
  const updateExercise = (index: number, field: keyof ExerciseInput, value: string) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  // Save routine
  const handleSaveRoutine = () => {
    const validExercises = exercises
      .filter(ex => ex.name.trim())
      .map(ex => ({
        name: ex.name.trim(),
        sets: ex.sets ? parseInt(ex.sets) : undefined,
        reps: ex.reps ? parseInt(ex.reps) : undefined,
        weight: ex.weight ? parseFloat(ex.weight) : undefined,
      }));

    if (validExercises.length === 0) {
      setError("Add at least one exercise");
      return;
    }

    const result = addRoutine(routineName, validExercises);
    
    if (result.success) {
      setSaveDialogOpen(false);
      setRoutineName("");
      setExercises([{ name: "", sets: "", reps: "", weight: "" }]);
      setError("");
    } else {
      setError(result.error || "Failed to save routine");
    }
  };

  // Load routine (add all exercises to today's workout)
  const loadRoutine = (routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;

    // Convert routine exercises to workout items
    const workoutItems = routine.exercises.map(exercise => {
      const durationText = exercise.sets && exercise.reps 
        ? `${exercise.sets}x${exercise.reps}${exercise.weight ? ` @ ${exercise.weight}lbs` : ''}`
        : '';
      
      return {
        name: exercise.name + (durationText ? ` (${durationText})` : ''),
        intensity: "Medium" as const,
      };
    });

    // Add all exercises at once
    addMultipleWorkouts(workoutItems);
  };

  if (!isLoaded) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      {/* Quick Routines Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Quick Routines
          </h2>
          <span className="text-xs text-muted-foreground">
            {routines.length}/7 saved
          </span>
        </div>

        {/* Routine Buttons Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {routines.map((routine, index) => (
            <div key={routine.id} className="relative group">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => loadRoutine(routine.id)}
              >
                <span className="truncate w-full px-1 text-center">{routine.name}</span>
                <span className="text-[10px] opacity-70">{routine.exercises.length} exercises</span>
              </Button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete "${routine.name}"?`)) {
                    deleteRoutine(routine.id);
                  }
                }}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Add New Routine Button */}
          {availableSlots > 0 && (
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center border-dashed border-2"
              onClick={() => setSaveDialogOpen(true)}
            >
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-xs">Add Routine</span>
            </Button>
          )}
        </div>

        {/* Empty State */}
        {routines.length === 0 && (
          <div className="text-center p-4 border rounded-lg border-dashed">
            <p className="text-sm text-muted-foreground">
              No routines saved yet. Click "Add Routine" to create one!
            </p>
          </div>
        )}
      </section>

      <WorkoutsPanel />

      {/* Save Routine Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Save New Routine</DialogTitle>
            <DialogDescription>
              Create a quick-access routine with up to 7 exercises.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Routine Name</label>
              <Input
                placeholder="e.g., Chest Day, Leg Day"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Exercises</label>
              {exercises.map((exercise, index) => (
                <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, "name", e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Sets"
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, "sets", e.target.value)}
                        className="text-sm w-20"
                      />
                      <Input
                        placeholder="Reps"
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, "reps", e.target.value)}
                        className="text-sm w-20"
                      />
                      <Input
                        placeholder="Weight"
                        type="number"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, "weight", e.target.value)}
                        className="text-sm flex-1"
                      />
                    </div>
                  </div>
                  {exercises.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeExerciseField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExerciseField}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRoutine}>
              <Save className="h-4 w-4 mr-2" />
              Save Routine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
