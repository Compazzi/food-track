import type { NutrientGoal, NutrientThresholdType } from "@/types/models";

export type NutrientPeriod = "24h" | "7d" | "30d";

export interface TrackableNutrient {
  key: string;
  label: string;
  unit: "g" | "mg" | "mcg";
  target: number;
  thresholdType: NutrientThresholdType;
  /** @deprecated Use target */
  dailyMax: number;
}

export function buildTrackableNutrients(goals: NutrientGoal[]): TrackableNutrient[] {
  return goals.map((goal) => ({
    key: goal.nutrientKey,
    label: goal.label,
    unit: goal.unit === "kcal" ? "g" : goal.unit,
    target: goal.target,
    thresholdType: goal.thresholdType,
    dailyMax: goal.thresholdType === "maximum" ? goal.target : goal.target,
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
