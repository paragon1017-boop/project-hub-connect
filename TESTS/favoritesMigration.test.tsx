import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'

import { FavoritesProvider, useFavorites } from '../src/contexts/FavoritesContext'

function MigrationRunner({ onDone }: { onDone: (r: { migrated: number; total: number }) => void }) {
  const { migrateFavorites } = useFavorites()
  React.useEffect(() => {
    if (typeof migrateFavorites === 'function') {
      const res = migrateFavorites()
      onDone(res)
    }
  }, [])
  return null
}

describe('Favorites migration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('migrates missing nutrition fields and updates localStorage', async () => {
    const initial = [
      { id: 'apple', name: 'Apple', calories: 100 }, // missing fiber/sugar/sodium
      { id: 'banana', name: 'Banana', calories: 60, fiber: 2, sugar: 1, sodium: 5 }, // already complete
    ]
    localStorage.setItem('food_favorites', JSON.stringify(initial))

    let result: { migrated: number; total: number } | null = null

    render(
      <FavoritesProvider>
        <MigrationRunner onDone={(r) => (result = r)} />
      </FavoritesProvider>
    )

    await waitFor(() => expect(result).not.toBeNull())
    expect(result).toEqual({ migrated: 1, total: 2 })

    const raw = localStorage.getItem('food_favorites')
    const list = JSON.parse(raw || '[]') as any[]
    expect(list.length).toBe(2)
    expect(list[0].fiber).toBe(0)
    expect(list[0].sugar).toBe(0)
    expect(list[0].sodium).toBe(0)
  })
})
