"use client";

import Barcode from "react-barcode";
import { buildNutritionTableRows, formatNutrientValue } from "@/lib/nutrition-table";
import type { Product } from "@/types/models";

interface ProductPageProps {
  product: Product;
}

function indentClass(level: 0 | 1 | 2): string {
  if (level === 1) return "pl-4";
  if (level === 2) return "pl-8";
  return "pl-2";
}

export default function ProductPage({ product }: ProductPageProps) {
  const { nutrition_data: data, brand, name, barcode_ean13, isRecipe } = product;
  const showBarcode = !isRecipe && Boolean(barcode_ean13);
  const portionGrams = data.porcao_gramas;
  const rows = buildNutritionTableRows(data);

  const porcaoLine = data.medida_caseira
    ? `Porção: ${portionGrams} g (${data.medida_caseira})`
    : `Porção: ${portionGrams} g`;

  return (
    <article className="mx-auto flex max-w-lg flex-col gap-6 p-6">
      <header className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">{brand}</p>
        <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
      </header>

      <section
        className="border-4 border-black bg-white text-black"
        aria-label="Informação nutricional"
      >
        <div className="border-b-4 border-black px-3 py-2 text-center">
          <h2 className="text-sm font-bold uppercase tracking-wide">
            INFORMAÇÃO NUTRICIONAL
          </h2>
        </div>

        <div className="border-b border-black px-3 py-2 text-xs leading-relaxed">
          <p>Porções por embalagem: {data.porcoes_por_embalagem}</p>
          <p>{porcaoLine}</p>
        </div>

        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-black px-2 py-1.5 text-left font-normal" />
              <th className="w-16 border-r border-black px-1 py-1.5 text-center font-bold">
                100 g
              </th>
              <th className="w-16 border-r border-black px-1 py-1.5 text-center font-bold">
                {portionGrams} g
              </th>
              <th className="w-14 px-1 py-1.5 text-center font-bold">%VD*</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-black last:border-b-0">
                <td
                  className={`border-r border-black py-1 pr-2 text-left ${indentClass(row.indentLevel)}`}
                >
                  {row.label}
                </td>
                <td className="border-r border-black px-1 py-1 text-center">
                  {formatNutrientValue(row.values["100g"])}
                </td>
                <td className="border-r border-black px-1 py-1 text-center">
                  {formatNutrientValue(row.values.porcao)}
                </td>
                <td className="px-1 py-1 text-center">{formatNutrientValue(row.values.vd)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="px-3 py-2 text-[10px] leading-snug">
          *Percentual de valores diários fornecidos pela porção.
        </p>
      </section>

      {showBarcode && barcode_ean13 && (
        <footer className="flex flex-col items-center gap-1 border-t border-neutral-200 pt-4">
          <Barcode
            value={barcode_ean13}
            format="EAN13"
            width={1.6}
            height={72}
            displayValue={true}
            fontSize={14}
            margin={8}
            background="#ffffff"
            lineColor="#000000"
          />
        </footer>
      )}
    </article>
  );
}
