"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NutrientTracker from "@/components/NutrientTracker";
import { getTrackableNutrientByKey } from "@/lib/tracked-nutrients-store";
import type { TrackableNutrient } from "@/data/nutrients";

interface NutrientTrackerLoaderProps {
  nutrientKey: string;
}

export default function NutrientTrackerLoader({ nutrientKey }: NutrientTrackerLoaderProps) {
  const [nutrient, setNutrient] = useState<TrackableNutrient | null | undefined>(undefined);

  useEffect(() => {
    setNutrient(getTrackableNutrientByKey(nutrientKey) ?? null);
  }, [nutrientKey]);

  if (nutrient === undefined) {
    return (
      <main className="mx-auto max-w-lg p-6 text-center text-sm text-neutral-500">Loading…</main>
    );
  }

  if (!nutrient) {
    return (
      <main className="mx-auto max-w-lg p-6 text-center">
        <h1 className="text-xl font-bold">Nutrient not found</h1>
        <Link href="/" className="mt-4 inline-block text-sm text-emerald-700 underline">
          Back to dashboard
        </Link>
      </main>
    );
  }

  return <NutrientTracker nutrient={nutrient} />;
}
