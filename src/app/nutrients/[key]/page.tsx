import NutrientTrackerLoader from "@/components/NutrientTrackerLoader";

interface NutrientRouteProps {
  params: Promise<{ key: string }>;
}

export default async function NutrientRoute({ params }: NutrientRouteProps) {
  const { key } = await params;
  return <NutrientTrackerLoader nutrientKey={key} />;
}
