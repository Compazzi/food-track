import type { NutrientGoal, NutrientThresholdType } from "@/types/models";
import type { TrackableNutrient } from "@/data/nutrients";

export const SUGAR_NUTRIENT_KEYS = ["acucares_totais", "acucares_adicionados"] as const;
export type SugarNutrientKey = (typeof SUGAR_NUTRIENT_KEYS)[number];

export const SUGAR_LABELS: Record<SugarNutrientKey, string> = {
  acucares_totais: "Total sugars (Açúcares totais)",
  acucares_adicionados: "Added sugars (Açúcares adicionados)",
};

export function isSugarNutrientKey(key: string): key is SugarNutrientKey {
  return (SUGAR_NUTRIENT_KEYS as readonly string[]).includes(key);
}

export function hasSugarTrackingConflict(goals: NutrientGoal[]): boolean {
  const keys = new Set(goals.map((g) => g.nutrientKey));
  return keys.has("acucares_totais") && keys.has("acucares_adicionados");
}

export function getOtherSugarKey(key: SugarNutrientKey): SugarNutrientKey {
  return key === "acucares_totais" ? "acucares_adicionados" : "acucares_totais";
}

export function resolveSugarConflict(
  goals: NutrientGoal[],
  keepKey: SugarNutrientKey,
): NutrientGoal[] {
  return goals.filter(
    (g) =>
      !isSugarNutrientKey(g.nutrientKey) || g.nutrientKey === keepKey,
  );
}

export interface NutrientProgress {
  percent: number;
  ringColor: string;
  statusLabel: string;
  goalLabel: string;
}

export function getThresholdLabel(type: NutrientThresholdType): string {
  return type === "maximum" ? "Daily maximum" : "Daily minimum";
}

export function getGoalDescription(nutrient: TrackableNutrient): string {
  if (nutrient.thresholdType === "maximum") {
    return `Stay under ${nutrient.target} ${nutrient.unit}`;
  }
  return `Reach at least ${nutrient.target} ${nutrient.unit}`;
}

export function getNutrientProgress(
  consumed: number,
  nutrient: TrackableNutrient,
): NutrientProgress {
  const { target, thresholdType, unit } = nutrient;

  if (thresholdType === "maximum") {
    const percent = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
    const over = target > 0 && consumed >= target;
    return {
      percent,
      ringColor: over ? "#EF4444" : "#3CB878",
      statusLabel: over ? "Over limit" : "Within limit",
      goalLabel: `≤ ${target} ${unit}`,
    };
  }

  const percent = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
  const met = target > 0 && consumed >= target;
  return {
    percent,
    ringColor: met ? "#3CB878" : "#F59E0B",
    statusLabel: met ? "Goal met" : "Below minimum",
    goalLabel: `≥ ${target} ${unit}`,
  };
}

/** @deprecated */
export function nutrientGoalFromLegacy(limit: {
  nutrientKey: string;
  label: string;
  maxAmount: number;
  unit: NutrientGoal["unit"];
}): NutrientGoal {
  return {
    nutrientKey: limit.nutrientKey,
    label: limit.label,
    target: limit.maxAmount,
    thresholdType: "maximum",
    unit: limit.unit,
  };
}
