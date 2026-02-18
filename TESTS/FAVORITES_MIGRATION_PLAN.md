# Favorites Migration Plan

- Objective: Ensure all favorites carry seven nutrient fields (calories, protein, carbs, fat, fiber, sugar, sodium) and that a one-time migration can populate missing fields safely.

- Pre-conditions:
  - Legacy favorites exist in localStorage with missing fiber, sugar, or sodium.
  - UI contains a visible "Migrate Favorites" button on the Favorites page.

- Steps:
 1. Seed localStorage with a few favorites missing fiber, sugar, or sodium.
 2. Open the app and navigate to the Favorites page.
 3. Click the "Migrate Favorites" button.
 4. Observe a toast confirming migration progress (e.g., 2 of 3 items updated).
 5. Verify in the UI that each favorite now shows fiber, sugar, and sodium fields.
 6. Refresh the page and confirm data persists in localStorage with all seven fields populated.
 7. Add a new favorite from a search result and confirm all seven fields are populated on add.
 8. Edit an existing favorite and confirm all seven fields persist after save.

- Validation:
  - Migration does not corrupt existing non-nutrition fields.
  - New and edited favorites always include fiber, sugar, and sodium values (default to 0 if not provided).

- Re-run guidance:
  - If migration needs to be re-applied, you must reset the data store and re-run from scratch.
