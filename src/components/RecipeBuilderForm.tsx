"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ProductSearch from "@/components/ProductSearch";
import { buildRecipeNutrition, createRecipeProduct } from "@/lib/recipe-builder";
import { saveProduct } from "@/lib/product-catalog";
import type { RecipeIngredient } from "@/lib/recipe-builder";
import type { Product } from "@/types/models";

interface DraftIngredient {
  product: Product;
  grams: number;
}

export default function RecipeBuilderForm() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<DraftIngredient[]>([]);
  const [pickProduct, setPickProduct] = useState<Product | null>(null);
  const [pickGrams, setPickGrams] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [brand, setBrand] = useState("My Recipes");
  const [porcaoGramas, setPorcaoGramas] = useState("100");
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    if (ingredients.length === 0) return null;
    try {
      const recipeIngredients: RecipeIngredient[] = ingredients.map((i) => ({
        product: i.product,
        grams: i.grams,
      }));
      return buildRecipeNutrition(recipeIngredients, {
        porcaoGramas: Number(porcaoGramas) || 100,
        porcoesPorEmbalagem: 1,
        medidaCaseira: "1 porção preparada",
      });
    } catch {
      return null;
    }
  }, [ingredients, porcaoGramas]);

  const totalWeight = ingredients.reduce((s, i) => s + i.grams, 0);

  function addIngredient() {
    setError(null);
    if (!pickProduct) {
      setError("Select a product to add.");
      return;
    }
    const grams = Number(pickGrams);
    if (!Number.isFinite(grams) || grams <= 0) {
      setError("Enter valid grams for this ingredient.");
      return;
    }
    setIngredients((prev) => [...prev, { product: pickProduct, grams }]);
    setPickProduct(null);
    setPickGrams("");
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    setError(null);
    if (!recipeName.trim()) {
      setError("Enter a recipe name.");
      return;
    }
    if (ingredients.length === 0) {
      setError("Add at least one ingredient.");
      return;
    }

    const recipeIngredients: RecipeIngredient[] = ingredients.map((i) => ({
      product: i.product,
      grams: i.grams,
    }));

    const product = createRecipeProduct(
      recipeName.trim(),
      brand.trim() || "My Recipes",
      recipeIngredients,
      {
        porcaoGramas: Number(porcaoGramas) || 100,
        porcoesPorEmbalagem: 1,
        medidaCaseira: "1 porção preparada",
      },
    );

    saveProduct(product);
    router.push(`/products/${product.id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3CB878] via-[#8FD14F] to-[#F5D547] px-4 pb-10 pt-6 sm:px-6">
      <header className="mx-auto mb-6 max-w-lg">
        <Link href="/products" className="text-sm font-semibold text-white/95 hover:text-white">
          ← Products
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">Recipe builder</h1>
        <p className="text-sm text-white/90">
          Combine products and weights; we normalize totals to a per-100 g label.
        </p>
      </header>

      <div className="mx-auto max-w-lg space-y-4">
        <section className="rounded-2xl bg-white p-5 shadow-xl shadow-black/10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
            Recipe details
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-neutral-800">Recipe name</span>
              <input
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Post-workout bowl"
                className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-800">Brand</span>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-800">Portion (g)</span>
              <input
                type="number"
                min="1"
                value={porcaoGramas}
                onChange={(e) => setPorcaoGramas(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-xl shadow-black/10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
            Add ingredient
          </h2>
          <div className="mt-3 space-y-3">
            <ProductSearch
              selectedId={pickProduct?.id ?? null}
              onSelect={setPickProduct}
              placeholder="Search catalog ingredients…"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={pickGrams}
                onChange={(e) => setPickGrams(e.target.value)}
                placeholder="Grams"
                className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-neutral-800"
              >
                Add
              </button>
            </div>
          </div>

          {ingredients.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
              {ingredients.map((item, index) => (
                <li
                  key={`${item.product.id}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm"
                >
                  <span>
                    <strong>{item.product.name}</strong> — {item.grams} g
                  </span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
              <li className="text-xs font-medium text-neutral-500">
                Total batch weight: {round1(totalWeight)} g
              </li>
            </ul>
          )}
        </section>

        {preview && (
          <section className="rounded-2xl bg-white p-5 shadow-xl shadow-black/10">
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
              Generated nutrition JSON
            </h2>
            <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-neutral-900 p-3 text-[11px] leading-relaxed text-emerald-300">
              {JSON.stringify(preview, null, 2)}
            </pre>
          </section>
        )}

        {error && <p className="text-sm font-medium text-red-700">{error}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={ingredients.length === 0}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save recipe & view label
        </button>
      </div>
    </div>
  );
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
