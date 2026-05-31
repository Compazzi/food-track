import {
  formatDayOfMonth,
  formatShortChartLabel,
  getDateRangeEndingOn,
} from "@/lib/date-nav";
import { getNutrientConsumedOnDate } from "@/lib/daily-stats";
import { TODAY } from "@/lib/constants";
import type { NutrientChartPoint, NutrientPeriod } from "@/data/nutrients";

export interface NutrientPeriodSummary {
  total: number;
  dailyAverage: number;
  dayCount: number;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Total consumed on the given calendar day (proxy for “last 24 h” with date-only logs). */
export function getNutrient24hTotal(nutrientKey: string, anchorDate: string = TODAY): number {
  return getNutrientConsumedOnDate(nutrientKey, anchorDate);
}

export function getNutrientDailySeries(
  nutrientKey: string,
  period: "7d" | "30d",
  anchorDate: string = TODAY,
): NutrientChartPoint[] {
  const dayCount = period === "7d" ? 7 : 30;
  const dates = getDateRangeEndingOn(anchorDate, dayCount);

  return dates.map((date) => ({
    label: period === "7d" ? formatShortChartLabel(date) : formatDayOfMonth(date),
    consumed: getNutrientConsumedOnDate(nutrientKey, date),
    date,
  }));
}

export function getNutrientPeriodSummary(
  chartData: NutrientChartPoint[],
): NutrientPeriodSummary {
  const total = chartData.reduce((sum, point) => sum + point.consumed, 0);
  const dayCount = chartData.length || 1;
  return {
    total: round1(total),
    dailyAverage: round1(total / dayCount),
    dayCount,
  };
}

export function getNutrientDataForPeriod(
  nutrientKey: string,
  period: NutrientPeriod,
  anchorDate: string = TODAY,
): {
  chartData: NutrientChartPoint[];
  summary: NutrientPeriodSummary | null;
  total24h: number | null;
} {
  if (period === "24h") {
    return {
      chartData: [],
      summary: null,
      total24h: getNutrient24hTotal(nutrientKey, anchorDate),
    };
  }

  const chartData = getNutrientDailySeries(nutrientKey, period, anchorDate);
  return {
    chartData,
    summary: getNutrientPeriodSummary(chartData),
    total24h: null,
  };
}
