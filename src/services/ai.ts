// src/services/ai.ts
// Gemini AI integration for comprehensive nutrition analysis

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDCE2MXVlWv224jJyvJ9Bo4jBHp432W3_Y";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface NutritionData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  weight?: number;
  water?: number;
  foods: Array<{
    food_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  }>;
  workouts?: Array<{
    name: string;
    duration: number;
    intensity?: string;
    caloriesBurned?: number;
  }>;
  programGoal?: {
    type: 'bulking' | 'cutting' | null;
    targetCalories: number | null;
    name: string | null;
  };
}

interface AIAnalysisResult {
  summary: string;
  insights: string[];
  recommendations: string[];
  macroAnalysis: string;
  weightTrend: string;
  hydrationStatus: string;
  mealTiming: string;
  improvements: string[];
  weeklyComparison?: string;
  fiberSugarAnalysis: string;
  sodiumAnalysis: string;
  exerciseCorrelation: string;
  proteinDistribution: string;
  foodVarietyScore: string;
  calorieCycling: string;
  weekendVsWeekday: string;
  goalAdherence: string;
  bingeRestrictPatterns: string;
  tdeeEstimation: string;
  mealFrequency: string;
  progressRate: string;
  nutrientTiming: string;
  deficiencyWarnings: string[];
  consistencyScore: string;
  workoutReview: string;
  workoutStrengths: string[];
  workoutImprovements: string[];
  mealSuggestions: string[];
  preWorkoutMeals: string[];
  postWorkoutMeals: string[];
}

export async function analyzeNutritionData(data: NutritionData | NutritionData[]): Promise<AIAnalysisResult> {
  const isArray = Array.isArray(data);
  const days = isArray ? data : [data];
  
  const prompt = buildAnalysisPrompt(days);
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    return parseAIResponse(text);
  } catch (error) {
    console.error("AI Analysis error:", error);
    return getFallbackAnalysis(days);
  }
}

function buildAnalysisPrompt(days: NutritionData[]): string {
  const totalCalories = days.reduce((sum, d) => sum + d.calories, 0);
  const totalProtein = days.reduce((sum, d) => sum + d.protein, 0);
  const totalCarbs = days.reduce((sum, d) => sum + d.carbs, 0);
  const totalFat = days.reduce((sum, d) => sum + d.fat, 0);
  const totalFiber = days.reduce((sum, d) => sum + (d.fiber || 0), 0);
  const totalSugar = days.reduce((sum, d) => sum + (d.sugar || 0), 0);
  const totalSodium = days.reduce((sum, d) => sum + (d.sodium || 0), 0);
  const avgCalories = Math.round(totalCalories / days.length);
  const avgFiber = Math.round(totalFiber / days.length);
  const avgSugar = Math.round(totalSugar / days.length);
  const avgSodium = Math.round(totalSodium / days.length);
  
  const weights = days.filter(d => d.weight).map(d => d.weight!);
  const waters = days.filter(d => d.water).map(d => d.water!);
  const avgWater = waters.length > 0 ? Math.round(waters.reduce((a, b) => a + b, 0) / waters.length) : 0;
  
  const allFoods = days.flatMap(d => d.foods);
  const uniqueFoods = [...new Set(allFoods.map(f => f.food_name))];
  
  const allWorkouts = days.flatMap(d => d.workouts || []);
  const totalWorkouts = allWorkouts.length;
  const totalWorkoutDuration = allWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalCaloriesBurned = allWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const workoutTypes = [...new Set(allWorkouts.map(w => w.name))];
  
  const programGoal = days.find(d => d.programGoal)?.programGoal;
  
  const weekendDays = days.filter(d => {
    const day = new Date(d.date).getDay();
    return day === 0 || day === 6;
  });
  const weekdayDays = days.filter(d => {
    const day = new Date(d.date).getDay();
    return day !== 0 && day !== 6;
  });
  
  const weekendAvg = weekendDays.length > 0 
    ? Math.round(weekendDays.reduce((s, d) => s + d.calories, 0) / weekendDays.length)
    : 0;
  const weekdayAvg = weekdayDays.length > 0
    ? Math.round(weekdayDays.reduce((s, d) => s + d.calories, 0) / weekdayDays.length)
    : 0;
  
  const calorieVariance = days.length > 1
    ? Math.round(Math.sqrt(days.reduce((sq, d) => sq + Math.pow(d.calories - avgCalories, 2), 0) / days.length))
    : 0;
  
  const goalSection = programGoal?.type ? `
USER'S CURRENT GOAL:
- Program: ${programGoal.name || 'Unnamed program'}
- Goal Type: ${programGoal.type === 'bulking' ? 'BULKING (muscle gain)' : 'CUTTING (fat loss)'}
- Target Calories: ${programGoal.targetCalories || 'Not set'} per day
- Current vs Target: ${avgCalories} vs ${programGoal.targetCalories || 'N/A'} (${programGoal.targetCalories ? (avgCalories > programGoal.targetCalories ? '+' : '') + (avgCalories - programGoal.targetCalories) + ' cal difference' : 'N/A'})
` : '';
  
  const workoutSection = totalWorkouts > 0 ? `
WORKOUT SUMMARY:
- Total workouts: ${totalWorkouts} over ${days.length} days
- Total duration: ${totalWorkoutDuration} minutes
- Estimated calories burned: ${totalCaloriesBurned} cal
- Workout types: ${workoutTypes.slice(0, 5).join(', ')}${workoutTypes.length > 5 ? ` and ${workoutTypes.length - 5} more` : ''}
- Workout frequency: ${(totalWorkouts / days.length * 100).toFixed(0)}% of days
` : '';
  
  return `You are an advanced nutrition expert AI assistant with expertise in sports nutrition, metabolic health, and behavioral eating patterns. Analyze the following nutrition data and provide a comprehensive, actionable assessment.
${goalSection}
DATA OVERVIEW:
- Time period: ${days.length} day(s)
- Average daily calories: ${avgCalories}
- Average daily protein: ${Math.round(totalProtein / days.length)}g
- Average daily carbs: ${Math.round(totalCarbs / days.length)}g
- Average daily fat: ${Math.round(totalFat / days.length)}g
- Average daily fiber: ${avgFiber}g (Goal: 25-35g)
- Average daily sugar: ${avgSugar}g
- Average daily sodium: ${avgSodium}mg (Goal: <2300mg)
${weights.length > 0 ? `- Weight range: ${Math.min(...weights)} - ${Math.max(...weights)} lbs (${weights.length} measurements)` : ''}
${avgWater > 0 ? `- Average water intake: ${avgWater} oz (Goal: 64-128 oz)` : ''}
- Unique foods consumed: ${uniqueFoods.length}
- Total workouts: ${totalWorkouts}
${weekendAvg > 0 && weekdayAvg > 0 ? `- Weekend avg: ${weekendAvg} cal | Weekday avg: ${weekdayAvg} cal` : ''}
${calorieVariance > 0 ? `- Calorie variance: ±${calorieVariance} cal (indicates ${calorieVariance > 500 ? 'high' : 'moderate'} cycling)` : ''}
${workoutSection}
DETAILED DAILY DATA:
${days.map(d => {
  const dayOfWeek = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });
  const workoutNames = (d.workouts || []).map(w => w.name).join(', ');
  return `- ${d.date} (${dayOfWeek}): ${Math.round(d.calories)} cal, ${Math.round(d.protein)}g protein, ${d.fiber || 0}g fiber, ${d.sugar || 0}g sugar, ${d.sodium || 0}mg sodium, ${d.weight ? `${d.weight} lbs` : 'no weight'}, ${d.water ? `${d.water} oz water` : 'no water'}, ${d.foods.length} meals${workoutNames ? `, workouts: ${workoutNames}` : ''}`;
}).join("\n")}

FOODS CONSUMED:
${uniqueFoods.slice(0, 20).join(", ")}${uniqueFoods.length > 20 ? ` and ${uniqueFoods.length - 20} more...` : ''}

Please provide a comprehensive analysis in the following format:

SUMMARY: [2-3 sentence overview highlighting the most important finding${programGoal?.type ? ' - relate to their ' + programGoal.type + ' goal' : ''}]

INSIGHTS:
- [Key insight about eating patterns]
- [Key insight about nutrition quality]
- [Key insight about health implications]

MACRO_ANALYSIS: [Detailed analysis of protein/carbs/fat ratios. Include: Are macros balanced? Is protein adequate for muscle maintenance? Are carbs appropriate for activity level?]

FIBER_SUGAR_ANALYSIS: [Is fiber intake sufficient? Is sugar intake too high? Compare to recommended values: Fiber 25-35g/day, Sugar <50g/day]

SODIUM_ANALYSIS: [Evaluate sodium intake vs recommended 2300mg/day limit. Health implications for blood pressure. Identify high-sodium foods if data available.]

WEIGHT_TREND: [If weight data exists over multiple days, calculate rate of change per week and assess if it's healthy (0.5-2 lbs/week loss or 0.25-1 lb/week gain is generally safe). If only one data point, note insufficient data.]

HYDRATION_STATUS: [Comprehensive water analysis: Are they meeting 64oz minimum? Optimal range is half body weight in oz or 1 gallon (128oz) for active individuals. Health impacts of hydration status.]

MEAL_TIMING: [Analysis of meal patterns: How many meals per day? Any late-night eating? Fasting periods? Consistency in timing?]

MEAL_FREQUENCY: [Detailed breakdown: Average meals per day, snack frequency, longest fasting window. Is this optimal for their goals?]

PROTEIN_DISTRIBUTION: [Is protein spread throughout the day or concentrated in one meal? Recommendation: 20-40g per meal for optimal muscle protein synthesis.]

EXERCISE_CORRELATION: [Do workout days have different calorie intake? Is nutrition supporting exercise recovery? Adequate carbs on workout days?]

FOOD_VARIETY_SCORE: [Rate variety from 1-10. Is diet diverse or repetitive? Micronutrient implications of limited variety. Recommendations to diversify.]

CALORIE_CYCLING: [Is there intentional high/low calorie cycling? Variance analysis. If variance >500 cal, is this planned or erratic eating? Health implications.]

WEEKEND_VS_WEEKDAY: [Compare weekend and weekday patterns. Common issue: weekend overeating. Calculate difference and assess impact on weekly goals.]

GOAL_ADHERENCE: [${programGoal?.type ? `User is ${programGoal.type} with target of ${programGoal.targetCalories || 'not set'} cal. ` : ''}Assess how well they're sticking to their targets. Calorie consistency, macro targets, meal timing adherence. ${programGoal?.type === 'bulking' ? 'For bulking: Are they in a surplus? Getting 1g+ protein per lb bodyweight?' : programGoal?.type === 'cutting' ? 'For cutting: Are they in a deficit? Maintaining high protein to preserve muscle?' : ''}]

BINGE_RESTRICT_PATTERNS: [Identify extreme days: Very low calorie (<1000) or very high (>3500). Pattern analysis: Are there restrict-binge cycles? Behavioral recommendations.]

TDEE_ESTIMATION: [Estimate Total Daily Energy Expenditure based on weight changes and calorie intake. If losing weight: TDEE ≈ avg calories + (weight change rate * 3500/7). If maintaining: TDEE ≈ avg calories.]

NUTRIENT_TIMING: [Are carbs concentrated around workouts? Is protein consumed post-workout? Meal timing relative to exercise for optimal performance and recovery.]

DEFICIENCY_WARNINGS:
- [Potential deficiency 1 with explanation]
- [Potential deficiency 2 with explanation]
- [Warning about excessive intake if applicable]

CONSISTENCY_SCORE: [Rate overall consistency 1-10 based on: meal timing regularity, calorie consistency, macro adherence, tracking completeness. Explain the score.]

PROGRESS_RATE: [If weight data shows change, calculate weekly rate and assess if healthy and sustainable. 0.5-2 lbs/week loss is safe; faster may indicate muscle loss or water weight.]

RECOMMENDATIONS:
- [Specific, actionable recommendation 1${programGoal?.type ? ` tailored to their ${programGoal.type} goal` : ''}]
- [Specific, actionable recommendation 2]
- [Specific, actionable recommendation 3]
- [Specific, actionable recommendation 4${totalWorkouts > 0 ? ' related to workout nutrition' : ''}]

IMPROVEMENTS:
- [Priority area to improve 1 with specific steps]
- [Priority area to improve 2 with specific steps]
- [Priority area to improve 3 with specific steps]

WORKOUT_REVIEW: [${totalWorkouts > 0 ? `Review the user's workout activity over this period. Analyze: frequency, types of workouts, duration, intensity. Are they balanced? What muscle groups are they targeting? Is their workout volume appropriate for their goals?` : 'No workout data available to review. Encourage them to start tracking workouts.'}]

WORKOUT_STRENGTHS:
- [${totalWorkouts > 0 ? 'What they are doing well with their workouts' : 'N/A - start tracking workouts'}]
- [${totalWorkouts > 0 ? 'Positive aspects of their training' : 'N/A'}]

WORKOUT_IMPROVEMENTS:
- [${totalWorkouts > 0 ? 'Area to improve in their workout routine' : 'Start by adding 2-3 workouts per week'}]
- [${totalWorkouts > 0 ? 'Suggestion for better training' : 'Consider both cardio and strength training'}]

MEAL_SUGGESTIONS:
- [Specific meal idea 1 based on their nutrition gaps and goals]
- [Specific meal idea 2 based on their nutrition gaps and goals]
- [Specific meal idea 3 based on their nutrition gaps and goals]
- [Specific meal idea 4 based on their typical foods]

PRE_WORKOUT_MEALS:
- [Pre-workout meal idea 1: timing 1-2hrs before, carbs focused]
- [Pre-workout meal idea 2: quick energy option]

POST_WORKOUT_MEALS:
- [Post-workout meal idea 1: protein + carbs within 2hrs]
- [Post-workout meal idea 2: recovery focused option]

${days.length > 1 ? 'WEEKLY_COMPARISON: [Detailed day-by-day pattern analysis. Best day vs worst day. Identify what made certain days successful.]' : ''}`;
}

function parseAIResponse(text: string): AIAnalysisResult {
  const sections = text.split(/\n\n(?=[A-Z_]+:)/);
  
  const getSection = (label: string): string => {
    const section = sections.find(s => s.startsWith(label + ":"));
    return section ? section.replace(label + ":", "").trim() : "";
  };
  
  const getBulletPoints = (section: string): string[] => {
    return section
      .split("\n")
      .filter(line => line.trim().startsWith("-") || line.trim().startsWith("•"))
      .map(line => line.replace(/^[-•]\s*/, "").trim())
      .filter(line => line.length > 0);
  };
  
  return {
    summary: getSection("SUMMARY"),
    insights: getBulletPoints(getSection("INSIGHTS")),
    macroAnalysis: getSection("MACRO_ANALYSIS"),
    weightTrend: getSection("WEIGHT_TREND"),
    hydrationStatus: getSection("HYDRATION_STATUS"),
    mealTiming: getSection("MEAL_TIMING"),
    improvements: getBulletPoints(getSection("IMPROVEMENTS")),
    weeklyComparison: getSection("WEEKLY_COMPARISON") || undefined,
    fiberSugarAnalysis: getSection("FIBER_SUGAR_ANALYSIS"),
    sodiumAnalysis: getSection("SODIUM_ANALYSIS"),
    exerciseCorrelation: getSection("EXERCISE_CORRELATION"),
    proteinDistribution: getSection("PROTEIN_DISTRIBUTION"),
    foodVarietyScore: getSection("FOOD_VARIETY_SCORE"),
    calorieCycling: getSection("CALORIE_CYCLING"),
    weekendVsWeekday: getSection("WEEKEND_VS_WEEKDAY"),
    goalAdherence: getSection("GOAL_ADHERENCE"),
    bingeRestrictPatterns: getSection("BINGE_RESTRICT_PATTERNS"),
    tdeeEstimation: getSection("TDEE_ESTIMATION"),
    mealFrequency: getSection("MEAL_FREQUENCY"),
    progressRate: getSection("PROGRESS_RATE"),
    nutrientTiming: getSection("NUTRIENT_TIMING"),
    deficiencyWarnings: getBulletPoints(getSection("DEFICIENCY_WARNINGS")),
    consistencyScore: getSection("CONSISTENCY_SCORE"),
    recommendations: getBulletPoints(getSection("RECOMMENDATIONS")),
    workoutReview: getSection("WORKOUT_REVIEW"),
    workoutStrengths: getBulletPoints(getSection("WORKOUT_STRENGTHS")),
    workoutImprovements: getBulletPoints(getSection("WORKOUT_IMPROVEMENTS")),
    mealSuggestions: getBulletPoints(getSection("MEAL_SUGGESTIONS")),
    preWorkoutMeals: getBulletPoints(getSection("PRE_WORKOUT_MEALS")),
    postWorkoutMeals: getBulletPoints(getSection("POST_WORKOUT_MEALS")),
  };
}

function getFallbackAnalysis(days: NutritionData[]): AIAnalysisResult {
  const avgCalories = Math.round(days.reduce((sum, d) => sum + d.calories, 0) / days.length);
  const avgProtein = Math.round(days.reduce((sum, d) => sum + d.protein, 0) / days.length);
  const avgCarbs = Math.round(days.reduce((sum, d) => sum + d.carbs, 0) / days.length);
  const avgFat = Math.round(days.reduce((sum, d) => sum + d.fat, 0) / days.length);
  const avgFiber = Math.round(days.reduce((sum, d) => sum + (d.fiber || 0), 0) / days.length);
  const avgSugar = Math.round(days.reduce((sum, d) => sum + (d.sugar || 0), 0) / days.length);
  const avgSodium = Math.round(days.reduce((sum, d) => sum + (d.sodium || 0), 0) / days.length);
  const avgWater = days.filter(d => d.water).reduce((sum, d) => sum + (d.water || 0), 0) / days.filter(d => d.water).length || 0;
  const uniqueFoods = [...new Set(days.flatMap(d => d.foods.map(f => f.food_name)))];
  const totalWorkouts = days.reduce((sum, d) => sum + (d.workouts?.length || 0), 0);
  
  // Calculate calorie variance for cycling analysis
  const calorieVariance = days.length > 1
    ? Math.round(Math.sqrt(days.reduce((sq, d) => sq + Math.pow(d.calories - avgCalories, 2), 0) / days.length))
    : 0;
  
  // Weekend vs weekday analysis
  const weekendDays = days.filter(d => {
    const day = new Date(d.date).getDay();
    return day === 0 || day === 6;
  });
  const weekdayDays = days.filter(d => {
    const day = new Date(d.date).getDay();
    return day !== 0 && day !== 6;
  });
  const weekendAvg = weekendDays.length > 0 
    ? Math.round(weekendDays.reduce((s, d) => s + d.calories, 0) / weekendDays.length)
    : 0;
  const weekdayAvg = weekdayDays.length > 0
    ? Math.round(weekdayDays.reduce((s, d) => s + d.calories, 0) / weekdayDays.length)
    : 0;
  
  // Weight trend calculation
  const weights = days.filter(d => d.weight).map(d => d.weight!);
  const weightTrend = weights.length >= 2
    ? `Weight changed from ${weights[0]} to ${weights[weights.length - 1]} lbs (${(weights[weights.length - 1] - weights[0]) > 0 ? '+' : ''}${(weights[weights.length - 1] - weights[0]).toFixed(1)} lbs over ${days.length} days)`
    : weights.length === 1
    ? `Single weight measurement: ${weights[0]} lbs`
    : "No weight data available";
  
  // Progress rate calculation
  const progressRate = weights.length >= 2
    ? `${((weights[weights.length - 1] - weights[0]) / (days.length / 7)).toFixed(2)} lbs/week`
    : "Insufficient weight data";
  
  // TDEE estimation
  const tdeeEstimation = weights.length >= 2 && days.length >= 7
    ? `Estimated TDEE: ${Math.round(avgCalories + ((weights[weights.length - 1] - weights[0]) * 3500 / days.length))} calories/day`
    : "Need at least 7 days with weight data for TDEE estimation";
  
  // Binge/restrict detection
  const lowCalorieDays = days.filter(d => d.calories < 1200).length;
  const highCalorieDays = days.filter(d => d.calories > 3500).length;
  const bingeRestrictPattern = days.length > 1
    ? `${lowCalorieDays} very low calorie days (<1200), ${highCalorieDays} very high calorie days (>3500). ${(lowCalorieDays > 0 || highCalorieDays > 0) ? 'Consider more consistent intake.' : 'Good calorie consistency!'}`
    : "Need multiple days to detect patterns";
  
  // Consistency score (1-10)
  const avgMealsPerDay = days.reduce((sum, d) => sum + d.foods.length, 0) / days.length;
  const mealConsistency = days.length > 1
    ? Math.max(1, 10 - Math.round(calorieVariance / 200))
    : 5;
  
  // Goal adherence (assuming 2000 cal goal if not specified)
  const targetCalories = 2000;
  const adherenceDays = days.filter(d => Math.abs(d.calories - targetCalories) < 300).length;
  const adherencePercent = days.length > 0 ? Math.round((adherenceDays / days.length) * 100) : 0;
  
  return {
    summary: `Over ${days.length} day(s), you averaged ${avgCalories} calories with ${avgProtein}g of protein per day.`,
    insights: [
      avgProtein < 100 ? "Protein intake appears low. Consider adding more protein sources." : "Good protein intake!",
      avgCalories > 2500 ? "Your calorie intake is on the higher side." : "Calorie intake looks moderate.",
      avgFiber < 25 ? "Fiber intake is below recommended 25g/day. Add more vegetables and whole grains." : "Good fiber intake!",
    ],
    macroAnalysis: `Protein: ${avgProtein}g (${Math.round(avgProtein * 4 / avgCalories * 100)}%) | Carbs: ${avgCarbs}g (${Math.round(avgCarbs * 4 / avgCalories * 100)}%) | Fat: ${avgFat}g (${Math.round(avgFat * 9 / avgCalories * 100)}%)`,
    weightTrend: weightTrend,
    hydrationStatus: avgWater > 0 ? `You averaged ${Math.round(avgWater)} oz of water per day (Goal: 64-128 oz). ${avgWater >= 64 ? 'Meeting goal!' : 'Try to drink more water.'}` : "No hydration data available.",
    mealTiming: `You logged an average of ${avgMealsPerDay.toFixed(1)} eating occasions per day.`,
    improvements: [
      avgFiber < 25 ? "Increase fiber intake with more vegetables and whole grains." : "",
      avgWater < 64 ? "Increase water intake to meet 64oz daily goal." : "",
      adherencePercent < 70 ? "Work on calorie consistency to better meet your goals." : "",
    ].filter(Boolean),
    recommendations: [
      "Track your meals consistently for better insights.",
      "Aim for balanced meals with protein, carbs, and healthy fats.",
      totalWorkouts === 0 ? "Consider adding exercise to support your health goals." : "",
    ].filter(Boolean),
    // New fields with calculated values
    fiberSugarAnalysis: avgFiber > 0 || avgSugar > 0 
      ? `Fiber: ${avgFiber}g/day (Goal: 25-35g) ${avgFiber >= 25 ? '✓' : '⚠'} | Sugar: ${avgSugar}g/day (Limit: <50g) ${avgSugar <= 50 ? '✓' : '⚠'}`
      : "No fiber/sugar data available.",
    sodiumAnalysis: avgSodium > 0 
      ? `Sodium: ${avgSodium}mg/day (Limit: <2300mg) ${avgSodium <= 2300 ? '✓ Within limit' : '⚠ Exceeds limit - may affect blood pressure'}`
      : "No sodium data available.",
    exerciseCorrelation: totalWorkouts > 0
      ? `You completed ${totalWorkouts} workout(s) over ${days.length} days (${(totalWorkouts / days.length * 100).toFixed(0)}% of days). Workout days may need more carbs for recovery.`
      : "No workout data logged. Exercise helps regulate appetite and metabolism.",
    proteinDistribution: avgProtein > 0
      ? `Daily average: ${avgProtein}g. Recommendation: Spread protein across meals (20-40g per meal) for optimal muscle protein synthesis.`
      : "No protein data available.",
    foodVarietyScore: `Variety Score: ${uniqueFoods.length < 10 ? '5/10' : uniqueFoods.length < 20 ? '7/10' : '9/10'} - You consumed ${uniqueFoods.length} unique foods. ${uniqueFoods.length < 10 ? 'Try to add more variety for better micronutrient coverage.' : 'Good variety for nutritional balance!'}`,
    calorieCycling: days.length > 1
      ? `Calorie variance: ±${calorieVariance} cal/day. ${calorieVariance > 500 ? 'High variance detected - this may indicate irregular eating patterns or intentional cycling.' : 'Moderate consistency in daily intake.'}`
      : "Need multiple days to analyze cycling patterns.",
    weekendVsWeekday: weekendAvg > 0 && weekdayAvg > 0
      ? `Weekend avg: ${weekendAvg} cal | Weekday avg: ${weekdayAvg} cal | Difference: ${Math.abs(weekendAvg - weekdayAvg)} cal ${Math.abs(weekendAvg - weekdayAvg) > 500 ? '(Significant weekend effect)' : '(Relatively consistent)'}`
      : "Weekend vs weekday comparison requires both types of days in data.",
    goalAdherence: `${adherencePercent}% of days within 300 cal of ${targetCalories} cal target (${adherenceDays}/${days.length} days). ${adherencePercent >= 80 ? 'Excellent adherence!' : adherencePercent >= 60 ? 'Good adherence with room to improve.' : 'Consider meal planning to improve consistency.'}`,
    bingeRestrictPatterns: bingeRestrictPattern,
    tdeeEstimation: tdeeEstimation,
    mealFrequency: `Average: ${avgMealsPerDay.toFixed(1)} eating occasions/day. ${avgMealsPerDay < 3 ? 'Consider adding snacks to maintain energy.' : avgMealsPerDay > 6 ? 'Frequent small meals can help some people manage hunger.' : 'Good meal frequency range.'}`,
    progressRate: `Rate: ${progressRate}. ${weights.length >= 2 ? (Math.abs(weights[weights.length - 1] - weights[0]) / (days.length / 7)) <= 2 ? 'Healthy pace.' : 'Rapid change - monitor for sustainability.' : 'Track weight regularly to see progress.'}`,
    nutrientTiming: totalWorkouts > 0
      ? `${totalWorkouts} workout(s) logged. Consider consuming carbs 1-2 hours before exercise and protein within 2 hours after for optimal recovery.`
      : "Log workouts to analyze nutrient timing around exercise.",
    deficiencyWarnings: [
      avgFiber < 20 ? "⚠ Low fiber intake may cause digestive issues and impact satiety." : "",
      avgSugar > 50 ? "⚠ High sugar intake may impact energy levels and weight management." : "",
      avgSodium > 2300 ? "⚠ High sodium intake may affect blood pressure over time." : "",
      avgProtein < 50 ? "⚠ Very low protein may lead to muscle loss." : "",
      avgWater < 40 && avgWater > 0 ? "⚠ Low water intake may cause fatigue and headaches." : "",
    ].filter(Boolean),
    consistencyScore: `Consistency Score: ${mealConsistency}/10. ${mealConsistency >= 8 ? 'Excellent eating pattern consistency!' : mealConsistency >= 6 ? 'Moderate consistency - meal planning could help.' : 'High variability - consider establishing regular meal times.'}`,
    weeklyComparison: days.length > 1
      ? `Best day: ${Math.max(...days.map(d => d.calories))} cal | Lowest day: ${Math.min(...days.map(d => d.calories))} cal | Range: ${Math.max(...days.map(d => d.calories)) - Math.min(...days.map(d => d.calories))} cal`
      : undefined,
    workoutReview: totalWorkouts > 0 
      ? `You completed ${totalWorkouts} workout(s) over ${days.length} days. Great job staying active!`
      : "No workout data logged yet. Start tracking your workouts to get personalized feedback.",
    workoutStrengths: totalWorkouts > 0 
      ? ["You're staying consistent with exercise", `${totalWorkouts} workouts logged`]
      : ["Start tracking workouts to see strengths"],
    workoutImprovements: totalWorkouts > 0
      ? ["Try to maintain this consistency", "Mix cardio and strength training"]
      : ["Add 2-3 workouts per week", "Track your workouts for feedback"],
    mealSuggestions: [
      `Grilled chicken with quinoa and vegetables - ~500 cal, 40g protein`,
      `Greek yogurt parfait with berries - ~300 cal, 20g protein`,
      `Salmon with sweet potato - ~550 cal, 35g protein`,
      `Turkey wrap with avocado - ~400 cal, 25g protein`,
    ],
    preWorkoutMeals: [
      `Oatmeal with banana - 1-2hrs before, easy to digest carbs`,
      `Apple with peanut butter - quick energy, 30min before`,
    ],
    postWorkoutMeals: [
      `Protein shake with fruit - within 30min, fast absorbing`,
      `Chicken and rice bowl - within 2hrs, complete recovery meal`,
    ],
  };
}

// Quick analysis function for a single day
export async function analyzeSingleDay(dayData: NutritionData): Promise<string> {
  const result = await analyzeNutritionData(dayData);
  return result.summary;
}

// Compare two periods
export async function comparePeriods(period1: NutritionData[], period2: NutritionData[]): Promise<string> {
  const avg1 = {
    calories: period1.reduce((s, d) => s + d.calories, 0) / period1.length,
    protein: period1.reduce((s, d) => s + d.protein, 0) / period1.length,
    fiber: period1.reduce((s, d) => s + (d.fiber || 0), 0) / period1.length,
  };
  const avg2 = {
    calories: period2.reduce((s, d) => s + d.calories, 0) / period2.length,
    protein: period2.reduce((s, d) => s + d.protein, 0) / period2.length,
    fiber: period2.reduce((s, d) => s + (d.fiber || 0), 0) / period2.length,
  };
  
  const prompt = `Compare these two nutrition periods in detail:

PERIOD 1 (${period1.length} days):
- Avg Calories: ${Math.round(avg1.calories)}
- Avg Protein: ${Math.round(avg1.protein)}g
- Avg Fiber: ${Math.round(avg1.fiber)}g
- Weight change: ${period1.filter(d => d.weight).length > 1 ? 'Multiple measurements' : 'Limited data'}

PERIOD 2 (${period2.length} days):
- Avg Calories: ${Math.round(avg2.calories)}
- Avg Protein: ${Math.round(avg2.protein)}g
- Avg Fiber: ${Math.round(avg2.fiber)}g
- Weight change: ${period2.filter(d => d.weight).length > 1 ? 'Multiple measurements' : 'Limited data'}

Provide a comprehensive comparison covering:
1. Calorie difference and impact
2. Protein adequacy comparison
3. Which period was healthier
4. What changed between periods
5. Recommendations based on the comparison`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Comparison analysis unavailable.";
  } catch {
    return `Period 1: ${Math.round(avg1.calories)} cal/day | Period 2: ${Math.round(avg2.calories)} cal/day. Period ${avg1.calories < avg2.calories ? '1' : '2'} had lower calories.`;
  }
}

// Get personalized meal suggestions based on gaps
export async function getMealSuggestions(analysis: AIAnalysisResult): Promise<string[]> {
  const prompt = `Based on this nutrition analysis, suggest 3 specific meal ideas to address the gaps:

Analysis Summary: ${analysis.summary}
Deficiencies: ${analysis.deficiencyWarnings.join(', ')}
Improvements Needed: ${analysis.improvements.join(', ')}

Provide 3 meal suggestions in this format:
MEAL 1: [Name] - [Description with calories and macros]
MEAL 2: [Name] - [Description with calories and macros]  
MEAL 3: [Name] - [Description with calories and macros]`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      }),
    });

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return text.split('\n').filter(line => line.includes('MEAL')).map(line => line.replace(/^MEAL \d+:\s*/, '').trim());
  } catch {
    return [
      "Grilled chicken salad with quinoa - High protein, fiber rich",
      "Greek yogurt parfait with berries - Protein and antioxidants",
      "Salmon with roasted vegetables - Omega-3s and micronutrients"
    ];
  }
}

export type { AIAnalysisResult, NutritionData };
