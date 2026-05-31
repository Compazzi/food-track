"use client";

import { useMemo, useState } from "react";
import { searchCatalogProducts } from "@/lib/product-catalog";
import type { Product } from "@/types/models";

interface ProductSearchProps {
  onSelect: (product: Product) => void;
  selectedId?: string | null;
  placeholder?: string;
}

export default function ProductSearch({
  onSelect,
  selectedId = null,
  placeholder = "Search products by name or brand…",
}: ProductSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchCatalogProducts(query).slice(0, 8), [query]);

  return (
    <div className="space-y-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-emerald-500/30 focus:ring-2"
      />
      <ul className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-neutral-100 bg-white p-1 shadow-inner">
        {results.length === 0 ? (
          <li className="px-3 py-4 text-center text-sm text-neutral-500">No products found</li>
        ) : (
          results.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                onClick={() => onSelect(product)}
                className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                  selectedId === product.id
                    ? "bg-emerald-100 ring-1 ring-emerald-400"
                    : "hover:bg-neutral-50"
                }`}
              >
                <span className="block text-xs font-medium uppercase text-neutral-500">
                  {product.brand}
                  {product.isRecipe ? " · Recipe" : ""}
                </span>
                <span className="block text-sm font-semibold text-neutral-900">{product.name}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
