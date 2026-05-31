# Food Track

Next.js app for nutritional tracking with ANVISA-style labels and EAN-13 barcodes.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- [react-barcode](https://www.npmjs.com/package/react-barcode)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the **dashboard** (calorie ring, macro cards, nutrient links). Product pages: `/products/[id]`. Nutrient charts: `/nutrients/[key]` (e.g. `/nutrients/sodio`).

## Data model

- **User** — daily macro goals (`MacroGoals`) and optional `micronutrientLimits` (e.g. sodium cap at 2000 mg).
- **Product** — `barcode_ean13`, `brand`, and `nutrition_data` (ANVISA JSON).
- **MealLog** — date, user, and entries with `productId` + `gramsConsumed`.

Mock data: `src/data/mock.ts`.

## Product page

`ProductPage` renders the standard ANVISA table (10 core nutrients + dynamic micronutrients) and an EAN-13 barcode from `barcode_ean13`. Parsing logic: `src/lib/nutrition-table.ts`.

Example product with extra micronutrients: `/products/prod-whey`.

## Food logging & recipes

- **`/log`** — `FoodLogger`: search catalog, log grams (stored in `localStorage`, reflected on dashboard).
- **`/recipes/build`** — combine ingredients; saves a **recipe** (no barcode) with ANVISA label at `/products/[id]`.

## Product catalog (JSON)

- **`/products`** — list, **Edit JSON**, **Delete**, **Register product**.
- **`/products/new`** — register a product with user-entered **`barcode_ean13`** (validated EAN-13).
- Product source format: JSON (`src/lib/product-json.ts`). Recipes must not include a barcode.
