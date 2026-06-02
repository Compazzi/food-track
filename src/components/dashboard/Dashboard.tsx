"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { mockCaloriesBurnedToday } from "@/data/activity";
import { mockUser } from "@/data/mock";
import { TODAY } from "@/lib/constants";
import {
  getMacroStatsForDate,
  getNutrientConsumedOnDate,
  type DailyMacroStats,
} from "@/lib/daily-stats";
import { clampToAllowedRange, formatProminentDate } from "@/lib/date-nav";
import { getNutrientProgress } from "@/lib/nutrient-goals";
import {
  getDashboardTrackableNutrients,
  getNutrientGoals,
  hasSugarTrackingConflict,
} from "@/lib/tracked-nutrients-store";
import type { TrackableNutrient } from "@/data/nutrients";
import CalorieRing from "./CalorieRing";
import DateNavigator from "./DateNavigator";
import MacroCard from "./MacroCard";
import HydrationCard from "./HydrationCard";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [stats, setStats] = useState<DailyMacroStats>(() => getMacroStatsForDate(TODAY));
  const [trackable, setTrackable] = useState<TrackableNutrient[]>([]);
  const [sugarConflict, setSugarConflict] = useState(false);

  const refresh = useCallback(() => {
    setStats(getMacroStatsForDate(selectedDate));
    setTrackable(getDashboardTrackableNutrients());
    setSugarConflict(hasSugarTrackingConflict(getNutrientGoals()));
  }, [selectedDate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const { dailyGoals } = mockUser;
  const burned = selectedDate === TODAY ? mockCaloriesBurnedToday : 0;
  const remaining = Math.max(0, dailyGoals.calories - stats.calories + burned);
  const prominentDate = formatProminentDate(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3CB878] via-[#8FD14F] to-[#F5D547] px-4 pb-10 pt-6 sm:px-6">
      <header className="mx-auto mb-2 flex max-w-md items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{mockUser.name}</h1>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Link
            href="/log"
            className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            Log food
          </Link>
          <Link
            href="/products"
            className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            Products
          </Link>
        </div>
      </header>

      <p className="mx-auto mb-3 max-w-md text-center text-lg font-semibold text-white sm:text-xl">
        {prominentDate}
      </p>

      <div className="mx-auto mb-6 max-w-md">
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(clampToAllowedRange(date))}
        />
      </div>

      <section className="mx-auto flex max-w-md flex-col items-center">
        <CalorieRing
          goal={dailyGoals.calories}
          eaten={stats.calories}
          burned={burned}
          remaining={remaining}
        />
      </section>

      <section className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
        <MacroCard
          title="Carbohydrates"
          consumed={stats.carbsG}
          target={dailyGoals.carbsG}
          barColor="#3CB878"
        />
        <MacroCard
          title="Protein"
          consumed={stats.proteinG}
          target={dailyGoals.proteinG}
          barColor="#2F9BFF"
        />
        <MacroCard
          title="Fat"
          consumed={stats.fatG}
          target={dailyGoals.fatG}
          barColor="#F5A623"
        />
      </section>
      
      <section className="mx-auto mt-8 max-w-md">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/95">
            Hydration
          </h2>
        </div>
        <HydrationCard currentDate={selectedDate} />
      </section>
      

      <section className="mx-auto mt-8 max-w-md">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/95">
            Nutrients
          </h2>
          <Link
            href="/settings/nutrients"
            className="rounded-full bg-white/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/35"
          >
            Edit tracked nutrients
          </Link>
        </div>

        {sugarConflict && (
          <p className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            You are tracking both total and added sugars. The dashboard shows total sugars only.{" "}
            <Link href="/settings/nutrients" className="font-semibold underline">
              Resolve in settings
            </Link>
          </p>
        )}

        {trackable.length === 0 ? (
          <p className="rounded-2xl bg-white/90 px-4 py-3 text-center text-sm text-neutral-600">
            No nutrients tracked.{" "}
            <Link href="/settings/nutrients" className="font-semibold text-emerald-700 underline">
              Add nutrients
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {trackable.map((nutrient) => {
              const consumed = getNutrientConsumedOnDate(nutrient.key, selectedDate);
              const progress = getNutrientProgress(consumed, nutrient);

              return (
                <li key={nutrient.key}>
                  <Link
                    href={`/nutrients/${nutrient.key}`}
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/10 transition hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900">{nutrient.label}</p>
                      <p className="text-sm tabular-nums text-neutral-600">
                        {consumed}
                        {nutrient.unit} · {progress.goalLabel}
                      </p>
                      <p className="text-xs text-neutral-500">{progress.statusLabel}</p>
                    </div>
                    <div className="h-10 w-10 shrink-0">
                      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                        <circle
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="4"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="none"
                          stroke={progress.ringColor}
                          strokeWidth="4"
                          strokeDasharray={`${(progress.percent / 100) * 97.4} 97.4`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
