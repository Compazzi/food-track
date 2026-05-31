"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CustomProductView from "@/components/CustomProductView";
import ProductPage from "@/components/ProductPage";
import { getProductById as getCatalogProductById } from "@/lib/product-catalog";
import type { Product } from "@/types/models";

interface ProductPageLoaderProps {
  productId: string;
}

export default function ProductPageLoader({ productId }: ProductPageLoaderProps) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    setProduct(getCatalogProductById(productId) ?? null);
  }, [productId]);

  if (product === undefined) {
    return (
      <main className="mx-auto max-w-lg p-6 text-center text-sm text-neutral-500">
        Loading product…
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-lg p-6 text-center">
        <h1 className="text-xl font-bold">Product not found</h1>
      </main>
    );
  }

  if (product.isRecipe) {
    return <CustomProductView product={product} />;
  }

  return (
    <>
      <div className="mx-auto max-w-lg px-6 pt-4">
        <Link href="/products" className="text-sm font-medium text-emerald-700 hover:underline">
          ← Products
        </Link>
        <Link
          href={`/products/${product.id}/edit`}
          className="ml-3 text-sm font-semibold text-emerald-700 hover:underline"
        >
          Edit JSON
        </Link>
      </div>
      <ProductPage product={product} />
    </>
  );
}
