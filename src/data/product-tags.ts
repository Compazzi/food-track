/** Meal occasion tags (when to eat). */
export const MEAL_OCCASION_TAGS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Lanche/Snack",
] as const;

/** Macronutrient & fitness role tags. */
export const MACRO_FITNESS_TAGS = [
  "Lean Protein",
  "Fat Source",
  "Complex Carbs",
  "Fibrous Veggies",
  "Pre-Workout",
  "Post-Workout",
] as const;

export type MealOccasionTag = (typeof MEAL_OCCASION_TAGS)[number];
export type MacroFitnessTag = (typeof MACRO_FITNESS_TAGS)[number];
export type ProductTag = MealOccasionTag | MacroFitnessTag;

export const ALL_PRODUCT_TAGS: ProductTag[] = [
  ...MEAL_OCCASION_TAGS,
  ...MACRO_FITNESS_TAGS,
];

export const TAG_CATEGORIES = [
  { id: "meal-occasion", label: "Meal occasion", tags: [...MEAL_OCCASION_TAGS] },
  { id: "macro-fitness", label: "Macronutrient & fitness role", tags: [...MACRO_FITNESS_TAGS] },
] as const;

const TAG_SET = new Set<string>(ALL_PRODUCT_TAGS);

export function isKnownProductTag(tag: string): tag is ProductTag {
  return TAG_SET.has(tag);
}

export function normalizeProductTags(tags: unknown): ProductTag[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim())
    .filter((t): t is ProductTag => isKnownProductTag(t));
}
