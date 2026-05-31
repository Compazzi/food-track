"use client";

import Link from "next/link";

export default function ProductsHubPage() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <Link href="/" className="text-sm font-medium text-emerald-700 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mb-2 mt-4 text-2xl font-bold">Products</h1>
      <p className="mb-6 text-sm text-neutral-600">
        Register barcoded products, build recipes, or manage your catalog.
      </p>

      <ul className="space-y-3">
        <li>
          <Link
            href="/products/manage"
            className="block rounded-lg border border-neutral-200 bg-white px-4 py-4 shadow-sm transition hover:border-emerald-400"
          >
            <span className="font-semibold text-neutral-900">Manage products</span>
            <span className="mt-1 block text-sm text-neutral-600">
              Edit or delete registered products with barcodes
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/products/new"
            className="block rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4 transition hover:bg-emerald-100"
          >
            <span className="font-semibold text-emerald-900">Register product (JSON)</span>
            <span className="mt-1 block text-sm text-emerald-800">
              Add a new item with your EAN-13 barcode
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/recipes/build"
            className="block rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 transition hover:bg-amber-100"
          >
            <span className="font-semibold text-amber-900">Build recipe</span>
            <span className="mt-1 block text-sm text-amber-800">
              Combine ingredients into a custom nutrition label (no barcode)
            </span>
          </Link>
        </li>
      </ul>
    </main>
  );
}
