// src/services/multiAI.ts
// Multi-AI ensemble approach using Gemini, Groq, and Mistral

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDCE2MXVlWv224jJyvJ9Bo4jBHp432W3_Y";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || "";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export type AIProvider = 'gemini' | 'groq' | 'mistral';

export interface ProviderResult {
  provider: AIProvider;
  success: boolean;
  summary: string;
  insights: string[];
  recommendations: string[];
  error?: string;
  latency?: number;
}

export interface MultiAIResult {
  gemini: ProviderResult | null;
  groq: ProviderResult | null;
  mistral: ProviderResult | null;
  combined: {
    consensusInsights: string[];
    uniqueInsights: { gemini: string[]; groq: string[]; mistral: string[] };
    allRecommendations: string[];
    combinedSummary: string;
  };
  totalLatency: number;
}

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

function buildPrompt(days: NutritionData[]): string {
  const totalCalories = days.reduce((sum, d) => sum + d.calories, 0);
  const totalProtein = days.reduce((sum, d) => sum + d.protein, 0);
  const avgCalories = Math.round(totalCalories / days.length);
  const avgProtein = Math.round(totalProtein / days.length);
  const avgCarbs = Math.round(days.reduce((sum, d) => sum + d.carbs, 0) / days.length);
  const avgFat = Math.round(days.reduce((sum, d) => sum + d.fat, 0) / days.length);
  const avgFiber = Math.round(days.reduce((sum, d) => sum + (d.fiber || 0), 0) / days.length);
  const avgSugar = Math.round(days.reduce((sum, d) => sum + (d.sugar || 0), 0) / days.length);
  const avgSodium = Math.round(days.reduce((sum, d) => sum + (d.sodium || 0), 0) / days.length);
  
  const weights = days.filter(d => d.weight).map(d => d.weight!);
  const waters = days.filter(d => d.water).map(d => d.water!);
  const avgWater = waters.length > 0 ? Math.round(waters.reduce((a, b) => a + b, 0) / waters.length) : 0;
  
  const allFoods = days.flatMap(d => d.foods);
  const uniqueFoods = [...new Set(allFoods.map(f => f.food_name))];
  const allWorkouts = days.flatMap(d => d.workouts || []);
  const totalWorkouts = allWorkouts.length;
  const totalWorkoutDuration = allWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalCaloriesBurned = allWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  
  const programGoal = days.find(d => d.programGoal)?.programGoal;

  return `Analyze this nutrition and fitness data over ${days.length} days and provide insights.

DATA SUMMARY:
- Average daily: ${avgCalories} cal, ${avgProtein}g protein, ${avgCarbs}g carbs, ${avgFat}g fat
- Fiber: ${avgFiber}g/day, Sugar: ${avgSugar}g/day, Sodium: ${avgSodium}mg/day
${weights.length > 0 ? `- Weight: ${Math.min(...weights)} - ${Math.max(...weights)} lbs` : ''}
${avgWater > 0 ? `- Water: ${avgWater} oz/day` : ''}
- Unique foods: ${uniqueFoods.length}
${totalWorkouts > 0 ? `- Workouts: ${totalWorkouts} sessions, ${totalWorkoutDuration} min, ${totalCaloriesBurned} cal burned` : ''}
${programGoal?.type ? `- Goal: ${programGoal.type} (${programGoal.targetCalories || 'no target'} cal)` : ''}

DAILY DATA:
${days.slice(0, 5).map(d => `${d.date}: ${d.calories} cal, ${d.protein}g protein, ${d.foods?.length || 0} meals, ${d.workouts?.length || 0} workouts`).join('\n')}

Respond in EXACTLY this format:
SUMMARY: [2-3 sentence overview]

INSIGHTS:
- [insight 1]
- [insight 2]
- [insight 3]

RECOMMENDATIONS:
- [recommendation 1]
- [recommendation 2]
- [recommendation 3]`;
}

function parseResponse(text: string): { summary: string; insights: string[]; recommendations: string[] } {
  const getSection = (label: string): string => {
    const regex = new RegExp(`${label}[:\\s]*(.*?)(?=\\n[A-Z]+:|$)`, 'is');
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };
  
  const getBulletPoints = (section: string): string[] => {
    return section
      .split("\n")
      .filter(line => line.trim().match(/^[-•*]\s/) || line.trim().match(/^\d+\.\s/))
      .map(line => line.replace(/^[-•*\d.]\s*/, "").trim())
      .filter(line => line.length > 0);
  };

  return {
    summary: getSection("SUMMARY"),
    insights: getBulletPoints(getSection("INSIGHTS")),
    recommendations: getBulletPoints(getSection("RECOMMENDATIONS")),
  };
}

async function callWithRetry(fn: () => Promise<Response>, maxRetries = 2): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      if (response.status === 429 && i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      return response;
    } catch (e) {
      lastError = e as Error;
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 500 * (i + 1)));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

const GEMINI_COOLDOWN_KEY = 'gemini_rate_limited_until';

function isGeminiRateLimited(): boolean {
  const until = localStorage.getItem(GEMINI_COOLDOWN_KEY);
  if (until && Date.now() < parseInt(until)) {
    return true;
  }
  localStorage.removeItem(GEMINI_COOLDOWN_KEY);
  return false;
}

function setGeminiRateLimited(seconds: number) {
  localStorage.setItem(GEMINI_COOLDOWN_KEY, String(Date.now() + seconds * 1000));
}

async function callGemini(prompt: string): Promise<ProviderResult> {
  const start = Date.now();
  
  if (isGeminiRateLimited()) {
    return { 
      provider: 'gemini', 
      success: false, 
      latency: 0,
      summary: '', 
      insights: [], 
      recommendations: [],
      error: 'Cooldown (rate limited recently)' 
    };
  }
  
  try {
    const response = await callWithRetry(() => 
      fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      })
    );

    if (response.status === 429) {
      setGeminiRateLimited(60);
      return { 
        provider: 'gemini', 
        success: false, 
        latency: Date.now() - start,
        summary: '', 
        insights: [], 
        recommendations: [],
        error: 'Rate limited (60s cooldown)' 
      };
    }

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = parseResponse(text);

    return { provider: 'gemini', success: true, latency: Date.now() - start, ...parsed };
  } catch (error) {
    return { 
      provider: 'gemini', 
      success: false, 
      latency: Date.now() - start,
      summary: '', 
      insights: [], 
      recommendations: [],
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function callGroq(prompt: string): Promise<ProviderResult> {
  const start = Date.now();
  if (!GROQ_API_KEY) {
    return { provider: 'groq', success: false, summary: '', insights: [], recommendations: [], error: 'No API key' };
  }
  
  try {
    const response = await callWithRetry(() =>
      fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      })
    );

    if (response.status === 429) {
      return { 
        provider: 'groq', 
        success: false, 
        latency: Date.now() - start,
        summary: '', 
        insights: [], 
        recommendations: [],
        error: 'Rate limited' 
      };
    }

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || "";
    const parsed = parseResponse(text);

    return { provider: 'groq', success: true, latency: Date.now() - start, ...parsed };
  } catch (error) {
    return { 
      provider: 'groq', 
      success: false, 
      latency: Date.now() - start,
      summary: '', 
      insights: [], 
      recommendations: [],
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function callMistral(prompt: string): Promise<ProviderResult> {
  const start = Date.now();
  if (!MISTRAL_API_KEY) {
    return { provider: 'mistral', success: false, summary: '', insights: [], recommendations: [], error: 'No API key' };
  }
  
  try {
    const response = await callWithRetry(() =>
      fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      })
    );

    if (response.status === 429) {
      return { 
        provider: 'mistral', 
        success: false, 
        latency: Date.now() - start,
        summary: '', 
        insights: [], 
        recommendations: [],
        error: 'Rate limited' 
      };
    }

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || "";
    const parsed = parseResponse(text);

    return { provider: 'mistral', success: true, latency: Date.now() - start, ...parsed };
  } catch (error) {
    return { 
      provider: 'mistral', 
      success: false, 
      latency: Date.now() - start,
      summary: '', 
      insights: [], 
      recommendations: [],
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

function combineResults(gemini: ProviderResult | null, groq: ProviderResult | null, mistral: ProviderResult | null): MultiAIResult['combined'] {
  const successfulResults = [gemini, groq, mistral].filter((r): r is ProviderResult => r !== null && r.success);
  const providerNames = successfulResults.map(r => r.provider);
  
  const allInsights = successfulResults.flatMap(r => r.insights);
  const allRecommendations = successfulResults.flatMap(r => r.recommendations);
  
  const insightCounts = new Map<string, number>();
  allInsights.forEach(insight => {
    const normalized = insight.toLowerCase().substring(0, 50);
    insightCounts.set(normalized, (insightCounts.get(normalized) || 0) + 1);
  });
  
  const consensusInsights = allInsights.filter(insight => {
    const normalized = insight.toLowerCase().substring(0, 50);
    return (insightCounts.get(normalized) || 0) >= 2;
  });
  
  const uniqueInsights = {
    gemini: gemini?.success ? gemini.insights.filter(i => !consensusInsights.includes(i)) : [],
    groq: groq?.success ? groq.insights.filter(i => !consensusInsights.includes(i)) : [],
    mistral: mistral?.success ? mistral.insights.filter(i => !consensusInsights.includes(i)) : [],
  };
  
  let combinedSummary = '';
  if (successfulResults.length === 0) {
    combinedSummary = 'All AI providers are currently unavailable. Please try again later.';
  } else if (successfulResults.length === 1) {
    combinedSummary = `${successfulResults[0].provider.toUpperCase()} analysis: ${successfulResults[0].summary}`;
  } else {
    combinedSummary = `${successfulResults.length} AI models (${providerNames.join(', ')}) analyzed your data. ${successfulResults[0].summary}`;
  }
  
  return {
    consensusInsights: [...new Set(consensusInsights)].slice(0, 5),
    uniqueInsights,
    allRecommendations: [...new Set(allRecommendations)].slice(0, 10),
    combinedSummary,
  };
}

export async function multiAIAnalysis(data: NutritionData | NutritionData[]): Promise<MultiAIResult> {
  const days = Array.isArray(data) ? data : [data];
  const prompt = buildPrompt(days);
  
  // Call Gemini first, then Groq + Mistral together
  const geminiResult = await callGemini(prompt);
  
  // Small delay before calling others to spread out API calls
  await new Promise(r => setTimeout(r, 500));
  
  // Then call Groq and Mistral together
  const [groqResult, mistralResult] = await Promise.all([
    callGroq(prompt),
    callMistral(prompt),
  ]);
  
  const combined = combineResults(geminiResult, groqResult, mistralResult);
  const totalLatency = Math.max(
    geminiResult?.latency || 0,
    groqResult?.latency || 0,
    mistralResult?.latency || 0
  );
  
  return {
    gemini: geminiResult,
    groq: groqResult,
    mistral: mistralResult,
    combined,
    totalLatency,
  };
}

export type { NutritionData };
