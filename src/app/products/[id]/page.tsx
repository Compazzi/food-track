import ProductPageLoader from "@/components/ProductPageLoader";

interface ProductRouteProps {
  params: Promise<{ id: string }>;
}

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { id } = await params;
  return <ProductPageLoader productId={id} />;
}
