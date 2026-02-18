import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Clock, Flame, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCardioLog } from "@/hooks/useCardioLog";

interface CardioActivity {
  id: string;
  name: string;
  caloriesPerMinute: number;
  icon: string;
}

type IntensityLevel = "low" | "medium" | "high";

const intensityMultipliers: Record<IntensityLevel, number> = {
  low: 0.8,
  medium: 1.0,
  high: 1.3,
};

const cardioActivities: CardioActivity[] = [
  { id: "running", name: "Running", caloriesPerMinute: 11.5, icon: "🏃" },
  { id: "walking", name: "Walking - Slow Pace (~2500 steps/hr)", caloriesPerMinute: 4.0, icon: "🚶" },
  { id: "cycling", name: "Cycling", caloriesPerMinute: 8.0, icon: "🚴" },
  { id: "swimming", name: "Swimming", caloriesPerMinute: 10.0, icon: "🏊" },
  { id: "jumping-rope", name: "Jumping Rope", caloriesPerMinute: 13.0, icon: "🪢" },
  { id: "elliptical", name: "Elliptical", caloriesPerMinute: 7.0, icon: "🏃" },
  { id: "rowing", name: "Rowing", caloriesPerMinute: 9.0, icon: "🚣" },
  { id: "stair-climber", name: "Stair Climber", caloriesPerMinute: 9.0, icon: "🏃" },
  { id: "hiit", name: "HIIT", caloriesPerMinute: 12.0, icon: "⚡" },
  { id: "dancing", name: "Dancing", caloriesPerMinute: 6.0, icon: "💃" },
  { id: "hiking", name: "Hiking", caloriesPerMinute: 7.5, icon: "🥾" },
  { id: "boxing", name: "Boxing", caloriesPerMinute: 11.0, icon: "🥊" },
];

export default function Cardio() {
  const { toast } = useToast();
  const { sessions, addSession, removeSession, totalCalories, totalMinutes } = useCardioLog();
  const [selectedActivity, setSelectedActivity] = useState<CardioActivity | null>(null);
  const [duration, setDuration] = useState<string>("30");
  const [intensity, setIntensity] = useState<IntensityLevel>("medium");

  const calculateCalories = (activity: CardioActivity, minutes: number, intensityLevel: IntensityLevel) => {
    return Math.round(activity.caloriesPerMinute * minutes * intensityMultipliers[intensityLevel]);
  };

  const handleAddSession = () => {
    if (!selectedActivity || !duration) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an activity and duration",
      });
      return;
    }

    const minutes = parseInt(duration);
    const calories = calculateCalories(selectedActivity, minutes, intensity);

    addSession({
      name: selectedActivity.name,
      icon: selectedActivity.icon,
      duration: minutes,
      intensity,
      calories,
    });
    
    toast({
      title: "Cardio session added!",
      description: `${selectedActivity.name} (${intensity}) for ${minutes} min - ${calories} calories`,
    });

    setSelectedActivity(null);
    setDuration("30");
    setIntensity("medium");
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <header className="mb-6 flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-display">Cardio</h1>
      </header>

      {/* Summary Card */}
      <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-orange-700">{totalCalories}</p>
              <p className="text-xs text-orange-600">Calories Burned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700">{totalMinutes}</p>
              <p className="text-xs text-orange-600">Minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Log Cardio Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Activity Grid */}
          <div className="grid grid-cols-3 gap-2">
            {cardioActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedActivity?.id === activity.id
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl mb-1 block">{activity.icon}</span>
                <span className="text-xs font-medium">{activity.name}</span>
                <span className="text-xs text-muted-foreground block">
                  {activity.caloriesPerMinute} cal/min
                </span>
              </button>
            ))}
          </div>

          {/* Duration and Intensity Input */}
          {selectedActivity && (
            <div className="space-y-4 pt-4 border-t">
              {/* Duration */}
              <div className="flex items-center justify-between">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration (minutes)
                </Label>
                <span className="text-sm text-muted-foreground">
                  Estimated: {calculateCalories(selectedActivity, parseInt(duration) || 0, intensity)} calories
                </span>
              </div>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="300"
                placeholder="Enter minutes"
                className="text-lg"
              />
              
              {/* Intensity Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Intensity Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setIntensity("low")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      intensity === "low"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <span className="block text-xs mb-1">🟢</span>
                    Low
                  </button>
                  <button
                    onClick={() => setIntensity("medium")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      intensity === "medium"
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                        : "border-gray-200 hover:border-yellow-300"
                    }`}
                  >
                    <span className="block text-xs mb-1">🟡</span>
                    Medium
                  </button>
                  <button
                    onClick={() => setIntensity("high")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      intensity === "high"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <span className="block text-xs mb-1">🔴</span>
                    High
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {intensity === "low" && "Light effort - can hold a conversation easily"}
                  {intensity === "medium" && "Moderate effort - can talk but slightly breathless"}
                  {intensity === "high" && "Vigorous effort - difficult to talk, heart rate elevated"}
                </p>
              </div>
              
              <Button 
                onClick={handleAddSession} 
                className="w-full"
                size="lg"
              >
                <Flame className="h-4 w-4 mr-2" />
                Log {selectedActivity.name}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Today's Sessions
      </h2>
      
      {sessions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No cardio sessions logged today. Select an activity above to get started!
        </p>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <Card key={session.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{session.icon}</span>
                    <div>
                      <p className="font-medium">{session.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.duration} min • {session.intensity.charAt(0).toUpperCase() + session.intensity.slice(1)} Intensity
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">{session.calories} cal</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      session.intensity === 'low' ? 'bg-green-100 text-green-700' :
                      session.intensity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {session.intensity === 'low' ? '🟢' : session.intensity === 'medium' ? '🟡' : '🔴'} {session.intensity}
                    </span>
                    <button
                      onClick={() => removeSession(session.id)}
                      className="text-xs text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="h-3 w-3 inline" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips Card */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Cardio Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Aim for 150 minutes of moderate cardio per week</li>
            <li>• Mix high and low intensity for best results</li>
            <li>• Stay hydrated during longer sessions</li>
            <li>• Track heart rate for optimal training zones</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
