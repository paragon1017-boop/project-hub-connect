import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'

import { FavoritesProvider } from '../src/contexts/FavoritesContext'
import FoodResultCard, { FoodProduct } from '../src/components/FoodResultCard'

describe('Favorites toggle adds product with full nutrient fields', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves missing nutrients as zeros when adding to favorites', async () => {
    const product: FoodProduct = {
      code: 'prod-ui-test',
      product_name: 'UI Test Product',
      nutriments: {},
    }

    localStorage.setItem('food_favorites', JSON.stringify([]))

    render(
      <FavoritesProvider>
        <FoodResultCard product={product} onAdd={() => {}} />
      </FavoritesProvider>
    )

    const toggle = screen.getByLabelText('toggle-favorite')
    fireEvent.click(toggle)

    // Allow microtask queue to flush
    await new Promise((r) => setTimeout(r, 0))

    const raw = localStorage.getItem('food_favorites')
    const list = JSON.parse(raw ?? '[]') as any[]
    expect(list.length).toBe(1)
    const item = list[0]
    expect(item.id).toBe(product.code)
    expect(item.name).toBe(product.product_name)
    expect(item.calories).toBe(0)
    expect(item.fiber).toBe(0)
    expect(item.sugar).toBe(0)
    expect(item.sodium).toBe(0)
  })
})
