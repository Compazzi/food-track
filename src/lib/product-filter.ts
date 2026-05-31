import type { Product } from "@/types/models";

export function matchesProductSearch(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    product.name.toLowerCase().includes(q) ||
    product.brand.toLowerCase().includes(q) ||
    (product.barcode_ean13?.includes(q) ?? false) ||
    (product.tags?.some((tag) => tag.toLowerCase().includes(q)) ?? false)
  );
}

/** Product must include every selected tag (AND filter). */
export function matchesProductTags(product: Product, selectedTags: string[]): boolean {
  if (selectedTags.length === 0) return true;
  const productTags = new Set(product.tags ?? []);
  return selectedTags.every((tag) => productTags.has(tag));
}

export function filterProducts(
  products: Product[],
  options: { search?: string; selectedTags?: string[] },
): Product[] {
  const { search = "", selectedTags = [] } = options;
  return products.filter(
    (p) => matchesProductSearch(p, search) && matchesProductTags(p, selectedTags),
  );
}
