import { cn } from "@/lib/utils";

interface NutritionCardProps {
  label: string;
  value: number;
  unit: string;
  color?: string;
  className?: string;
}

export default function NutritionCard({ label, value, unit, color, className }: NutritionCardProps) {
  return (
    <div className={cn("rounded-lg bg-card p-3 text-center shadow-sm border", className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold font-display" style={color ? { color } : undefined}>
        {Math.round(value * 10) / 10}
      </p>
      <p className="text-xs text-muted-foreground">{unit}</p>
    </div>
  );
}
