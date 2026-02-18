import React, { useEffect, useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useWorkoutLog } from '@/hooks/useWorkoutLog'
import { type WgerExerciseInfo, getExerciseName } from '@/services/wger-exercises'
import { useDebounce } from '@/hooks/useDebounce'
import { Activity, Search, Dumbbell, ExternalLink } from 'lucide-react'

// Generate URL-friendly slug from exercise name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function Exercises() {
  const { addWorkout } = useWorkoutLog()
  const [allExercises, setAllExercises] = useState<WgerExerciseInfo[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 400)

  // Load all exercises once on mount
  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const url = `https://wger.de/api/v2/exerciseinfo/?language=2&limit=1000`
        
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed to fetch exercises: ${res.status}`)
        const data = await res.json()
        const exs: WgerExerciseInfo[] = data.results ?? []
        
        // Sort exercises alphabetically by name
        const sortedExs = exs.sort((a: WgerExerciseInfo, b: WgerExerciseInfo) => 
          getExerciseName(a).localeCompare(getExerciseName(b))
        )
        
        setAllExercises(sortedExs)
      } catch (err) {
        setLoadError('Failed to load exercises. Please try again.')
        console.error('Failed to load exercises:', err)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  // Filter exercises client-side based on search query
  const filteredExercises = useMemo(() => {
    if (!debouncedQuery.trim()) return allExercises
    
    const searchTerm = debouncedQuery.toLowerCase().trim()
    return allExercises.filter(ex => {
      const name = getExerciseName(ex).toLowerCase()
      // Also search in muscle names
      const muscleNames = ex.muscles?.map(m => (m.name_en || m.name).toLowerCase()).join(' ') || ''
      // Also search in equipment names
      const equipmentNames = ex.equipment?.map(e => e.name.toLowerCase()).join(' ') || ''
      
      return name.includes(searchTerm) || 
             muscleNames.includes(searchTerm) || 
             equipmentNames.includes(searchTerm)
    })
  }, [allExercises, debouncedQuery])

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6">
      <header className="mb-6 flex items-center gap-2">
        <Activity className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Exercise Library</h1>
      </header>

      {loadError && (
        <div className="p-4 mb-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
          <div className="flex items-center justify-between">
            <span>{loadError}</span>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search exercises by name, muscle, or equipment..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${filteredExercises.length} of ${allExercises.length} exercise${filteredExercises.length !== 1 ? 's' : ''}`}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setQuery('')}
            disabled={!query}
          >
            Clear Search
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Dumbbell className="h-8 w-8 mb-3 animate-bounce" />
          <p>Loading exercises...</p>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-1">No exercises found</p>
          <p className="text-sm">
            {debouncedQuery 
              ? `No results for "${debouncedQuery}"` 
              : 'Try adjusting your search terms'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExercises.map(ex => {
            const name = getExerciseName(ex)
            const slug = generateSlug(name)
            const muscles = ex.muscles?.slice(0, 3) || []
            const equipment = ex.equipment || []
            
            return (
              <div 
                key={ex.id} 
                className="border rounded-lg bg-card p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2">{name}</h3>
                    
                    {/* Muscles */}
                    {muscles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {muscles.map((muscle, idx) => (
                          <span 
                            key={idx} 
                            className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                          >
                            {muscle.name_en || muscle.name}
                          </span>
                        ))}
                        {ex.muscles.length > 3 && (
                          <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                            +{ex.muscles.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Equipment */}
                    {equipment.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {equipment.map((eq, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs"
                          >
                            {eq.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* View on wger.de */}
                    <a 
                      href={`https://wger.de/en/exercise/${ex.id}/view/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View on wger.de
                    </a>
                  </div>
                  
                  <Button 
                    size="sm"
                    onClick={() => addWorkout({ name })}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
