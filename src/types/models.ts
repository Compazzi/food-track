import type { NutritionData } from "./nutrition";

export type MacroUnit = "g" | "mg" | "mcg" | "kcal";

/** User-defined cap or floor for a micronutrient (e.g. sodium under 2000 mg). */
export interface MicronutrientLimit {
  /** JSON key on nutrition_data (e.g. sodio, ferro). */
  nutrientKey: string;
  label: string;
  maxAmount: number;
  unit: MacroUnit;
}

export interface MacroGoals {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  dailyGoals: MacroGoals;
  micronutrientLimits: MicronutrientLimit[];
}

export interface RecipeSourceIngredient {
  productId: string;
  grams: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  /** Required for registered products; omitted for recipes. */
  barcode_ean13?: string;
  nutrition_data: NutritionData;
  /**
   * Hybrid tags: meal occasion (Breakfast, Lunch, …) and
   * macronutrient/fitness role (Lean Protein, Post-Workout, …).
   */
  tags?: string[];
  isCustom?: boolean;
  /** Combined recipe with no barcode. */
  isRecipe?: boolean;
  recipeIngredientIds?: RecipeSourceIngredient[];
}

export interface MealLogEntry {
  productId: string;
  gramsConsumed: number;
}

export interface MealLog {
  id: string;
  userId: string;
  date: string;
  entries: MealLogEntry[];
}
