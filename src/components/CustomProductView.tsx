"use client";

import Link from "next/link";
import ProductPage from "@/components/ProductPage";
import { getCatalogProducts } from "@/lib/product-catalog";
import type { Product } from "@/types/models";

interface CustomProductViewProps {
  product: Product;
}

export default function CustomProductView({ product }: CustomProductViewProps) {
  const catalog = getCatalogProducts();

  const sources =
    product.recipeIngredientIds?.map((ref) => {
      const source = catalog.find((p) => p.id === ref.productId);
      return { ...ref, name: source?.name ?? ref.productId };
    }) ?? [];

  return (
    <div>
      <div className="mx-auto max-w-lg px-6 pt-4">
        <Link href="/" className="text-sm font-medium text-emerald-700 hover:underline">
          ← Dashboard
        </Link>
        <span className="ml-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold uppercase text-amber-900">
          Recipe
        </span>
        <Link
          href={`/products/${product.id}/edit`}
          className="ml-2 text-sm font-semibold text-emerald-700 hover:underline"
        >
          Edit JSON
        </Link>
      </div>

      {sources.length > 0 && (
        <section className="mx-auto mt-4 max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <h2 className="font-bold">Recipe composition</h2>
          <ul className="mt-2 list-inside list-disc space-y-0.5">
            {sources.map((item, i) => (
              <li key={`${item.productId}-${i}`}>
                {item.name} — {item.grams} g
              </li>
            ))}
          </ul>
        </section>
      )}

      <ProductPage product={product} />
    </div>
  );
}
