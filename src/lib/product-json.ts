import { normalizeProductTags } from "@/data/product-tags";
import { normalizeIngredients } from "@/lib/product-details";
import { CORE_NUTRIENT_KEYS, NUTRITION_METADATA_KEYS } from "@/types/nutrition";
import type { Product } from "@/types/models";
import type { NutritionData, NutrientValues } from "@/types/nutrition";

export const PRODUCT_JSON_TEMPLATE: Product = {
  id: "prod-new-item",
  name: "Product name",
  brand: "Brand name",
  barcode_ean13: "7891234567890",
  tags: ["Breakfast", "Lean Protein"],
  ingredients: ["Ingredient one", "Ingredient two"],
  storage_instructions: "",
  additives: "",
  nutrition_data: {
    porcoes_por_embalagem: 8,
    porcao_gramas: 30,
    medida_caseira: "1 porção",
    valor_energetico: { "100g": 0, porcao: 0, vd: 0 },
    carboidratos: { "100g": 0, porcao: 0, vd: 0 },
    acucares_totais: { "100g": 0, porcao: 0, vd: 0 },
    acucares_adicionados: { "100g": 0, porcao: 0, vd: 0 },
    proteinas: { "100g": 0, porcao: 0, vd: 0 },
    gorduras_totais: { "100g": 0, porcao: 0, vd: 0 },
    gorduras_saturadas: { "100g": 0, porcao: 0, vd: 0 },
    gorduras_trans: { "100g": 0, porcao: 0, vd: 0 },
    fibras_alimentares: { "100g": 0, porcao: 0, vd: 0 },
    sodio: { "100g": 0, porcao: 0, vd: 0 },
    vitamina_c: { "100g": 0, porcao: 0, vd: 0 },
  },
};

function isNutrientValues(value: unknown): value is NutrientValues {
  return (
    typeof value === "object" &&
    value !== null &&
    "100g" in value &&
    "porcao" in value &&
    "vd" in value
  );
}

function validateNutritionData(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return "nutrition_data must be an object.";
  }

  const nutrition = data as NutritionData;

  if (typeof nutrition.porcoes_por_embalagem !== "number") {
    return "nutrition_data.porcoes_por_embalagem is required (number).";
  }
  if (typeof nutrition.porcao_gramas !== "number") {
    return "nutrition_data.porcao_gramas is required (number).";
  }

  for (const key of CORE_NUTRIENT_KEYS) {
    if (!isNutrientValues(nutrition[key])) {
      return `nutrition_data.${key} must include 100g, porcao, and vd.`;
    }
  }

  for (const key of Object.keys(nutrition)) {
    if (
      NUTRITION_METADATA_KEYS.has(key) ||
      (CORE_NUTRIENT_KEYS as readonly string[]).includes(key)
    ) {
      continue;
    }
    const value = nutrition[key];
    if (value !== undefined && !isNutrientValues(value)) {
      return `nutrition_data.${key} must be a nutrient object with 100g, porcao, and vd.`;
    }
  }

  return null;
}

export function validateEan13(barcode: string): boolean {
  const digits = barcode.replace(/\D/g, "");
  if (digits.length !== 13) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = Number(digits[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const check = (10 - (sum % 10)) % 10;
  return check === Number(digits[12]);
}

export function parseProductJson(
  raw: string,
  options: { requireBarcode?: boolean } = {},
): { product?: Product; error?: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "Invalid JSON syntax." };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { error: "Product must be a JSON object." };
  }

  const record = parsed as Record<string, unknown>;
  const isRecipe = record.isRecipe === true;

  if (typeof record.id !== "string" || !record.id.trim()) {
    return { error: "id is required (string)." };
  }
  if (typeof record.name !== "string" || !record.name.trim()) {
    return { error: "name is required (string)." };
  }
  if (typeof record.brand !== "string" || !record.brand.trim()) {
    return { error: "brand is required (string)." };
  }

  const nutritionError = validateNutritionData(record.nutrition_data);
  if (nutritionError) {
    return { error: nutritionError };
  }

  const requireBarcode = options.requireBarcode ?? !isRecipe;

  if (requireBarcode) {
    if (typeof record.barcode_ean13 !== "string" || !record.barcode_ean13.trim()) {
      return { error: "barcode_ean13 is required when registering a product." };
    }
    const barcode = record.barcode_ean13.replace(/\D/g, "");
    if (!validateEan13(barcode)) {
      return { error: "barcode_ean13 must be a valid 13-digit EAN-13 code." };
    }
    record.barcode_ean13 = barcode;
  } else if (record.barcode_ean13 !== undefined) {
    return { error: "Recipes must not include barcode_ean13." };
  }

  const product: Product = {
    id: record.id.trim(),
    name: record.name.trim(),
    brand: record.brand.trim(),
    nutrition_data: record.nutrition_data as NutritionData,
    isRecipe,
    isCustom: record.isCustom === true || isRecipe,
  };

  if (!isRecipe && typeof record.barcode_ean13 === "string") {
    product.barcode_ean13 = record.barcode_ean13;
  }

  if (Array.isArray(record.recipeIngredientIds)) {
    product.recipeIngredientIds = record.recipeIngredientIds as Product["recipeIngredientIds"];
  }

  if (record.tags !== undefined) {
    product.tags = normalizeProductTags(record.tags);
  }

  if (record.ingredients !== undefined) {
    const normalized = normalizeIngredients(
      record.ingredients as Product["ingredients"],
    );
    if (typeof record.ingredients === "string") {
      product.ingredients = normalized[0] ?? "";
    } else if (Array.isArray(record.ingredients)) {
      product.ingredients = normalized;
    }
  }

  if (typeof record.additives === "string") {
    product.additives = record.additives;
  }

  if (typeof record.storage_instructions === "string") {
    product.storage_instructions = record.storage_instructions;
  }

  return { product };
}

export function formatProductJson(product: Product): string {
  const payload: Record<string, unknown> = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    nutrition_data: product.nutrition_data,
  };

  if (product.isRecipe) {
    payload.isRecipe = true;
    if (product.recipeIngredientIds?.length) {
      payload.recipeIngredientIds = product.recipeIngredientIds;
    }
  } else {
    payload.barcode_ean13 = product.barcode_ean13 ?? "";
  }

  if (product.tags?.length) {
    payload.tags = product.tags;
  }

  if (product.ingredients !== undefined) {
    const items = normalizeIngredients(product.ingredients);
    if (items.length === 1) {
      payload.ingredients = items[0];
    } else if (items.length > 1) {
      payload.ingredients = items;
    }
  }

  if (product.additives?.trim()) {
    payload.additives = product.additives;
  }

  if (product.storage_instructions?.trim()) {
    payload.storage_instructions = product.storage_instructions;
  }

  return JSON.stringify(payload, null, 2);
}
