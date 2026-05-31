import { mockProducts } from "@/data/mock";
import type { Product } from "@/types/models";

const PRODUCTS_KEY = "food-track-products";
const LEGACY_CUSTOM_KEY = "food-track-custom-products";

function readProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

function writeProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function migrateLegacyCustomProducts(products: Product[]): Product[] {
  try {
    const legacyRaw = localStorage.getItem(LEGACY_CUSTOM_KEY);
    if (!legacyRaw) return products;
    const legacy = JSON.parse(legacyRaw) as Product[];
    localStorage.removeItem(LEGACY_CUSTOM_KEY);
    const ids = new Set(products.map((p) => p.id));
    const merged = [...products];
    for (const item of legacy) {
      if (!ids.has(item.id)) {
        merged.push(normalizeStoredProduct(item));
      }
    }
    return merged;
  } catch {
    return products;
  }
}

function normalizeStoredProduct(product: Product): Product {
  if (product.isRecipe || product.recipeIngredientIds?.length) {
    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      nutrition_data: product.nutrition_data,
      isRecipe: true,
      isCustom: true,
      recipeIngredientIds: product.recipeIngredientIds,
    };
  }
  return product;
}

function mergeMockTags(products: Product[]): Product[] {
  const mockById = new Map(mockProducts.map((p) => [p.id, p]));
  return products.map((product) => {
    const mock = mockById.get(product.id);
    if (mock?.tags?.length && !product.tags?.length) {
      return { ...product, tags: [...mock.tags] };
    }
    return product;
  });
}

export function ensureCatalogSeeded(): void {
  if (typeof window === "undefined") return;

  let products = readProducts();
  if (products.length === 0) {
    products = mockProducts.map((p) => ({ ...p }));
    writeProducts(products);
    return;
  }

  const migrated = migrateLegacyCustomProducts(products);
  const withTags = mergeMockTags(migrated);
  if (
    migrated.length !== products.length ||
    withTags.some((p, i) => p.tags !== migrated[i]?.tags)
  ) {
    writeProducts(withTags);
  }
}

export function getCatalogProducts(): Product[] {
  if (typeof window === "undefined") return mockProducts;
  ensureCatalogSeeded();
  return readProducts();
}

export function getProductById(id: string): Product | undefined {
  return getCatalogProducts().find((p) => p.id === id);
}

export function saveProduct(product: Product): Product {
  ensureCatalogSeeded();
  const normalized = normalizeStoredProduct(product);
  const products = readProducts();
  const next = [normalized, ...products.filter((p) => p.id !== normalized.id)];
  writeProducts(next);
  return normalized;
}

export function deleteProduct(id: string): boolean {
  ensureCatalogSeeded();
  const products = readProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  writeProducts(next);
  return true;
}

export function searchCatalogProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  const all = getCatalogProducts();
  if (!q) return all;
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.barcode_ean13?.includes(q) ?? false) ||
      (p.tags?.some((tag) => tag.toLowerCase().includes(q)) ?? false),
  );
}

/** @deprecated Use getCatalogProducts */
export function getCustomProducts(): Product[] {
  return getCatalogProducts().filter((p) => p.isCustom || p.isRecipe);
}

/** @deprecated Use saveProduct */
export function saveCustomProduct(product: Product): Product {
  return saveProduct(product);
}
