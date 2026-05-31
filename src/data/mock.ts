import type { MealLog, Product, User } from "@/types/models";
import type { NutritionData } from "@/types/nutrition";

const granolaNutrition: NutritionData = {
  porcoes_por_embalagem: 8,
  porcao_gramas: 30,
  medida_caseira: "2 colheres de sopa",
  valor_energetico: { "100g": 450, porcao: 135, vd: 7 },
  carboidratos: { "100g": 58, porcao: 17, vd: 6 },
  acucares_totais: { "100g": 12, porcao: 4, vd: 0 },
  acucares_adicionados: { "100g": 8, porcao: 2, vd: 0 },
  proteinas: { "100g": 8, porcao: 2, vd: 4 },
  gorduras_totais: { "100g": 18, porcao: 5, vd: 9 },
  gorduras_saturadas: { "100g": 6, porcao: 2, vd: 10 },
  gorduras_trans: { "100g": 0, porcao: 0, vd: 0 },
  fibras_alimentares: { "100g": 3, porcao: 1, vd: 4 },
  sodio: { "100g": 320, porcao: 96, vd: 4 },
};

const wheyNutrition: NutritionData = {
  porcoes_por_embalagem: 40,
  porcao_gramas: 30,
  medida_caseira: "1 scoop",
  valor_energetico: { "100g": 400, porcao: 120, vd: 6 },
  carboidratos: { "100g": 13.3, porcao: 4, vd: 1 },
  acucares_totais: { "100g": 0, porcao: 0, vd: 0 },
  acucares_adicionados: { "100g": 0, porcao: 0, vd: 0 },
  proteinas: { "100g": 80, porcao: 24, vd: 48 },
  gorduras_totais: { "100g": 3.3, porcao: 1, vd: 2 },
  gorduras_saturadas: { "100g": 1, porcao: 0.3, vd: 1 },
  gorduras_trans: { "100g": 0, porcao: 0, vd: 0 },
  fibras_alimentares: { "100g": 0, porcao: 0, vd: 0 },
  sodio: { "100g": 200, porcao: 60, vd: 3 },
  ferro: { "100g": 8, porcao: 2.4, vd: 17 },
  magnesio: { "100g": 535, porcao: 160, vd: 61 },
  potassio: { "100g": 800, porcao: 240, vd: 0 },
  zinco: { "100g": 7.5, porcao: 2.2, vd: 31 },
};

const riceNutrition: NutritionData = {
  porcoes_por_embalagem: 20,
  porcao_gramas: 150,
  medida_caseira: "1 xícara cozida",
  valor_energetico: { "100g": 130, porcao: 195, vd: 10 },
  carboidratos: { "100g": 28, porcao: 42, vd: 14 },
  acucares_totais: { "100g": 0, porcao: 0, vd: 0 },
  acucares_adicionados: { "100g": 0, porcao: 0, vd: 0 },
  proteinas: { "100g": 2.7, porcao: 4, vd: 8 },
  gorduras_totais: { "100g": 0.3, porcao: 0.5, vd: 1 },
  gorduras_saturadas: { "100g": 0.1, porcao: 0.1, vd: 0 },
  gorduras_trans: { "100g": 0, porcao: 0, vd: 0 },
  fibras_alimentares: { "100g": 0.4, porcao: 0.6, vd: 2 },
  sodio: { "100g": 1, porcao: 2, vd: 0 },
};

export const mockUser: User = {
  id: "user-1",
  name: "Atleta Demo",
  email: "atleta@foodtrack.dev",
  dailyGoals: {
    calories: 3200,
    proteinG: 180,
    carbsG: 380,
    fatG: 95,
    fiberG: 40,
  },
  micronutrientLimits: [
    {
      nutrientKey: "sodio",
      label: "Sodium",
      maxAmount: 2000,
      unit: "mg",
    },
    {
      nutrientKey: "acucares_totais",
      label: "Sugars",
      maxAmount: 50,
      unit: "g",
    },
    {
      nutrientKey: "ferro",
      label: "Iron",
      maxAmount: 45,
      unit: "mg",
    },
  ],
};

export const mockProducts: Product[] = [
  {
    id: "prod-granola",
    name: "Granola Proteica Crocante",
    brand: "NutriBrasil",
    barcode_ean13: "7891234567890",
    tags: ["Breakfast", "Lanche/Snack", "Complex Carbs", "Post-Workout"],
    nutrition_data: granolaNutrition,
  },
  {
    id: "prod-whey",
    name: "Whey Isolado 100% Chocolate",
    brand: "PowerGym",
    barcode_ean13: "7899876543210",
    tags: ["Breakfast", "Lean Protein", "Pre-Workout", "Post-Workout"],
    nutrition_data: wheyNutrition,
  },
  {
    id: "prod-rice",
    name: "Arroz Integral Cozido",
    brand: "Campo Verde",
    barcode_ean13: "7895551234567",
    tags: ["Lunch", "Dinner", "Complex Carbs"],
    nutrition_data: riceNutrition,
  },
];

export const mockMealLogs: MealLog[] = [
  {
    id: "meal-1",
    userId: "user-1",
    date: "2026-05-31",
    entries: [
      { productId: "prod-whey", gramsConsumed: 30 },
      { productId: "prod-rice", gramsConsumed: 300 },
    ],
  },
  {
    id: "meal-2",
    userId: "user-1",
    date: "2026-05-30",
    entries: [
      { productId: "prod-granola", gramsConsumed: 60 },
      { productId: "prod-whey", gramsConsumed: 30 },
    ],
  },
  {
    id: "meal-3",
    userId: "user-1",
    date: "2026-05-30",
    entries: [{ productId: "prod-rice", gramsConsumed: 450 }],
  },
];

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}
