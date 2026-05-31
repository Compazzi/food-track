import ProductJsonEditor from "@/components/ProductJsonEditor";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return <ProductJsonEditor mode="edit" productId={id} />;
}
