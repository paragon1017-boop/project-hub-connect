import { Home, ScanBarcode, Search, Settings, Camera, BookOpen, Heart, Activity, Dumbbell, Zap, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Today", path: "/" },
  { icon: ScanBarcode, label: "Scan", path: "/scan" },
  { icon: Search, label: "Food Search", path: "/search" },
  { icon: Zap, label: "Cardio", path: "/cardio" },
  { icon: Activity, label: "Exercises", path: "/exercises" },
  { icon: Dumbbell, label: "Daily Routine", path: "/workouts" },
  { icon: Camera, label: "Photos", path: "/photos" },
  { icon: BookOpen, label: "Journal", path: "/journal" },
  { icon: Heart, label: "Favorites", path: "/favorites" },
  { icon: Sparkles, label: "AI", path: "/ai" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
