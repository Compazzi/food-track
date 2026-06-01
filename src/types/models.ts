import type { NutritionData } from "./nutrition";

export type MacroUnit = "g" | "mg" | "mcg" | "kcal";

/** Whether the target is a ceiling to stay under or a floor to reach. */
export type NutrientThresholdType = "maximum" | "minimum";

export interface NutrientGoal {
  nutrientKey: string;
  label: string;
  target: number;
  thresholdType: NutrientThresholdType;
  unit: MacroUnit;
  /** User-defined nutrient not from the built-in catalog. */
  isCustom?: boolean;
}

/** @deprecated Use {@link NutrientGoal} with thresholdType and target. */
export interface MicronutrientLimit {
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
  nutrientGoals: NutrientGoal[];
}

export interface RecipeSourceIngredient {
  productId: string;
  grams: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  barcode_ean13?: string;
  nutrition_data: NutritionData;
  /** Ingredient list as a single block or ordered items. */
  ingredients?: string | string[];
  /** Optional additives declaration (future tracking). */
  additives?: string;
  /** Optional storage / handling instructions. */
  storage_instructions?: string;
  tags?: string[];
  isCustom?: boolean;
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
