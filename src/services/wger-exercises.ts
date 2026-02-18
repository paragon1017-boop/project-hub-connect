export type WgerExercise = {
  id: number;
  name: string;
  description?: string;
  muscles?: number[];
  equipment?: number[];
};

export type WgerExerciseInfo = {
  id: number;
  category: { id: number; name: string };
  muscles: { id: number; name: string; name_en: string }[];
  muscles_secondary: { id: number; name: string; name_en: string }[];
  equipment: { id: number; name: string }[];
  translations: { id: number; name: string; language: number }[];
};

export type WgerMuscle = { id: number; name: string };
export type WgerEquipment = { id: number; name: string };

export async function fetchWgerExercises(limit: number = 100, language: number = 2): Promise<WgerExercise[]> {
  // Simple non-cached fetch (backwards compatibility)
  const url = `https://wger.de/api/v2/exercise/?language=${language}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch exercises: ${res.status}`);
  const data = await res.json();
  return data.results ?? [];
}

// Fetch exercises with full info including translations
export async function fetchWgerExerciseInfos(limit: number = 200, language: number = 2, query?: string): Promise<WgerExerciseInfo[]> {
  const url = query
    ? `https://wger.de/api/v2/exerciseinfo/?language=${language}&limit=${limit}&search=${encodeURIComponent(query)}`
    : `https://wger.de/api/v2/exerciseinfo/?language=${language}&limit=${limit}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch exercises: ${res.status}`);
  const data = await res.json();
  return data.results ?? [];
}

// Cached version with a TTL (default 24 hours)
export async function fetchWgerExercisesCached(limit: number = 100, language: number = 2, ttlMs: number = 24 * 60 * 60 * 1000, query?: string): Promise<WgerExercise[]> {
  const key = `wger_ex_${language}_${limit}_${query ?? 'all'}`;
  const cached = localStorage.getItem(key);
  const now = Date.now();
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as { ts: number; data: WgerExercise[] };
      if (typeof parsed?.ts === 'number' && now - parsed.ts < ttlMs) return parsed.data;
    } catch {
      // fallthrough to re-fetch
    }
  }

  // Build URL; if query provided, attempt to search (API may ignore unknown query param if unsupported)
  const url = query
    ? `https://wger.de/api/v2/exercise/?language=${language}&limit=${limit}&search=${encodeURIComponent(query)}`
    : `https://wger.de/api/v2/exercise/?language=${language}&limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch exercises: ${res.status}`);
  const data = await res.json();
  const list = data.results ?? [];
  localStorage.setItem(key, JSON.stringify({ ts: now, data: list }));
  return list;
}

export async function fetchWgerMuscles(): Promise<Record<number, string>> {
  const url = `https://wger.de/api/v2/muscle/?limit=1000`;
  const res = await fetch(url);
  if (!res.ok) return {};
  const data = await res.json();
  const map: Record<number, string> = {};
  (data.results ?? []).forEach((m: any) => {
    if (typeof m.id === 'number' && m.name) map[m.id] = m.name;
  });
  return map;
}

export async function fetchWgerEquipments(): Promise<Record<number, string>> {
  const url = `https://wger.de/api/v2/equipment/?limit=1000`;
  const res = await fetch(url);
  if (!res.ok) return {};
  const data = await res.json();
  const map: Record<number, string> = {};
  (data.results ?? []).forEach((e: any) => {
    if (typeof e.id === 'number' && e.name) map[e.id] = e.name;
  });
  return map;
}

// Cached wrappers for muscle/equipment data
export async function fetchWgerMusclesCached(): Promise<Record<number, string>> {
  const key = 'wger_muscles';
  const ttl = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const cachedRaw = localStorage.getItem(key);
  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw) as { ts: number; data: Record<number, string> };
      if (typeof cached?.ts === 'number' && now - cached.ts < ttl) return cached.data;
    } catch {}
  }
  const data = await fetchWgerMuscles();
  localStorage.setItem(key, JSON.stringify({ ts: now, data }));
  return data;
}

export async function fetchWgerEquipmentsCached(): Promise<Record<number, string>> {
  const key = 'wger_equipments';
  const ttl = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const cachedRaw = localStorage.getItem(key);
  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw) as { ts: number; data: Record<number, string> };
      if (typeof cached?.ts === 'number' && now - cached.ts < ttl) return cached.data;
    } catch {}
  }
  const data = await fetchWgerEquipments();
  localStorage.setItem(key, JSON.stringify({ ts: now, data }));
  return data;
}

// Get exercise name from translations
export function getExerciseName(exercise: WgerExerciseInfo, language: number = 2): string {
  const translation = exercise.translations?.find(t => t.language === language);
  return translation?.name || `Exercise ${exercise.id}`;
}
