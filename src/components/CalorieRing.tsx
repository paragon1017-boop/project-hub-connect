import { cn } from "@/lib/utils";

interface CalorieRingProps {
  consumed: number;
  goal: number;
  className?: string;
}

export default function CalorieRing({ consumed, goal, className }: CalorieRingProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 100) return "hsl(var(--nutri-red))";
    if (percentage >= 80) return "hsl(var(--nutri-orange))";
    return "hsl(var(--nutri-green))";
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg width="160" height="160" className="-rotate-90">
        <circle
          cx="80" cy="80" r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="80" cy="80" r={radius}
          stroke={getColor()}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold font-display">{Math.round(consumed)}</span>
        <span className="text-xs text-muted-foreground">of {goal} kcal</span>
        <span className="mt-1 text-sm font-medium" style={{ color: getColor() }}>
          {consumed >= goal ? "Goal reached!" : `${Math.round(remaining)} left`}
        </span>
      </div>
    </div>
  );
}
