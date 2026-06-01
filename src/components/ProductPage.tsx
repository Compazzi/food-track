"use client";

import { useState } from "react";
import ProductDetailsTab from "@/components/product/ProductDetailsTab";
import ProductNutritionTab from "@/components/product/ProductNutritionTab";
import type { Product } from "@/types/models";

interface ProductPageProps {
  product: Product;
}

type ProductTab = "nutrition" | "details";

const TABS: { id: ProductTab; label: string }[] = [
  { id: "nutrition", label: "Nutrition" },
  { id: "details", label: "Details" },
];

export default function ProductPage({ product }: ProductPageProps) {
  const { brand, name } = product;
  const [activeTab, setActiveTab] = useState<ProductTab>("nutrition");

  return (
    <article className="mx-auto flex max-w-lg flex-col gap-6 p-6">
      <header className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">{brand}</p>
        <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
      </header>

      <nav
        className="flex rounded-2xl bg-neutral-100 p-1"
        role="tablist"
        aria-label="Product information"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === "nutrition" ? (
          <ProductNutritionTab product={product} />
        ) : (
          <ProductDetailsTab product={product} />
        )}
      </div>
    </article>
  );
}
