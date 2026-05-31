/** Per-nutrient values for 100 g, portion, and % daily value (ANVISA). */
export interface NutrientValues {
  "100g": number;
  porcao: number;
  vd: number;
}

/** ANVISA-style nutrition label JSON stored on Product.nutrition_data. */
export interface NutritionData {
  porcoes_por_embalagem: number;
  porcao_gramas: number;
  medida_caseira?: string;
  valor_energetico: NutrientValues;
  carboidratos: NutrientValues;
  acucares_totais: NutrientValues;
  acucares_adicionados: NutrientValues;
  proteinas: NutrientValues;
  gorduras_totais: NutrientValues;
  gorduras_saturadas: NutrientValues;
  gorduras_trans: NutrientValues;
  fibras_alimentares: NutrientValues;
  sodio: NutrientValues;
  /** Extra micronutrients or chemical compositions (e.g. ferro, magnesio). */
  [key: string]: number | string | NutrientValues | undefined;
}

export const NUTRITION_METADATA_KEYS = new Set([
  "porcoes_por_embalagem",
  "porcao_gramas",
  "medida_caseira",
]);

export const CORE_NUTRIENT_KEYS = [
  "valor_energetico",
  "carboidratos",
  "acucares_totais",
  "acucares_adicionados",
  "proteinas",
  "gorduras_totais",
  "gorduras_saturadas",
  "gorduras_trans",
  "fibras_alimentares",
  "sodio",
] as const;

export type CoreNutrientKey = (typeof CORE_NUTRIENT_KEYS)[number];

export interface NutritionTableRow {
  key: string;
  label: string;
  values: NutrientValues;
  indentLevel: 0 | 1 | 2;
}
