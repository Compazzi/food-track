"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { NutrientPeriod } from "@/data/nutrients";
import type { TrackableNutrient } from "@/data/nutrients";
import {
  getGoalDescription,
  getThresholdLabel,
} from "@/lib/nutrient-goals";
import { getNutrientDataForPeriod } from "@/lib/nutrient-history";

const PERIODS: { id: NutrientPeriod; label: string }[] = [
  { id: "24h", label: "Last 24 Hours" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
];

interface NutrientTrackerProps {
  nutrient: TrackableNutrient;
}

function PeriodSummary({
  total,
  dailyAverage,
  unit,
}: {
  total: number;
  dailyAverage: number;
  unit: string;
}) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-neutral-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Total</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
          {total}
          <span className="ml-1 text-sm font-medium text-neutral-600">{unit}</span>
        </p>
      </div>
      <div className="rounded-xl bg-neutral-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Daily average
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
          {dailyAverage}
          <span className="ml-1 text-sm font-medium text-neutral-600">{unit}</span>
        </p>
      </div>
    </div>
  );
}

function barFillForPoint(
  consumed: number,
  nutrient: TrackableNutrient,
): string {
  if (nutrient.thresholdType === "maximum") {
    return consumed > nutrient.target ? "#EF4444" : "#3CB878";
  }
  return consumed >= nutrient.target ? "#3CB878" : "#F59E0B";
}

export default function NutrientTracker({ nutrient }: NutrientTrackerProps) {
  const [period, setPeriod] = useState<NutrientPeriod>("7d");
  const isMax = nutrient.thresholdType === "maximum";
  const lineColor = isMax ? "#EF4444" : "#059669";
  const lineLabel = isMax
    ? `Ceiling: ${nutrient.target} ${nutrient.unit}`
    : `Floor: ${nutrient.target} ${nutrient.unit}`;

  const { chartData, summary, total24h } = useMemo(
    () => getNutrientDataForPeriod(nutrient.key, period),
    [nutrient.key, period],
  );

  const maxConsumed = Math.max(...chartData.map((d) => d.consumed), nutrient.target, 0);
  const yMax = Math.max(Math.ceil(maxConsumed * 1.15), Math.ceil(nutrient.target * 1.1));

  const threshold24hMet =
    total24h !== null &&
    (isMax ? total24h <= nutrient.target : total24h >= nutrient.target);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3CB878] via-[#8FD14F] to-[#F5D547] px-4 pb-10 pt-6 sm:px-6">
      <header className="mx-auto mb-6 max-w-lg">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-white/95 hover:text-white"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">{nutrient.label}</h1>
        <p className="text-sm text-white/90">{getGoalDescription(nutrient)}</p>
        <p className="mt-1 text-xs text-white/80">
          {getThresholdLabel(nutrient.thresholdType)}: {nutrient.target} {nutrient.unit}
        </p>
      </header>

      <div className="mx-auto max-w-lg">
        <div
          className="mb-4 flex rounded-2xl bg-white/25 p-1 backdrop-blur-sm"
          role="tablist"
          aria-label="Time period"
        >
          {PERIODS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={period === item.id}
              onClick={() => setPeriod(item.id)}
              className={`flex-1 rounded-xl px-2 py-2.5 text-center text-xs font-semibold transition sm:text-sm ${
                period === item.id
                  ? "bg-white text-neutral-900 shadow-md"
                  : "text-white hover:bg-white/15"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-xl shadow-black/10 sm:p-6">
          {period === "24h" && total24h !== null && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm font-medium text-neutral-600">
                Total consumed (last 24 hours)
              </p>
              <p className="mt-3 text-6xl font-bold tabular-nums text-neutral-900 sm:text-7xl">
                {total24h}
              </p>
              <p className="mt-2 text-lg font-semibold text-neutral-500">{nutrient.unit}</p>
              <p
                className={`mt-4 rounded-full px-4 py-1.5 text-sm font-semibold ${
                  threshold24hMet
                    ? "bg-emerald-100 text-emerald-800"
                    : isMax
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-900"
                }`}
              >
                {isMax
                  ? threshold24hMet
                    ? "Under daily maximum"
                    : "Above daily maximum"
                  : threshold24hMet
                    ? "Minimum reached"
                    : "Below daily minimum"}
              </p>
              <p className="mt-4 max-w-xs text-xs text-neutral-500">
                {getGoalDescription(nutrient)}
              </p>
            </div>
          )}

          {(period === "7d" || period === "30d") && summary && (
            <>
              <PeriodSummary
                total={summary.total}
                dailyAverage={summary.dailyAverage}
                unit={nutrient.unit}
              />
              <p className="mb-4 text-sm font-medium text-neutral-600">
                Daily consumption ({nutrient.unit})
              </p>
              <div className="h-72 w-full sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                      interval={period === "30d" ? 4 : 0}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, yMax]}
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${Number(value ?? 0)} ${nutrient.unit}`,
                        "Consumed",
                      ]}
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                      }}
                    />
                    <ReferenceLine
                      y={nutrient.target}
                      stroke={lineColor}
                      strokeDasharray="6 4"
                      strokeWidth={2}
                      label={{
                        value: lineLabel,
                        position: "insideTopRight",
                        fill: lineColor,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                    <Bar dataKey="consumed" radius={[6, 6, 0, 0]} maxBarSize={period === "30d" ? 14 : 36}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={barFillForPoint(entry.consumed, nutrient)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-xs text-neutral-500">
                {isMax ? (
                  <>
                    <span className="font-semibold text-red-600">Red dashed line</span> = daily
                    ceiling ({nutrient.target} {nutrient.unit}). Red bars exceeded the limit.
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-emerald-700">Green dashed line</span> =
                    daily floor ({nutrient.target} {nutrient.unit}). Green bars met the minimum;
                    amber bars are below target.
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
