"use client";

import { useRef, useState } from "react";
import ProductTagFilter from "@/components/ProductTagFilter";

interface ProductSearchPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function ProductSearchPanel({
  search,
  onSearchChange,
  selectedTags,
  onTagsChange,
}: ProductSearchPanelProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleFocus() {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
    setFiltersOpen(true);
  }

  function handleBlur() {
    blurTimeout.current = setTimeout(() => {
      setFiltersOpen(false);
    }, 180);
  }

  function handlePanelMouseDown() {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
  }

  function closeFilters() {
    setFiltersOpen(false);
  }

  return (
    <section className="mb-6">
      <label className="block">
        <span className="sr-only">Search</span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
        />
      </label>

      {filtersOpen && (
        <div
          className="mt-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg"
          onMouseDown={handlePanelMouseDown}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-800">Filter by tags</span>
            <button
              type="button"
              onClick={closeFilters}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-800"
            >
              Close
            </button>
          </div>
          <ProductTagFilter selectedTags={selectedTags} onChange={onTagsChange} />
        </div>
      )}
    </section>
  );
}
