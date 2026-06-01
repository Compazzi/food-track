"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  SUGAR_LABELS,
  getOtherSugarKey,
  hasSugarTrackingConflict,
  isSugarNutrientKey,
  resolveSugarConflict,
  type SugarNutrientKey,
} from "@/lib/nutrient-goals";
import {
  createCustomNutrientGoal,
  validateCustomNutrientLabel,
} from "@/lib/custom-nutrient";
import {
  NUTRIENT_CATALOG,
  createGoalFromCatalog,
  getNutrientGoals,
  setNutrientGoals,
} from "@/lib/tracked-nutrients-store";
import type { MacroUnit, NutrientGoal, NutrientThresholdType } from "@/types/models";

interface SugarPromptState {
  incoming: SugarNutrientKey;
  existing: SugarNutrientKey;
}

export default function TrackedNutrientsSettings() {
  const [goals, setGoals] = useState<NutrientGoal[]>([]);
  const [addKey, setAddKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sugarPrompt, setSugarPrompt] = useState<SugarPromptState | null>(null);
  const [customName, setCustomName] = useState("");
  const [customTarget, setCustomTarget] = useState("100");
  const [customUnit, setCustomUnit] = useState<MacroUnit>("mg");
  const [customThreshold, setCustomThreshold] = useState<NutrientThresholdType>("minimum");

  useEffect(() => {
    setGoals(getNutrientGoals());
  }, []);

  const trackedKeys = useMemo(() => new Set(goals.map((g) => g.nutrientKey)), [goals]);

  const availableToAdd = NUTRIENT_CATALOG.filter((c) => !trackedKeys.has(c.nutrientKey));

  const sugarConflict = hasSugarTrackingConflict(goals);

  function updateGoal(index: number, patch: Partial<NutrientGoal>) {
    setSaved(false);
    setError(null);
    setGoals((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }

  function removeGoal(index: number) {
    setSaved(false);
    setGoals((prev) => prev.filter((_, i) => i !== index));
  }

  function addNutrient(key: string) {
    setError(null);
    setSaved(false);

    if (isSugarNutrientKey(key)) {
      const other = getOtherSugarKey(key);
      if (trackedKeys.has(other)) {
        setSugarPrompt({ incoming: key, existing: other });
        return;
      }
    }

    const goal = createGoalFromCatalog(key);
    if (!goal) return;
    setGoals((prev) => [...prev, goal]);
    setAddKey("");
  }

  function applySugarChoice(keep: SugarNutrientKey) {
    if (!sugarPrompt) return;
    let next = resolveSugarConflict(goals, keep);
    if (!next.some((g) => g.nutrientKey === keep)) {
      const goal = createGoalFromCatalog(keep);
      if (goal) next = [...next, goal];
    }
    setGoals(next);
    setSugarPrompt(null);
    setAddKey("");
  }

  function addCustomNutrient() {
    setError(null);
    setSaved(false);
    const labelError = validateCustomNutrientLabel(customName);
    if (labelError) {
      setError(labelError);
      return;
    }
    const target = Number(customTarget);
    if (!Number.isFinite(target) || target <= 0) {
      setError("Enter a valid target greater than zero.");
      return;
    }

    const goal = createCustomNutrientGoal({
      label: customName,
      target,
      thresholdType: customThreshold,
      unit: customUnit,
      existingKeys: trackedKeys,
    });

    setGoals((prev) => [...prev, goal]);
    setCustomName("");
    setCustomTarget("100");
  }

  function handleSave() {
    setError(null);
    if (goals.length === 0) {
      setError("Add at least one nutrient to track on the dashboard.");
      return;
    }
    if (hasSugarTrackingConflict(goals)) {
      setError(
        "Track either Total sugars or Added sugars—not both. Remove one or use the prompt when adding.",
      );
      return;
    }
    setNutrientGoals(goals);
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
          Add or remove nutrients, set targets, and choose whether each goal is a daily maximum or
          minimum.
        </p>
      </header>

      <div className="mx-auto max-w-lg space-y-4">
        {sugarConflict && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-bold">Sugars tracking conflict</p>
            <p className="mt-1">
              Total sugars and Added sugars overlap on the dashboard. Keep only the one that fits
              your goals.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setGoals(resolveSugarConflict(goals, "acucares_totais"))}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-amber-100"
              >
                Keep total sugars
              </button>
              <button
                type="button"
                onClick={() => setGoals(resolveSugarConflict(goals, "acucares_adicionados"))}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-amber-100"
              >
                Keep added sugars
              </button>
            </div>
          </div>
        )}

        {sugarPrompt && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950">
            <p className="font-bold">Choose one sugar metric</p>
            <p className="mt-1">
              You already track <strong>{SUGAR_LABELS[sugarPrompt.existing]}</strong>. Switch to{" "}
              <strong>{SUGAR_LABELS[sugarPrompt.incoming]}</strong> instead?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applySugarChoice(sugarPrompt.incoming)}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white"
              >
                Switch to {SUGAR_LABELS[sugarPrompt.incoming]}
              </button>
              <button
                type="button"
                onClick={() => setSugarPrompt(null)}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-sm font-semibold text-neutral-800">Add from catalog</p>
          <div className="mt-2 flex gap-2">
            <select
              value={addKey}
              onChange={(e) => setAddKey(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="">Select nutrient…</option>
              {availableToAdd.map((entry) => (
                <option key={entry.nutrientKey} value={entry.nutrientKey}>
                  {entry.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!addKey}
              onClick={() => addNutrient(addKey)}
              className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4">
          <p className="text-sm font-semibold text-emerald-900">Add custom nutrient</p>
          <p className="mt-1 text-xs text-emerald-800">
            Use the JSON key on product labels (e.g. <code className="font-mono">vitamina_c</code>).
            Matching fields in nutrition_data will be summed automatically.
          </p>
          <label className="mt-3 block">
            <span className="text-xs font-semibold text-neutral-700">Display name</span>
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Vitamina C, Ferro"
              className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-neutral-700">Target</span>
              <input
                type="number"
                min={0}
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-neutral-700">Unit</span>
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value as MacroUnit)}
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="mcg">mcg</option>
              </select>
            </label>
          </div>
          <div className="mt-3">
            <span className="text-xs font-semibold text-neutral-700">Threshold</span>
            <div className="mt-1 flex rounded-lg bg-white p-1">
              {(
                [
                  { value: "maximum" as const, label: "Daily max" },
                  { value: "minimum" as const, label: "Daily min" },
                ] as { value: NutrientThresholdType; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCustomThreshold(opt.value)}
                  className={`flex-1 rounded-md py-2 text-xs font-semibold ${
                    customThreshold === opt.value
                      ? "bg-emerald-600 text-white"
                      : "text-neutral-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={addCustomNutrient}
            className="mt-4 w-full rounded-xl border border-emerald-600 bg-white py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
          >
            Add custom nutrient
          </button>
        </div>

        {goals.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500">
            No nutrients tracked yet. Add one above.
          </p>
        ) : (
          <ul className="space-y-3">
            {goals.map((goal, index) => (
              <li
                key={goal.nutrientKey}
                className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {goal.label}
                      {goal.isCustom && (
                        <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-800">
                          Custom
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-neutral-500 font-mono">{goal.nutrientKey}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGoal(index)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold text-neutral-600">Target</span>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={goal.target}
                        onChange={(e) =>
                          updateGoal(index, { target: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                      <span className="shrink-0 text-sm text-neutral-500">{goal.unit}</span>
                    </div>
                  </label>

                  <div className="block">
                    <span className="text-xs font-semibold text-neutral-600">Threshold</span>
                    <div className="mt-1 flex rounded-lg bg-neutral-100 p-1">
                      {(
                        [
                          { value: "maximum" as const, label: "Daily max" },
                          { value: "minimum" as const, label: "Daily min" },
                        ] as { value: NutrientThresholdType; label: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateGoal(index, { thresholdType: opt.value })}
                          className={`flex-1 rounded-md py-2 text-xs font-semibold transition ${
                            goal.thresholdType === opt.value
                              ? "bg-white text-neutral-900 shadow-sm"
                              : "text-neutral-600"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-neutral-500">
                      {goal.thresholdType === "maximum"
                        ? `Stay under ${goal.target} ${goal.unit} (e.g. sodium).`
                        : `Reach at least ${goal.target} ${goal.unit} (e.g. fiber).`}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
        )}
        {saved && (
          <p className="text-center text-sm font-medium text-emerald-700">
            Goals saved. Return to the dashboard to see updates.
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
        >
          Save tracked nutrients
        </button>
      </div>
    </div>
  );
}
