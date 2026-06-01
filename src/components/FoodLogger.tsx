"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuantityInput, { parseQuantityToGrams } from "@/components/QuantityInput";
import ProductSearch from "@/components/ProductSearch";
import type { MeasurementUnitId } from "@/lib/measurement-units";
import { logFoodEntry } from "@/lib/meal-log-store";
import type { Product } from "@/types/models";

export default function FoodLogger() {
  const router = useRouter();
  const [selected, setSelected] = useState<Product | null>(null);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<MeasurementUnitId>("g");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!selected) {
      setError("Select a product from the list.");
      return;
    }

    const { grams, error: convertError } = parseQuantityToGrams(amount, unit, selected);
    if (convertError) {
      setError(convertError);
      return;
    }

    logFoodEntry({
      productId: selected.id,
      gramsConsumed: grams,
    });

    setMessage(`Logged ${grams} g of ${selected.name}.`);
    setAmount("");
    setUnit("g");
    setSelected(null);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3CB878] via-[#8FD14F] to-[#F5D547] px-4 pb-10 pt-6 sm:px-6">
      <header className="mx-auto mb-6 max-w-lg">
        <Link
          href="/"
          className="text-sm font-semibold text-white/95 hover:text-white"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">Log food</h1>
        <p className="text-sm text-white/90">
          Search the catalog and enter amount with your preferred unit.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-4 rounded-2xl bg-white p-5 shadow-xl shadow-black/10"
      >
        <ProductSearch
          selectedId={selected?.id ?? null}
          onSelect={(product) => {
            setSelected(product);
            setError(null);
            if (unit === "porcao" && product.nutrition_data.porcao_gramas <= 0) {
              setUnit("g");
            }
          }}
        />

        {selected && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Selected: <strong>{selected.name}</strong> ({selected.brand})
          </p>
        )}

        <QuantityInput
          product={selected}
          amount={amount}
          unit={unit}
          onAmountChange={setAmount}
          onUnitChange={setUnit}
        />

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        {message && <p className="text-sm font-medium text-emerald-700">{message}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Add to today&apos;s log
        </button>

        <Link
          href="/products"
          className="block text-center text-sm font-semibold text-emerald-700 hover:underline"
        >
          Products & recipes →
        </Link>
      </form>
    </div>
  );
}
