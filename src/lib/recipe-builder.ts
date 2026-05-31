import { getNutrientAmount } from "@/lib/nutrition-calc";
import { computeVdPercent } from "@/lib/rda";
import type { Product } from "@/types/models";
import {
  CORE_NUTRIENT_KEYS,
  NUTRITION_METADATA_KEYS,
  type CoreNutrientKey,
  type NutritionData,
  type NutrientValues,
} from "@/types/nutrition";

export interface RecipeIngredient {
  product: Product;
  grams: number;
}

export interface RecipeBuilderOptions {
  porcaoGramas?: number;
  porcoesPorEmbalagem?: number;
  medidaCaseira?: string;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function isNutrientValues(value: unknown): value is NutrientValues {
  return (
    typeof value === "object" &&
    value !== null &&
    "100g" in value &&
    "porcao" in value &&
    "vd" in value
  );
}

function collectNutrientKeys(ingredients: RecipeIngredient[]): string[] {
  const keys = new Set<string>(CORE_NUTRIENT_KEYS);

  for (const { product } of ingredients) {
    for (const key of Object.keys(product.nutrition_data)) {
      if (!NUTRITION_METADATA_KEYS.has(key) && isNutrientValues(product.nutrition_data[key])) {
        keys.add(key);
      }
    }
  }

  return Array.from(keys);
}

/**
 * Sums ingredient nutrients, normalizes to a per-100 g baseline, and returns
 * a valid ANVISA-style NutritionData object.
 */
/** Combines ingredients into ANVISA nutrition JSON (per 100 g baseline). */
export function buildRecipeNutrition(
  ingredients: RecipeIngredient[],
  options: RecipeBuilderOptions = {},
): NutritionData {
  const totalWeight = ingredients.reduce((sum, item) => sum + item.grams, 0);

  if (totalWeight <= 0) {
    throw new Error("Recipe total weight must be greater than zero.");
  }

  const porcaoGramas = options.porcaoGramas ?? 100;
  const porcoesPorEmbalagem = options.porcoesPorEmbalagem ?? 1;
  const nutrientKeys = collectNutrientKeys(ingredients);

  const nutrientEntries: Record<string, NutrientValues> = {};

  for (const key of nutrientKeys) {
    const absoluteTotal = ingredients.reduce(
      (sum, item) => sum + getNutrientAmount(item.product, key, item.grams),
      0,
    );

    const per100g = (absoluteTotal / totalWeight) * 100;
    const porcao = (per100g / 100) * porcaoGramas;

    nutrientEntries[key] = {
      "100g": round1(per100g),
      porcao: round1(porcao),
      vd: computeVdPercent(key, porcao),
    };
  }

  const data = {
    porcoes_por_embalagem: porcoesPorEmbalagem,
    porcao_gramas: porcaoGramas,
    ...(options.medidaCaseira ? { medida_caseira: options.medidaCaseira } : {}),
  } as NutritionData;

  for (const key of CORE_NUTRIENT_KEYS) {
    data[key as CoreNutrientKey] = nutrientEntries[key] ?? {
      "100g": 0,
      porcao: 0,
      vd: 0,
    };
  }

  for (const key of nutrientKeys) {
    if (!CORE_NUTRIENT_KEYS.includes(key as CoreNutrientKey)) {
      data[key] = nutrientEntries[key];
    }
  }

  return data;
}

/** Alias for {@link buildRecipeNutrition}. */
export const RecipeBuilder = buildRecipeNutrition;

export function createRecipeProduct(
  name: string,
  brand: string,
  ingredients: RecipeIngredient[],
  options: RecipeBuilderOptions = {},
): Product {
  const nutrition_data = buildRecipeNutrition(ingredients, options);
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);

  return {
    id: `recipe-${slug}-${Date.now()}`,
    name,
    brand,
    nutrition_data,
    isRecipe: true,
    isCustom: true,
    recipeIngredientIds: ingredients.map((i) => ({
      productId: i.product.id,
      grams: i.grams,
    })),
  };
}

/** @deprecated Use {@link createRecipeProduct} */
export const createCustomProductFromRecipe = createRecipeProduct;
