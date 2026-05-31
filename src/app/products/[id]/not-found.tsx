import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="mx-auto max-w-lg p-6 text-center">
      <h1 className="text-xl font-bold">Produto não encontrado</h1>
      <Link href="/" className="mt-4 inline-block text-sm text-blue-600 underline">
        Voltar ao catálogo
      </Link>
    </main>
  );
}
