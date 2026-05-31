import type { MicronutrientLimit } from "@/types/models";

export type NutrientPeriod = "24h" | "7d" | "30d";

export interface TrackableNutrient {
  key: string;
  label: string;
  unit: "g" | "mg" | "mcg";
  /** Daily maximum (from user limits or default). */
  dailyMax: number;
}

export function buildTrackableNutrients(
  limits: MicronutrientLimit[],
): TrackableNutrient[] {
  return limits.map((limit) => ({
    key: limit.nutrientKey,
    label: limit.label,
    unit: limit.unit === "kcal" ? "g" : limit.unit,
    dailyMax: limit.maxAmount,
  }));
}

export interface NutrientChartPoint {
  label: string;
  consumed: number;
  date?: string;
}

export function getNutrientByKey(
  nutrients: TrackableNutrient[],
  key: string,
): TrackableNutrient | undefined {
  return nutrients.find((n) => n.key === key);
}
