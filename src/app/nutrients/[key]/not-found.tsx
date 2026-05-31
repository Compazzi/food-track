import Link from "next/link";

export default function NutrientNotFound() {
  return (
    <main className="mx-auto max-w-lg p-6 text-center">
      <h1 className="text-xl font-bold">Nutrient not found</h1>
      <Link href="/" className="mt-4 inline-block text-sm text-emerald-700 underline">
        Back to dashboard
      </Link>
    </main>
  );
}
