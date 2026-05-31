import { mockUser } from "@/data/mock";
import { buildTrackableNutrients, type TrackableNutrient } from "@/data/nutrients";
import type { MicronutrientLimit } from "@/types/models";

const PINNED_KEY = "food-track-pinned-nutrients";

/** All micronutrients the user can choose to pin on the dashboard. */
export const NUTRIENT_CATALOG: MicronutrientLimit[] = [
  ...mockUser.micronutrientLimits,
  { nutrientKey: "fibras_alimentares", label: "Fiber", maxAmount: 25, unit: "g" },
  { nutrientKey: "magnesio", label: "Magnesium", maxAmount: 260, unit: "mg" },
  { nutrientKey: "potassio", label: "Potassium", maxAmount: 3500, unit: "mg" },
  { nutrientKey: "zinco", label: "Zinc", maxAmount: 11, unit: "mg" },
  { nutrientKey: "calcio", label: "Calcium", maxAmount: 1000, unit: "mg" },
  { nutrientKey: "acucares_adicionados", label: "Added sugars", maxAmount: 50, unit: "g" },
];

const DEFAULT_PINNED = mockUser.micronutrientLimits.map((l) => l.nutrientKey);

function readPinnedKeys(): string[] {
  if (typeof window === "undefined") return DEFAULT_PINNED;
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    if (!raw) return DEFAULT_PINNED;
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : DEFAULT_PINNED;
  } catch {
    return DEFAULT_PINNED;
  }
}

function writePinnedKeys(keys: string[]): void {
  localStorage.setItem(PINNED_KEY, JSON.stringify(keys));
}

export function getPinnedNutrientKeys(): string[] {
  return readPinnedKeys();
}

export function setPinnedNutrientKeys(keys: string[]): void {
  writePinnedKeys(keys);
}

export function getLimitForKey(key: string): MicronutrientLimit | undefined {
  return NUTRIENT_CATALOG.find((n) => n.nutrientKey === key);
}

export function getPinnedTrackableNutrients(): TrackableNutrient[] {
  const keys = readPinnedKeys();
  const limits = keys
    .map((key) => getLimitForKey(key))
    .filter((l): l is MicronutrientLimit => l !== undefined);
  return buildTrackableNutrients(limits);
}

export function getAllTrackableNutrients(): TrackableNutrient[] {
  return buildTrackableNutrients(NUTRIENT_CATALOG);
}
