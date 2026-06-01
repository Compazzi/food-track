import { mockUser } from "@/data/mock";
import { buildTrackableNutrients, type TrackableNutrient } from "@/data/nutrients";
import { hasSugarTrackingConflict } from "@/lib/nutrient-goals";
import type { MacroUnit, NutrientGoal, NutrientThresholdType } from "@/types/models";

export { hasSugarTrackingConflict };

const GOALS_KEY = "food-track-nutrient-goals";
const LEGACY_PINNED_KEY = "food-track-pinned-nutrients";

export interface NutrientCatalogEntry {
  nutrientKey: string;
  label: string;
  unit: MacroUnit;
  defaultTarget: number;
  defaultThresholdType: NutrientThresholdType;
}

export const NUTRIENT_CATALOG: NutrientCatalogEntry[] = [
  { nutrientKey: "sodio", label: "Sodium", unit: "mg", defaultTarget: 2000, defaultThresholdType: "maximum" },
  {
    nutrientKey: "acucares_totais",
    label: "Total sugars",
    unit: "g",
    defaultTarget: 50,
    defaultThresholdType: "maximum",
  },
  {
    nutrientKey: "acucares_adicionados",
    label: "Added sugars",
    unit: "g",
    defaultTarget: 50,
    defaultThresholdType: "maximum",
  },
  { nutrientKey: "ferro", label: "Iron", unit: "mg", defaultTarget: 18, defaultThresholdType: "minimum" },
  {
    nutrientKey: "fibras_alimentares",
    label: "Fiber",
    unit: "g",
    defaultTarget: 30,
    defaultThresholdType: "minimum",
  },
  {
    nutrientKey: "magnesio",
    label: "Magnesium",
    unit: "mg",
    defaultTarget: 260,
    defaultThresholdType: "minimum",
  },
  {
    nutrientKey: "potassio",
    label: "Potassium",
    unit: "mg",
    defaultTarget: 3500,
    defaultThresholdType: "minimum",
  },
  { nutrientKey: "zinco", label: "Zinc", unit: "mg", defaultTarget: 11, defaultThresholdType: "minimum" },
  { nutrientKey: "calcio", label: "Calcium", unit: "mg", defaultTarget: 1000, defaultThresholdType: "minimum" },
];

const DEFAULT_GOALS: NutrientGoal[] = mockUser.nutrientGoals;

function catalogToGoal(entry: NutrientCatalogEntry): NutrientGoal {
  return {
    nutrientKey: entry.nutrientKey,
    label: entry.label,
    unit: entry.unit,
    target: entry.defaultTarget,
    thresholdType: entry.defaultThresholdType,
  };
}

function readStoredGoals(): NutrientGoal[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NutrientGoal[];
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((g) => g.nutrientKey && g.label);
  } catch {
    return null;
  }
}

function migrateLegacyPinnedKeys(): NutrientGoal[] | null {
  try {
    const raw = localStorage.getItem(LEGACY_PINNED_KEY);
    if (!raw) return null;
    const keys = JSON.parse(raw) as string[];
    if (!Array.isArray(keys)) return null;
    localStorage.removeItem(LEGACY_PINNED_KEY);
    return keys
      .map((key) => {
        const entry = NUTRIENT_CATALOG.find((c) => c.nutrientKey === key);
        return entry ? catalogToGoal(entry) : null;
      })
      .filter((g): g is NutrientGoal => g !== null);
  } catch {
    return null;
  }
}

function writeGoals(goals: NutrientGoal[]): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function getNutrientGoals(): NutrientGoal[] {
  if (typeof window === "undefined") return DEFAULT_GOALS;

  const stored = readStoredGoals();
  if (stored && stored.length > 0) {
    return stored;
  }

  const legacy = migrateLegacyPinnedKeys();
  if (legacy && legacy.length > 0) {
    writeGoals(legacy);
    return legacy;
  }

  writeGoals(DEFAULT_GOALS);
  return DEFAULT_GOALS;
}

export function setNutrientGoals(goals: NutrientGoal[]): NutrientGoal[] {
  const sanitized = goals.map((g) => ({
    ...g,
    target: Math.max(0, Number(g.target) || 0),
  }));
  writeGoals(sanitized);
  return sanitized;
}

export function getCatalogEntry(key: string): NutrientCatalogEntry | undefined {
  return NUTRIENT_CATALOG.find((c) => c.nutrientKey === key);
}

export function createGoalFromCatalog(key: string): NutrientGoal | undefined {
  const entry = getCatalogEntry(key);
  return entry ? catalogToGoal(entry) : undefined;
}

export function getPinnedTrackableNutrients(): TrackableNutrient[] {
  return buildTrackableNutrients(getNutrientGoals());
}

export function getAllTrackableNutrients(): TrackableNutrient[] {
  return buildTrackableNutrients(getNutrientGoals());
}

export function getTrackableNutrientByKey(key: string): TrackableNutrient | undefined {
  return getNutrientByKeyFromGoals(getNutrientGoals(), key);
}

function getNutrientByKeyFromGoals(
  goals: NutrientGoal[],
  key: string,
): TrackableNutrient | undefined {
  const built = buildTrackableNutrients(goals);
  return built.find((n) => n.key === key);
}

/** Goals safe for dashboard (resolves sugar conflict by keeping total sugars). */
export function getDashboardNutrientGoals(): NutrientGoal[] {
  let goals = getNutrientGoals();
  if (hasSugarTrackingConflict(goals)) {
    goals = goals.filter((g) => g.nutrientKey !== "acucares_adicionados");
  }
  return goals;
}

export function getDashboardTrackableNutrients(): TrackableNutrient[] {
  return buildTrackableNutrients(getDashboardNutrientGoals());
}

/** @deprecated */
export function getPinnedNutrientKeys(): string[] {
  return getNutrientGoals().map((g) => g.nutrientKey);
}

/** @deprecated */
export function setPinnedNutrientKeys(keys: string[]): void {
  const goals = keys
    .map((key) => createGoalFromCatalog(key))
    .filter((g): g is NutrientGoal => g !== undefined);
  setNutrientGoals(goals);
}

