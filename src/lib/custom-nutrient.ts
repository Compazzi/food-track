import type { MacroUnit, NutrientGoal, NutrientThresholdType } from "@/types/models";

export function slugifyNutrientKey(label: string): string {
  const base = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return base || `custom_${Date.now()}`;
}

export function createCustomNutrientGoal(params: {
  label: string;
  target: number;
  thresholdType: NutrientThresholdType;
  unit: MacroUnit;
  existingKeys: Set<string>;
}): NutrientGoal {
  let key = slugifyNutrientKey(params.label);
  let suffix = 1;
  while (params.existingKeys.has(key)) {
    key = `${slugifyNutrientKey(params.label)}_${suffix}`;
    suffix += 1;
  }

  return {
    nutrientKey: key,
    label: params.label.trim(),
    target: Math.max(0, params.target),
    thresholdType: params.thresholdType,
    unit: params.unit,
    isCustom: true,
  };
}

export function validateCustomNutrientLabel(label: string): string | null {
  const trimmed = label.trim();
  if (!trimmed) return "Enter a nutrient name.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  return null;
}
