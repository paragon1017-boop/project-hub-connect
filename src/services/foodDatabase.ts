// src/services/foodDatabase.ts

// FoodData Central format from USDA
export interface FoodNutrient {
  nutrient: {
    id: number
    name: string
    unitName: string
  }
  amount: number
}

export interface BrandedFood {
  fdcId: number
  description: string
  brandName?: string
  brandOwner?: string
  ingredients?: string
  servingSize?: number
  servingSizeUnit?: string
  foodNutrients: FoodNutrient[]
}

// Simplified format for the app
export interface SimplifiedFood {
  id: string
  name: string
  brand: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
  servingSize: string
  ingredients?: string
}

// Parse nutrients from FoodData Central format
function parseNutrients(nutrients: FoodNutrient[]) {
  let calories = 0
  let protein = 0
  let carbs = 0
  let fat = 0
  let fiber = 0
  let sugar = 0
  let sodium = 0

  nutrients.forEach(n => {
    const name = n.nutrient?.name?.toLowerCase() || ''
    if (name.includes('energy') && (name.includes('kcal') || n.nutrient.unitName === 'kcal')) {
      calories = n.amount || 0
    } else if (name === 'protein') {
      protein = n.amount || 0
    } else if (name.includes('carbohydrate')) {
      carbs = n.amount || 0
    } else if (name === 'total lipid (fat)' || name === 'fat') {
      fat = n.amount || 0
    } else if (name.includes('fiber')) {
      fiber = n.amount || 0
    } else if (name.includes('sugar')) {
      sugar = n.amount || 0
    } else if (name.includes('sodium')) {
      sodium = n.amount || 0
    }
  })

  return { calories, protein, carbs, fat, fiber, sugar, sodium }
}

// Convert FoodData Central format to simplified format
function simplifyFood(food: BrandedFood): SimplifiedFood {
  const nutrients = parseNutrients(food.foodNutrients || [])
  const servingSize = food.servingSize && food.servingSizeUnit
    ? `${food.servingSize}${food.servingSizeUnit}`
    : 'serving'

  return {
    id: String(food.fdcId),
    name: food.description,
    brand: food.brandName || food.brandOwner || 'Unknown Brand',
    calories: nutrients.calories,
    protein: nutrients.protein,
    carbs: nutrients.carbs,
    fat: nutrients.fat,
    fiber: nutrients.fiber,
    sugar: nutrients.sugar,
    sodium: nutrients.sodium,
    servingSize,
    ingredients: food.ingredients,
  }
}

const cachedFoods: Map<string, SimplifiedFood> = new Map()
const loadedChunks: Set<string> = new Set()
const totalChunks = 46 // Total number of chunk files

// Get list of all chunk files
function getChunkFiles(): string[] {
  const chunks: string[] = []
  for (let i = 1; i <= totalChunks; i++) {
    chunks.push(`branded_food_part_${String(i).padStart(3, '0')}.json`)
  }
  return chunks
}

// Load a specific chunk
async function loadChunk(chunkName: string): Promise<SimplifiedFood[]> {
  if (loadedChunks.has(chunkName)) {
    // Return cached foods from this chunk
    return Array.from(cachedFoods.values()).filter(f => {
      // Simple heuristic: check if food id contains chunk number
      return f.id.includes(chunkName.replace(/\D/g, ''))
    })
  }

  try {
    const res = await fetch(`/Data/${chunkName}`)
    if (!res.ok) {
      console.warn(`Failed to load chunk: ${chunkName}`)
      return []
    }
    const data = await res.json()
    
    // Handle FoodData Central format
    const foods: BrandedFood[] = data.BrandedFoods || data
    const simplified = foods.map(simplifyFood)
    
    // Cache the foods
    simplified.forEach(food => {
      cachedFoods.set(food.id, food)
    })
    loadedChunks.add(chunkName)
    
    console.log(`Loaded ${simplified.length} foods from ${chunkName}`)
    return simplified
  } catch (err) {
    console.error(`Error loading chunk ${chunkName}:`, err)
    return []
  }
}

// Search branded foods
export async function searchBrandedFoods(query: string, limit: number = 100): Promise<SimplifiedFood[]> {
  const searchTerm = query.toLowerCase().trim()
  const results: SimplifiedFood[] = []
  const chunkFiles = getChunkFiles()
  
  // If no search term, return featured foods from first chunk
  if (!searchTerm) {
    const foods = await loadChunk(chunkFiles[0])
    return foods.slice(0, limit)
  }
  
  // Load chunks one by one and search
  for (const chunkName of chunkFiles) {
    const foods = await loadChunk(chunkName)
    
    const matches = foods.filter(food => 
      food.name.toLowerCase().includes(searchTerm) ||
      food.brand.toLowerCase().includes(searchTerm)
    )
    
    results.push(...matches)
    
    // Stop if we have enough results
    if (results.length >= limit) {
      return results.slice(0, limit)
    }
  }
  
  return results
}

// Get featured foods (from first chunk)
export async function getFeaturedFoods(limit: number = 50): Promise<SimplifiedFood[]> {
  const chunkFiles = getChunkFiles()
  if (chunkFiles.length === 0) return []
  
  const foods = await loadChunk(chunkFiles[0])
  return foods.slice(0, limit)
}

// Get food by ID
export async function getFoodById(id: string): Promise<SimplifiedFood | undefined> {
  // Check cache first
  if (cachedFoods.has(id)) {
    return cachedFoods.get(id)
  }
  
  // Search through chunks
  const chunkFiles = getChunkFiles()
  for (const chunkName of chunkFiles) {
    const foods = await loadChunk(chunkName)
    const food = foods.find(f => f.id === id)
    if (food) return food
  }
  
  return undefined
}

// Get foods by brand
export async function getFoodsByBrand(brand: string, limit: number = 100): Promise<SimplifiedFood[]> {
  const chunkFiles = getChunkFiles()
  const results: SimplifiedFood[] = []
  
  for (const chunkName of chunkFiles) {
    const foods = await loadChunk(chunkName)
    const matches = foods.filter(food => 
      food.brand.toLowerCase() === brand.toLowerCase()
    )
    results.push(...matches)
    
    if (results.length >= limit) {
      return results.slice(0, limit)
    }
  }
  
  return results
}

// Get unique brands (requires loading all chunks - expensive!)
export async function getAllBrands(): Promise<string[]> {
  const chunkFiles = getChunkFiles()
  const brands = new Set<string>()
  
  for (const chunkName of chunkFiles) {
    const foods = await loadChunk(chunkName)
    foods.forEach(food => brands.add(food.brand))
  }
  
  return Array.from(brands).sort()
}

// Get database stats
export function getDatabaseStats(): { totalChunks: number; loadedChunks: number; cachedFoods: number } {
  return {
    totalChunks,
    loadedChunks: loadedChunks.size,
    cachedFoods: cachedFoods.size,
  }
}

// Check if database is loading
export function isFoodDatabaseLoaded(): boolean {
  return loadedChunks.size > 0
}
