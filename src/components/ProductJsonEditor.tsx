"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PRODUCT_JSON_TEMPLATE,
  formatProductJson,
  parseProductJson,
} from "@/lib/product-json";
import { getProductById, saveProduct } from "@/lib/product-catalog";
interface ProductJsonEditorProps {
  mode: "create" | "edit";
  productId?: string;
}

export default function ProductJsonEditor({ mode, productId }: ProductJsonEditorProps) {
  const router = useRouter();
  const existing = mode === "edit" && productId ? getProductById(productId) : undefined;
  const isEditingRecipe = Boolean(existing?.isRecipe);

  const [jsonText, setJsonText] = useState(() => {
    if (existing) return formatProductJson(existing);
    return formatProductJson(PRODUCT_JSON_TEMPLATE);
  });
  const [error, setError] = useState<string | null>(
    mode === "edit" && productId && !existing ? "Product not found." : null,
  );

  function handleSave() {
    setError(null);
    const requireBarcode = mode === "create" ? true : !isEditingRecipe;

    const { product, error: parseError } = parseProductJson(jsonText, {
      requireBarcode,
    });

    if (parseError || !product) {
      setError(parseError ?? "Could not parse product.");
      return;
    }

    if (mode === "create" && product.isRecipe) {
      setError("Use Recipe Builder for recipes. Registration requires barcode_ean13.");
      return;
    }

    if (mode === "edit" && productId && product.id !== productId) {
      setError("id cannot be changed when editing. Update the JSON id to match the original product.");
      return;
    }

    const duplicate = getProductById(product.id);
    if (mode === "create" && duplicate) {
      setError(`A product with id "${product.id}" already exists.`);
      return;
    }

    saveProduct(product);
    router.push(`/products/${product.id}`);
  }

  function loadTemplate() {
    setJsonText(formatProductJson(PRODUCT_JSON_TEMPLATE));
    setError(null);
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 pb-10 pt-6 sm:px-6">
      <header className="mx-auto mb-6 max-w-2xl">
        <Link href="/products" className="text-sm font-medium text-emerald-700 hover:underline">
          ← Products
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-neutral-900">
          {mode === "create" ? "Register product" : `Edit product`}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          {isEditingRecipe
            ? "Recipe JSON (no barcode). Nutrition data follows the ANVISA structure."
            : "Product source is JSON. Enter a valid barcode_ean13 (13-digit EAN-13) when registering."}
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadTemplate}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Reset to template
          </button>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-neutral-800">Product JSON</span>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
            rows={24}
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-900 p-4 font-mono text-xs leading-relaxed text-emerald-300 outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
          >
            {mode === "create" ? "Register product" : "Save changes"}
          </button>
          <Link
            href="/products"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
