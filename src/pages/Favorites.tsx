import React, { useState } from 'react'
import { Heart, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FoodProduct } from '@/components/FoodResultCard'
import { useFoodLog } from '@/hooks/useFoodLog'
import { useToast } from '@/hooks/use-toast'
import { FavItem } from '@/contexts/FavoritesContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Favorites() {
  const { addFood } = useFoodLog()
  const { favorites, migrateFavorites, removeFavorite, addFavorite } = useFavorites()
  const { toast } = useToast()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FavItem | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    serving_size: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
  })

  const runMigrationFavorites = () => {
    if (typeof migrateFavorites === 'function') {
      const res = migrateFavorites();
      toast({ title: 'Favorites migration', description: `${res.migrated} of ${res.total} items updated` });
    } else {
      toast({ title: 'Migration unavailable', description: 'Please upgrade to enable migration.' });
    }
  }

  const remove = (id: string) => {
    if (!window.confirm("Remove this favorite? This action cannot be undone.")) {
      return
    }
    removeFavorite(id)
  }

  const openEditDialog = (item: FavItem) => {
    setEditingItem(item)
    setEditForm({
      name: item.name,
      serving_size: item.serving_size || "",
      calories: String(item.calories ?? ""),
      protein: String(item.protein ?? ""),
      carbs: String(item.carbs ?? ""),
      fat: String(item.fat ?? ""),
      fiber: String(item.fiber ?? ""),
      sugar: String(item.sugar ?? ""),
      sodium: String(item.sodium ?? ""),
    })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingItem) return

    const updatedItem: FavItem = {
      ...editingItem,
      name: editForm.name,
      serving_size: editForm.serving_size,
      calories: Number(editForm.calories) || 0,
      protein: Number(editForm.protein) || 0,
      carbs: Number(editForm.carbs) || 0,
      fat: Number(editForm.fat) || 0,
      fiber: Number(editForm.fiber) || 0,
      sugar: Number(editForm.sugar) || 0,
      sodium: Number(editForm.sodium) || 0,
    }

    removeFavorite(editingItem.id)
    addFavorite(updatedItem)
    
    toast({ title: 'Updated!', description: `${editForm.name} has been updated.` })
    setEditDialogOpen(false)
    setEditingItem(null)
  }

  // Helper to detect extended vitamins/minerals on a favorite
  const hasExtendedFav = (f: FavItem) => {
    const vals = [
      f.vitaminA, f.vitaminD, f.vitaminE, f.vitaminK, f.vitaminC,
      f.vitaminB1, f.vitaminB2, f.vitaminB3, f.vitaminB6, f.vitaminB9, f.vitaminB12,
      f.biotin, f.pantothenicAcid,
      f.calcium, f.iron, f.magnesium, f.phosphorus, f.potassium, f.zinc, f.copper, f.selenium, f.manganese
    ];
    return vals.some(v => v != null && v > 0);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <Button variant="outline" onClick={runMigrationFavorites} className="mb-3">Migrate Favorites</Button>
      <h1 className="text-xl font-bold mb-4">Favorites</h1>
      
      {favorites.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Old favorites may show 0 for nutrients. 
            Please remove and re-add them from search to get complete nutrition data.
          </p>
        </div>
      )}
      
      {favorites.length === 0 ? (
        <p className="text-muted-foreground">No favorites yet. Tap the heart on a search result to save it here.</p>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {favorites.map(it => {
            const hasVitamins = (it.vitaminA || it.vitaminD || it.vitaminE || it.vitaminK || it.vitaminC || it.vitaminB1 || it.vitaminB2 || it.vitaminB3 || it.vitaminB6 || it.vitaminB9 || it.vitaminB12 || it.biotin || it.pantothenicAcid);
            const hasMinerals = (it.calcium || it.iron || it.magnesium || it.phosphorus || it.potassium || it.zinc || it.copper || it.selenium || it.manganese);
            const isExpanded = expandedId === it.id;
            
            return (
            <div key={it.id} className="border rounded bg-card overflow-hidden">
              <div className="flex items-center justify-between p-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{it.name}</div>
                {it.serving_size && (
                  <div className="text-xs text-muted-foreground">{it.serving_size}</div>
                )}
              <div className="text-xs text-muted-foreground">
                {it.calories ?? 0} kcal
                {` · P ${it.protein ?? 0}g`}
                {` · C ${it.carbs ?? 0}g`}
                {` · F ${it.fat ?? 0}g`}
                {` · Fiber ${it.fiber ?? 0}g`}
                {` · Sugar ${it.sugar ?? 0}g`}
                {` · Sodium ${it.sodium ?? 0}mg`}
              </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Hidden vitamins/minerals toggle - {(hasVitamins || hasMinerals) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setExpandedId(isExpanded ? null : it.id)}
                    aria-label="toggle-vitamins"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                )} */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => openEditDialog(it)}
                  aria-label="edit-favorite"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => {
                    const fav = it;
                    const product: FoodProduct & { quantity?: number } = {
                      product_name: fav.name,
                      serving_size: fav.serving_size,
                      quantity: 1,
                      nutriments: {
                        'energy-kcal_100g': fav.calories ?? 0,
                        proteins_100g: fav.protein ?? 0,
                        carbohydrates_100g: fav.carbs ?? 0,
                        fat_100g: fav.fat ?? 0,
                        fiber_100g: fav.fiber ?? 0,
                        sugars_100g: fav.sugar ?? 0,
                        sodium_100g: fav.sodium ?? 0,
                      },
                    }
                    addFood.mutate(product, {
                      onSuccess: () => toast({ title: 'Added to Home', description: `${fav.name} added to home` }),
                      onError: (error) => toast({ variant: 'destructive', title: 'Error', description: error?.message || 'Failed to add to home' }),
                    })
                  }} 
                  aria-label="add-to-home"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive" 
                  onClick={() => remove(it.id)} 
                  aria-label="remove-favorite"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              </div>
              
              {/* Hidden Expanded Vitamins & Minerals section
              {isExpanded && (hasVitamins || hasMinerals) && (
                <div className="px-3 pb-3 border-t bg-muted/30">
                  {hasVitamins && (
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Vitamins</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                        {it.vitaminA ? <div><span className="text-muted-foreground">Vitamin A</span> {it.vitaminA.toFixed(1)}mcg</div> : null}
                        {it.vitaminD ? <div><span className="text-muted-foreground">Vitamin D</span> {it.vitaminD.toFixed(1)}mcg</div> : null}
                        {it.vitaminE ? <div><span className="text-muted-foreground">Vitamin E</span> {it.vitaminE.toFixed(1)}mg</div> : null}
                        {it.vitaminK ? <div><span className="text-muted-foreground">Vitamin K</span> {it.vitaminK.toFixed(1)}mcg</div> : null}
                        {it.vitaminC ? <div><span className="text-muted-foreground">Vitamin C</span> {it.vitaminC.toFixed(1)}mg</div> : null}
                        {it.vitaminB1 ? <div><span className="text-muted-foreground">B1</span> {it.vitaminB1.toFixed(1)}mg</div> : null}
                        {it.vitaminB2 ? <div><span className="text-muted-foreground">B2</span> {it.vitaminB2.toFixed(1)}mg</div> : null}
                        {it.vitaminB3 ? <div><span className="text-muted-foreground">B3</span> {it.vitaminB3.toFixed(1)}mg</div> : null}
                        {it.vitaminB6 ? <div><span className="text-muted-foreground">B6</span> {it.vitaminB6.toFixed(1)}mg</div> : null}
                        {it.vitaminB9 ? <div><span className="text-muted-foreground">Folate</span> {it.vitaminB9.toFixed(1)}mcg</div> : null}
                        {it.vitaminB12 ? <div><span className="text-muted-foreground">B12</span> {it.vitaminB12.toFixed(1)}mcg</div> : null}
                        {it.biotin ? <div><span className="text-muted-foreground">Biotin</span> {it.biotin.toFixed(1)}mcg</div> : null}
                        {it.pantothenicAcid ? <div><span className="text-muted-foreground">B5</span> {it.pantothenicAcid.toFixed(1)}mg</div> : null}
                      </div>
                    </div>
                  )}
                  {hasMinerals && (
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Minerals</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                        {it.calcium ? <div><span className="text-muted-foreground">Calcium</span> {it.calcium.toFixed(1)}mg</div> : null}
                        {it.iron ? <div><span className="text-muted-foreground">Iron</span> {it.iron.toFixed(1)}mg</div> : null}
                        {it.magnesium ? <div><span className="text-muted-foreground">Magnesium</span> {it.magnesium.toFixed(1)}mg</div> : null}
                        {it.phosphorus ? <div><span className="text-muted-foreground">Phosphorus</span> {it.phosphorus.toFixed(1)}mg</div> : null}
                        {it.potassium ? <div><span className="text-muted-foreground">Potassium</span> {it.potassium.toFixed(1)}mg</div> : null}
                        {it.zinc ? <div><span className="text-muted-foreground">Zinc</span> {it.zinc.toFixed(1)}mg</div> : null}
                        {it.copper ? <div><span className="text-muted-foreground">Copper</span> {it.copper.toFixed(1)}mg</div> : null}
                        {it.selenium ? <div><span className="text-muted-foreground">Selenium</span> {it.selenium.toFixed(1)}mcg</div> : null}
                        {it.manganese ? <div><span className="text-muted-foreground">Manganese</span> {it.manganese.toFixed(1)}mg</div> : null}
                      </div>
                    </div>
                  )}
                </div>
              )}
              */}
            </div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Favorite</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Food Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="e.g., Chicken Breast"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-serving">Serving Size</Label>
              <Input
                id="edit-serving"
                value={editForm.serving_size}
                onChange={e => setEditForm({ ...editForm, serving_size: e.target.value })}
                placeholder="e.g., 100g, 1 cup"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-calories">Calories</Label>
                <Input
                  id="edit-calories"
                  type="number"
                  value={editForm.calories}
                  onChange={e => setEditForm({ ...editForm, calories: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-protein">Protein (g)</Label>
                <Input
                  id="edit-protein"
                  type="number"
                  value={editForm.protein}
                  onChange={e => setEditForm({ ...editForm, protein: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-carbs">Carbs (g)</Label>
                <Input
                  id="edit-carbs"
                  type="number"
                  value={editForm.carbs}
                  onChange={e => setEditForm({ ...editForm, carbs: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fat">Fat (g)</Label>
                <Input
                  id="edit-fat"
                  type="number"
                  value={editForm.fat}
                  onChange={e => setEditForm({ ...editForm, fat: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fiber">Fiber (g)</Label>
                <Input
                  id="edit-fiber"
                  type="number"
                  value={editForm.fiber}
                  onChange={e => setEditForm({ ...editForm, fiber: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sugar">Sugar (g)</Label>
                <Input
                  id="edit-sugar"
                  type="number"
                  value={editForm.sugar}
                  onChange={e => setEditForm({ ...editForm, sugar: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sodium">Sodium (mg)</Label>
              <Input
                id="edit-sodium"
                type="number"
                value={editForm.sodium}
                onChange={e => setEditForm({ ...editForm, sodium: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
