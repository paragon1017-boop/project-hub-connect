import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { profile, updateGoal } = useProfile();
  const [goal, setGoal] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (profile) setGoal(String(profile.calorie_goal));
  }, [profile]);

  const handleSave = () => {
    const num = parseInt(goal);
    if (isNaN(num) || num < 500 || num > 10000) {
      toast({ variant: "destructive", title: "Invalid goal", description: "Enter a number between 500 and 10000." });
      return;
    }
    updateGoal.mutate(num, {
      onSuccess: () => toast({ title: "Saved!", description: "Calorie goal updated." }),
    });
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <header className="mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-display">Settings</h1>
      </header>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Daily Calorie Goal</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input type="number" value={goal} onChange={e => setGoal(e.target.value)} min={500} max={10000} />
          <Button onClick={handleSave} disabled={updateGoal.isPending}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
