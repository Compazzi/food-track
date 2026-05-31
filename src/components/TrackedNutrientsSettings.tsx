"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  NUTRIENT_CATALOG,
  getPinnedNutrientKeys,
  setPinnedNutrientKeys,
} from "@/lib/tracked-nutrients-store";

export default function TrackedNutrientsSettings() {
  const [pinned, setPinned] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPinned(getPinnedNutrientKeys());
  }, []);

  function toggle(key: string) {
    setSaved(false);
    setPinned((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function handleSave() {
    if (pinned.length === 0) {
      window.alert("Select at least one nutrient to display on the dashboard.");
      return;
    }
    setPinnedNutrientKeys(pinned);
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 pb-10 pt-6 sm:px-6">
      <header className="mx-auto mb-6 max-w-lg">
        <Link href="/" className="text-sm font-medium text-emerald-700 hover:underline">
          ← Dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-neutral-900">Edit tracked nutrients</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Choose which micronutrients appear on your dashboard. Tap to pin or unpin.
        </p>
      </header>

      <div className="mx-auto max-w-lg space-y-3">
        {NUTRIENT_CATALOG.map((nutrient) => {
          const isPinned = pinned.includes(nutrient.nutrientKey);
          return (
            <button
              key={nutrient.nutrientKey}
              type="button"
              onClick={() => toggle(nutrient.nutrientKey)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                isPinned
                  ? "border-emerald-400 bg-emerald-50 shadow-sm"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div>
                <p className="font-semibold text-neutral-900">{nutrient.label}</p>
                <p className="text-sm text-neutral-500">
                  Daily limit: {nutrient.maxAmount} {nutrient.unit}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                  isPinned ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {isPinned ? "Pinned" : "Off"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-6 max-w-lg space-y-2">
        {saved && (
          <p className="text-center text-sm font-medium text-emerald-700">
            Dashboard updated. Return home to see your pins.
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
        >
          Save selection
        </button>
      </div>
    </div>
  );
}
