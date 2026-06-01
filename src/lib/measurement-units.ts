import type { Product } from "@/types/models";

export type MeasurementUnitId =
  | "g"
  | "mg"
  | "L"
  | "ml"
  | "colher_cha"
  | "colher_sopa"
  | "xicara"
  | "copo"
  | "porcao";

export interface MeasurementUnitOption {
  id: MeasurementUnitId;
  label: string;
  /** Requires a product with porcao_gramas when id is porcao. */
  needsProduct?: boolean;
}

export const MEASUREMENT_UNITS: MeasurementUnitOption[] = [
  { id: "g", label: "Gramas (g)" },
  { id: "mg", label: "Miligramas (mg)" },
  { id: "L", label: "Litros (L)" },
  { id: "ml", label: "Mililitros (ml)" },
  { id: "colher_cha", label: "Colher de chá" },
  { id: "colher_sopa", label: "Colher de sopa" },
  { id: "xicara", label: "Xícara" },
  { id: "copo", label: "Copo" },
  { id: "porcao", label: "Porção", needsProduct: true },
];

/** Culinary approximations → mass in grams (water-like density for volume). */
const GRAMS_PER_UNIT: Record<Exclude<MeasurementUnitId, "porcao">, number> = {
  g: 1,
  mg: 0.001,
  L: 1000,
  ml: 1,
  colher_cha: 5,
  colher_sopa: 15,
  xicara: 240,
  copo: 200,
};

export function getPortionGrams(product: Product): number {
  const grams = product.nutrition_data.porcao_gramas;
  return Number.isFinite(grams) && grams > 0 ? grams : 0;
}

/**
 * Converts a quantity in the selected unit to grams for nutrition math.
 * Porção: quantity × product.porcao_gramas from JSON.
 */
export function convertToGrams(
  amount: number,
  unit: MeasurementUnitId,
  product?: Product,
): { grams: number; error?: string } {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { grams: 0, error: "Enter a valid amount greater than zero." };
  }

  if (unit === "porcao") {
    if (!product) {
      return { grams: 0, error: "Select a product to use Porção." };
    }
    const portionGrams = getPortionGrams(product);
    if (portionGrams <= 0) {
      return {
        grams: 0,
        error: "This product has no porcao_gramas defined in its nutrition JSON.",
      };
    }
    return { grams: round2(amount * portionGrams) };
  }

  const factor = GRAMS_PER_UNIT[unit];
  return { grams: round2(amount * factor) };
}

export function formatGramsHint(grams: number, unit: MeasurementUnitId, amount: number): string {
  if (unit === "g") return "";
  const portionNote =
    unit === "porcao" ? ` (${amount} porção${amount === 1 ? "" : "ões"})` : "";
  return `≈ ${grams} g${portionNote}`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
