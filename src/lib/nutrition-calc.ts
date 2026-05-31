import type { Product } from "@/types/models";
import type { NutrientValues } from "@/types/nutrition";

function scalePer100g(per100: number, grams: number): number {
  return (per100 / 100) * grams;
}

export function scaleNutrient(values: NutrientValues, grams: number): NutrientValues {
  return {
    "100g": values["100g"],
    porcao: scalePer100g(values.porcao, grams),
    vd: values.vd,
  };
}

export function getNutrientAmount(
  product: Product,
  nutrientKey: string,
  grams: number,
): number {
  const raw = product.nutrition_data[nutrientKey];
  if (typeof raw !== "object" || raw === null || !("100g" in raw)) {
    return 0;
  }
  return scalePer100g(raw["100g"], grams);
}

export function getCaloriesFromProduct(product: Product, grams: number): number {
  return getNutrientAmount(product, "valor_energetico", grams);
}

export function getCarbsFromProduct(product: Product, grams: number): number {
  return getNutrientAmount(product, "carboidratos", grams);
}

export function getProteinFromProduct(product: Product, grams: number): number {
  return getNutrientAmount(product, "proteinas", grams);
}

export function getFatFromProduct(product: Product, grams: number): number {
  return getNutrientAmount(product, "gorduras_totais", grams);
}
