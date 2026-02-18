
# NutriScan — Daily Nutrition Tracker

## Overview
A mobile-friendly calorie and nutrition tracker that lets you scan food barcodes with your phone camera or search a massive food database, track full nutrition daily, set goals, and view your history over time.

## Core Features

### 1. Barcode Scanner
- Open your phone camera directly in the app to scan any food barcode
- Instantly pulls up the product's full nutrition info from the Open Food Facts database (millions of products)
- One tap to add it to your daily log

### 2. Food Search
- Search bar to look up any food by name using the Open Food Facts database
- See nutrition details before adding
- Adjust serving size/quantity

### 3. Daily Food Log
- Simple list of everything you've eaten today
- Each entry shows calories, protein, carbs, fat, fiber, sugar, sodium
- Running totals at the top
- Easy delete or edit quantity

### 4. Daily Calorie Goal & Progress
- Set your daily calorie target
- Visual progress ring/bar showing how much you've consumed vs. your goal
- Color changes as you approach or exceed your goal

### 5. History & Trends
- Calendar or list view of past days
- See daily totals for each past day
- Simple charts showing calorie trends over the past week/month

### 6. User Accounts
- Sign up / log in (email-based authentication)
- Your data is saved securely and accessible across devices

## Design
- Clean, modern, mobile-first design
- Bottom navigation: Today / Scan / Search / History / Settings
- Dark/light mode support

## Technical Approach
- **Backend**: Lovable Cloud (Supabase) for user auth, database, and edge functions
- **Food data**: Open Food Facts free API (accessed via edge function)
- **Barcode scanning**: Browser-based camera barcode reader library
- **Charts**: Recharts (already installed) for trend visualization
