import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VitaminsMineralsCardProps {
  nutriments: {
    // Vitamins
    "vitamin-a_100g"?: number;
    "vitamin-d_100g"?: number;
    "vitamin-e_100g"?: number;
    "vitamin-k_100g"?: number;
    "vitamin-c_100g"?: number;
    "vitamin-b1_100g"?: number;
    "vitamin-b2_100g"?: number;
    "vitamin-b3_100g"?: number;
    "vitamin-b6_100g"?: number;
    "vitamin-b9_100g"?: number;
    "vitamin-b12_100g"?: number;
    biotin_100g?: number;
    "pantothenic-acid_100g"?: number;
    // Minerals
    calcium_100g?: number;
    iron_100g?: number;
    magnesium_100g?: number;
    phosphorus_100g?: number;
    potassium_100g?: number;
    zinc_100g?: number;
    copper_100g?: number;
    selenium_100g?: number;
    manganese_100g?: number;
  };
  servingSize?: string;
  quantity?: number;
}

const VITAMINS = [
  { key: "vitamin-a_100g", name: "Vitamin A", unit: "mcg" },
  { key: "vitamin-d_100g", name: "Vitamin D", unit: "mcg" },
  { key: "vitamin-e_100g", name: "Vitamin E", unit: "mg" },
  { key: "vitamin-k_100g", name: "Vitamin K", unit: "mcg" },
  { key: "vitamin-c_100g", name: "Vitamin C", unit: "mg" },
  { key: "vitamin-b1_100g", name: "Vitamin B1 (Thiamin)", unit: "mg" },
  { key: "vitamin-b2_100g", name: "Vitamin B2 (Riboflavin)", unit: "mg" },
  { key: "vitamin-b3_100g", name: "Vitamin B3 (Niacin)", unit: "mg" },
  { key: "vitamin-b6_100g", name: "Vitamin B6", unit: "mg" },
  { key: "vitamin-b9_100g", name: "Vitamin B9 (Folate)", unit: "mcg" },
  { key: "vitamin-b12_100g", name: "Vitamin B12", unit: "mcg" },
  { key: "biotin_100g", name: "Biotin", unit: "mcg" },
  { key: "pantothenic-acid_100g", name: "Pantothenic Acid", unit: "mg" },
];

const MINERALS = [
  { key: "calcium_100g", name: "Calcium", unit: "mg" },
  { key: "iron_100g", name: "Iron", unit: "mg" },
  { key: "magnesium_100g", name: "Magnesium", unit: "mg" },
  { key: "phosphorus_100g", name: "Phosphorus", unit: "mg" },
  { key: "potassium_100g", name: "Potassium", unit: "mg" },
  { key: "zinc_100g", name: "Zinc", unit: "mg" },
  { key: "copper_100g", name: "Copper", unit: "mg" },
  { key: "selenium_100g", name: "Selenium", unit: "mcg" },
  { key: "manganese_100g", name: "Manganese", unit: "mg" },
];

export default function VitaminsMineralsCard({ nutriments, servingSize, quantity = 1 }: VitaminsMineralsCardProps) {
  const [expanded, setExpanded] = useState(false);

  const hasVitamins = VITAMINS.some(v => (nutriments[v.key as keyof typeof nutriments] ?? 0) > 0);
  const hasMinerals = MINERALS.some(m => (nutriments[m.key as keyof typeof nutriments] ?? 0) > 0);

  if (!hasVitamins && !hasMinerals) {
    return null;
  }

  const getValue = (key: string) => {
    const val = nutriments[key as keyof typeof nutriments] ?? 0;
    return val * quantity;
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        <span>Vitamins & Minerals</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          {hasVitamins && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Vitamins</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {VITAMINS.map(v => {
                  const val = getValue(v.key);
                  if (val <= 0) return null;
                  return (
                    <div key={v.key} className="flex justify-between">
                      <span className="text-muted-foreground">{v.name}</span>
                      <span className="font-medium">{val.toFixed(1)}{v.unit}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {hasMinerals && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Minerals</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {MINERALS.map(m => {
                  const val = getValue(m.key);
                  if (val <= 0) return null;
                  return (
                    <div key={m.key} className="flex justify-between">
                      <span className="text-muted-foreground">{m.name}</span>
                      <span className="font-medium">{val.toFixed(1)}{m.unit}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
