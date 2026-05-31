"use client";

import { TAG_CATEGORIES } from "@/data/product-tags";

interface ProductTagFilterProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function ProductTagFilter({ selectedTags, onChange }: ProductTagFilterProps) {
  function toggle(tag: string) {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-800">Filter by tags</p>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Clear filters ({selectedTags.length})
          </button>
        )}
      </div>

      {TAG_CATEGORIES.map((category) => (
        <div key={category.id}>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
            {category.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {category.tags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggle(tag)}
                  aria-pressed={active}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
