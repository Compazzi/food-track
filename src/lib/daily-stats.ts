import { mockProducts } from "@/data/mock";
import { TODAY } from "@/lib/constants";
import { getAllMealLogs } from "@/lib/meal-log-store";
import { getCatalogProducts } from "@/lib/product-catalog";
import type { MealLog } from "@/types/models";
import {
  getCaloriesFromProduct,
  getCarbsFromProduct,
  getFatFromProduct,
  getNutrientAmount,
  getProteinFromProduct,
} from "@/lib/nutrition-calc";
import type { Product } from "@/types/models";

export interface DailyMacroStats {
  calories: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
}

function getProductMap(): Map<string, Product> {
  const products = typeof window !== "undefined" ? getCatalogProducts() : mockProducts;
  return new Map(products.map((p) => [p.id, p]));
}

function aggregateLogsForDate(date: string, logs: MealLog[]): DailyMacroStats {
  const totals: DailyMacroStats = {
    calories: 0,
    carbsG: 0,
    proteinG: 0,
    fatG: 0,
  };

  const dayLogs = logs.filter((log) => log.date === date);

  const productMap = getProductMap();

  for (const log of dayLogs) {
    for (const entry of log.entries) {
      const product = productMap.get(entry.productId);
      if (!product) continue;

      totals.calories += getCaloriesFromProduct(product, entry.gramsConsumed);
      totals.carbsG += getCarbsFromProduct(product, entry.gramsConsumed);
      totals.proteinG += getProteinFromProduct(product, entry.gramsConsumed);
      totals.fatG += getFatFromProduct(product, entry.gramsConsumed);
    }
  }

  return totals;
}

export function getMacroStatsForDate(date: string): DailyMacroStats {
  return aggregateLogsForDate(date, getAllMealLogs());
}

export function getTodayMacroStats(): DailyMacroStats {
  return getMacroStatsForDate(TODAY);
}

export function getNutrientConsumedOnDate(
  nutrientKey: string,
  date: string,
): number {
  let total = 0;
  const logs = getAllMealLogs().filter((log) => log.date === date);
  const productMap = getProductMap();

  for (const log of logs) {
    for (const entry of log.entries) {
      const product = productMap.get(entry.productId);
      if (!product) continue;
      total += getNutrientAmount(product, nutrientKey, entry.gramsConsumed);
    }
  }

  return Math.round(total * 10) / 10;
}
