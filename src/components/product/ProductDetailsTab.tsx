import {
  hasAdditives,
  hasIngredients,
  hasStorageInstructions,
  normalizeIngredients,
} from "@/lib/product-details";
import type { Product } from "@/types/models";

interface ProductDetailsTabProps {
  product: Product;
}

function EmptyPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center">
      <p className="text-sm font-semibold text-neutral-700">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-neutral-500">{description}</p>
    </div>
  );
}

function ReadOnlyBlock({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-500">{title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
        {content}
      </p>
    </section>
  );
}

export default function ProductDetailsTab({ product }: ProductDetailsTabProps) {
  const ingredientItems = normalizeIngredients(product.ingredients);
  const showIngredients = hasIngredients(product);
  const showAdditives = hasAdditives(product);
  const showStorage = hasStorageInstructions(product);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-700">
          Ingredients list
        </h2>
        {showIngredients ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            {ingredientItems.length === 1 ? (
              <p className="text-sm leading-relaxed text-neutral-800">{ingredientItems[0]}</p>
            ) : (
              <ul className="list-inside list-disc space-y-1.5 text-sm leading-relaxed text-neutral-800">
                {ingredientItems.map((item, index) => (
                  <li key={`${item.slice(0, 24)}-${index}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <EmptyPlaceholder
            title="No ingredients on file"
            description="Ingredient data has not been added for this product yet. It can be included when registering or editing the product JSON."
          />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-700">
          Storage instructions
        </h2>
        {showStorage ? (
          <ReadOnlyBlock title="Storage" content={product.storage_instructions!} />
        ) : (
          <EmptyPlaceholder
            title="Storage instructions pending"
            description="Keep refrigerated, shelf life, and handling notes will appear here once added to the product record."
          />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-700">
          Additives
        </h2>
        {showAdditives ? (
          <ReadOnlyBlock title="Additives" content={product.additives!} />
        ) : (
          <EmptyPlaceholder
            title="Additives not recorded"
            description="Preservatives, colorings, and other additive declarations will be shown here when available."
          />
        )}
      </section>
    </div>
  );
}
