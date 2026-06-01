"use client";

import { useMemo } from "react";
import {
  MEASUREMENT_UNITS,
  convertToGrams,
  formatGramsHint,
  type MeasurementUnitId,
} from "@/lib/measurement-units";
import type { Product } from "@/types/models";

interface QuantityInputProps {
  product: Product | null;
  amount: string;
  unit: MeasurementUnitId;
  onAmountChange: (value: string) => void;
  onUnitChange: (unit: MeasurementUnitId) => void;
  label?: string;
}

export default function QuantityInput({
  product,
  amount,
  unit,
  onAmountChange,
  onUnitChange,
  label = "Quantity",
}: QuantityInputProps) {
  const numericAmount = Number(amount);

  const conversion = useMemo(() => {
    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return null;
    }
    return convertToGrams(numericAmount, unit, product ?? undefined);
  }, [amount, numericAmount, unit, product]);

  return (
    <div className="space-y-1.5">
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
      <div className="mt-1.5 flex gap-2">
        <input
          type="number"
          min="0.1"
          step="any"
          inputMode="decimal"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder={unit === "porcao" ? "e.g. 1" : "e.g. 150"}
          className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none ring-emerald-500/30 focus:ring-2"
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as MeasurementUnitId)}
          className="max-w-[11rem] shrink-0 rounded-xl border border-neutral-200 bg-white px-2 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
        >
          {MEASUREMENT_UNITS.map((opt) => (
            <option key={opt.id} value={opt.id} disabled={opt.needsProduct && !product}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {unit === "porcao" && product && getPortionGrams(product) > 0 && (
        <p className="text-xs text-neutral-500">
          1 porção = {getPortionGrams(product)} g (from product label)
        </p>
      )}

      {conversion?.error && (
        <p className="text-xs font-medium text-red-600">{conversion.error}</p>
      )}

      {conversion && !conversion.error && conversion.grams > 0 && (
        <p className="text-xs font-medium text-emerald-700">
          {formatGramsHint(conversion.grams, unit, numericAmount)}
        </p>
      )}
    </div>
  );
}

function getPortionGrams(product: Product): number {
  return product.nutrition_data.porcao_gramas;
}

export function parseQuantityToGrams(
  amount: string,
  unit: MeasurementUnitId,
  product: Product | null,
): { grams: number; error?: string } {
  const numericAmount = Number(amount);
  if (!product && unit === "porcao") {
    return { grams: 0, error: "Select a product to use Porção." };
  }
  return convertToGrams(numericAmount, unit, product ?? undefined);
}
