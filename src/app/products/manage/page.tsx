"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductTagFilter from "@/components/ProductTagFilter";
import { deleteProduct, getCatalogProducts } from "@/lib/product-catalog";
import { filterProducts } from "@/lib/product-filter";
import type { Product } from "@/types/models";

function ProductTagList({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

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
        Search by name or brand, and filter by meal occasion or fitness role tags.
      </p>

      <section className="mb-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800">Search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Product name or brand…"
            className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none ring-emerald-500/30 focus:ring-2"
          />
        </label>

        <ProductTagFilter selectedTags={selectedTags} onChange={setSelectedTags} />
      </section>

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
            <li
              key={product.id}
              className="rounded-lg border border-neutral-200 bg-white shadow-sm"
            >
              <Link href={`/products/${product.id}`} className="block px-4 py-3">
                <span className="text-xs font-medium uppercase text-neutral-500">
                  {product.brand}
                </span>
                <span className="block font-semibold text-neutral-900">{product.name}</span>
                {product.barcode_ean13 && (
                  <span className="mt-0.5 block font-mono text-xs text-neutral-500">
                    EAN {product.barcode_ean13}
                  </span>
                )}
                <ProductTagList tags={product.tags} />
              </Link>
              <div className="flex border-t border-neutral-100">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="flex-1 py-2.5 text-center text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  className="flex-1 border-l border-neutral-100 py-2.5 text-center text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
