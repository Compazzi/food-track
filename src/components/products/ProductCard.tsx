import Link from "next/link";
import type { Product } from "@/types/models";

interface ProductCardProps {
  product: Product;
  onDelete: (product: Product) => void;
}

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

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link href={`/products/${product.id}`} className="block px-4 py-3">
        <span className="text-xs font-medium uppercase text-neutral-500">{product.brand}</span>
        <span className="block font-semibold text-neutral-900">{product.name}</span>
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
          onClick={() => onDelete(product)}
          className="flex-1 border-l border-neutral-100 py-2.5 text-center text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
