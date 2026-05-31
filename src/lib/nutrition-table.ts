import {
  CORE_NUTRIENT_KEYS,
  NUTRITION_METADATA_KEYS,
  type CoreNutrientKey,
  type NutritionData,
  type NutritionTableRow,
  type NutrientValues,
} from "@/types/nutrition";

const ZERO_VALUES: NutrientValues = { "100g": 0, porcao: 0, vd: 0 };

const CORE_ROW_CONFIG: {
  key: CoreNutrientKey;
  label: string;
  indentLevel: 0 | 1 | 2;
}[] = [
  { key: "valor_energetico", label: "Valor energético (kcal)", indentLevel: 0 },
  { key: "carboidratos", label: "Carboidratos (g)", indentLevel: 0 },
  { key: "acucares_totais", label: "Açúcares totais (g)", indentLevel: 1 },
  { key: "acucares_adicionados", label: "Açúcares adicionados (g)", indentLevel: 2 },
  { key: "proteinas", label: "Proteínas (g)", indentLevel: 0 },
  { key: "gorduras_totais", label: "Gorduras totais (g)", indentLevel: 0 },
  { key: "gorduras_saturadas", label: "Gorduras saturadas (g)", indentLevel: 1 },
  { key: "gorduras_trans", label: "Gorduras trans (g)", indentLevel: 1 },
  { key: "fibras_alimentares", label: "Fibras alimentares (g)", indentLevel: 0 },
  { key: "sodio", label: "Sódio (mg)", indentLevel: 0 },
];

const EXTRA_NUTRIENT_LABELS: Record<string, string> = {
  ferro: "Ferro (mg)",
  magnesio: "Magnésio (mg)",
  potassio: "Potássio (mg)",
  zinco: "Zinco (mg)",
  calcio: "Cálcio (mg)",
  vitamina_c: "Vitamina C (mg)",
};

const CORE_KEY_SET = new Set<string>(CORE_NUTRIENT_KEYS);

function isNutrientValues(value: unknown): value is NutrientValues {
  return (
    typeof value === "object" &&
    value !== null &&
    "100g" in value &&
    "porcao" in value &&
    "vd" in value
  );
}

function readNutrient(data: NutritionData, key: string): NutrientValues {
  const raw = data[key];
  if (isNutrientValues(raw)) {
    return raw;
  }
  return ZERO_VALUES;
}

function formatExtraLabel(key: string): string {
  if (EXTRA_NUTRIENT_LABELS[key]) {
    return EXTRA_NUTRIENT_LABELS[key];
  }
  const words = key.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return `${words.join(" ")} (mg)`;
}

/** Build ANVISA table rows: 10 core nutrients first, then dynamic extras. */
export function buildNutritionTableRows(data: NutritionData): NutritionTableRow[] {
  const coreRows: NutritionTableRow[] = CORE_ROW_CONFIG.map(({ key, label, indentLevel }) => ({
    key,
    label,
    values: readNutrient(data, key),
    indentLevel,
  }));

  const extraRows: NutritionTableRow[] = Object.keys(data)
    .filter((key) => !NUTRITION_METADATA_KEYS.has(key) && !CORE_KEY_SET.has(key))
    .filter((key) => isNutrientValues(data[key]))
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((key) => ({
      key,
      label: formatExtraLabel(key),
      values: readNutrient(data, key),
      indentLevel: 0 as const,
    }));

  return [...coreRows, ...extraRows];
}

export function formatNutrientValue(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }
  const rounded = Math.round(value * 10) / 10;
  return String(rounded);
}
