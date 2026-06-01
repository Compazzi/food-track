"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import ProductSearchPanel from "@/components/products/ProductSearchPanel";
import { deleteProduct, getCatalogProducts } from "@/lib/product-catalog";
import { filterProducts } from "@/lib/product-filter";
import type { Product } from "@/types/models";

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setProducts(getCatalogProducts().filter((p) => !p.isRecipe));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(
    () => filterProducts(products, { search, selectedTags }),
    [products, search, selectedTags],
  );

  function handleDelete(product: Product) {
    if (!window.confirm(`Delete product "${product.name}"? This cannot be undone.`)) {
      return;
    }
    deleteProduct(product.id);
    refresh();
  }

  return (
    <main className="mx-auto max-w-lg p-6">
      <Link href="/products" className="text-sm font-medium text-emerald-700 hover:underline">
        ← Products
      </Link>
      <h1 className="mb-2 mt-4 text-2xl font-bold">Manage products</h1>
      <p className="mb-6 text-sm text-neutral-600">
        Search by name or brand, and filter by tags when needed.
      </p>

      <ProductSearchPanel
        search={search}
        onSearchChange={setSearch}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />

      <Link
        href="/products/new"
        className="mb-4 block rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
      >
        + Register new product
      </Link>

      <p className="mb-3 text-xs font-medium text-neutral-500">
        Showing {filtered.length} of {products.length} products
      </p>

      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500">
          No registered products yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500">
          No products match your search or tag filters.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </main>
  );
}
