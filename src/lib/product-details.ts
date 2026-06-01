import type { Product } from "@/types/models";

export function normalizeIngredients(
  ingredients: Product["ingredients"],
): string[] {
  if (!ingredients) return [];
  if (typeof ingredients === "string") {
    const trimmed = ingredients.trim();
    if (!trimmed) return [];
    return [trimmed];
  }
  return ingredients.map((item) => item.trim()).filter(Boolean);
}

export function hasIngredients(product: Product): boolean {
  return normalizeIngredients(product.ingredients).length > 0;
}

export function hasAdditives(product: Product): boolean {
  return Boolean(product.additives?.trim());
}

export function hasStorageInstructions(product: Product): boolean {
  return Boolean(product.storage_instructions?.trim());
}
