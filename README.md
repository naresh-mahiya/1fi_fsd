# FlexiBuy EMI Store

A small full-stack assignment project for comparing smartphone variants and EMI plans. Product, pricing, image and plan information is served from PostgreSQL rather than being embedded in the React app.

**Live demo:** [https://1fifsd.vercel.app](https://1fifsd.vercel.app)

## Tech stack

- React, TypeScript, Vite and Tailwind CSS
- Node.js, Express and TypeScript
- PostgreSQL with Prisma ORM
- Vitest, Testing Library and Supertest
- Vercel for the frontend and serverless API

## Project structure

```text
client/          React application and product assets
server/          Express application, Prisma schema and seed script
docker-compose.yml
```

## Local setup

Requirements: Node.js 24, npm and PostgreSQL 16 (or Docker).

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to the API on `http://localhost:3000`.

## App routes

| Route | Purpose |
| --- | --- |
| `/` | Product catalog loaded from the API |
| `/products/:slug` | Product, variant and EMI plan selection |
| `/products/:slug?variant=:variantId` | Shareable selected variant |
| `/checkout?product=:slug&variant=:id&plan=:id` | Reload-safe confirmation summary |

The confirmation screen is intentionally the end of this assignment flow. It does not create an order or collect personal/payment information.

## Database schema

- `Product` stores the shared brand, name, description and unique URL slug.
- `ProductVariant` stores color, storage, RAM, MRP, selling price and image path.
- `EmiPlan` stores monthly payment, tenure, annual interest rate and optional cashback.
- `FundPartner` identifies the demo mutual-fund partner backing a plan.

Product data and demo fund names are sample assignment data. They do not describe a live store or real financial partnership.

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm test
```

## API endpoints

All successful responses put their result in `data`. Errors use an `error` object with a stable code and readable message.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API and database availability |
| `GET` | `/api/products` | List products with their default variant |
| `GET` | `/api/products/:slug` | Get every variant and EMI plan for one product |

Example product detail response (shortened):

```json
{
  "data": {
    "id": "cm...",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "name": "iPhone 17 Pro",
    "description": "A compact Pro iPhone...",
    "variants": [
      {
        "id": "cm...",
        "color": "Silver",
        "colorHex": "#d8d9d4",
        "storage": "256 GB",
        "ram": null,
        "mrp": 134900,
        "price": 129900,
        "imageUrl": "/products/iphone-17-pro-silver.jpg",
        "emiPlans": [
          {
            "id": "cm...",
            "tenureMonths": 6,
            "monthlyPayment": 21650,
            "interestRate": 0,
            "cashbackAmount": 1500,
            "fundPartner": {
              "id": "cm...",
              "name": "Demo Balanced Fund"
            }
          }
        ]
      }
    ]
  }
}
```

Unknown products return `404`, invalid slugs return `400`, and unexpected failures return `500` without database details.

## Responsive and accessible UI

- Mobile-first layouts with a large, touch-friendly action button
- Keyboard-operable variant and plan controls with visible focus states
- Loading, empty, not-found and API error states
- Reduced-motion support and descriptive product image text

## Deploying to Vercel

The repository is configured as one Vercel project: Vite builds the frontend into `client/dist`, while `api/index.ts` exposes the Express app as a Node.js Function. Vercel rewrites all `/api/*` traffic to that Express entry point and keeps product/checkout URLs reload-safe.

The browser calls the API through the same Vercel origin using `/api`, so a separate frontend URL variable and production CORS allowlist are not needed.

1. Push the repository to GitHub and import it into Vercel without changing the root directory.
2. Add a Neon PostgreSQL database from the Vercel Marketplace. Set its pooled connection string as `DATABASE_URL` and its direct connection string as `MIGRATION_DATABASE_URL`.
3. Apply the committed migration and seed the database once from a trusted terminal:

   ```bash
   DATABASE_URL="your-pooled-neon-url" \
   MIGRATION_DATABASE_URL="your-direct-neon-url" \
   npm run db:deploy

   DATABASE_URL="your-pooled-neon-url" \
   MIGRATION_DATABASE_URL="your-direct-neon-url" \
   npm run db:seed
   ```

4. Deploy or redeploy the project. The build and output settings are already stored in `vercel.json`.
5. Check `/api/health`, `/api/products` and all three product pages on the deployment.

Do not commit `.env` or paste database credentials into `vercel.json`. A separate Preview database is preferable if preview branches will run migrations.

## Demo video outline

The assignment video can be recorded in about three minutes:

1. Show the catalog and open each unique product URL.
2. Change a variant, compare interest/cashback values, select a plan and open the confirmation screen.
3. Open `/api/products` and one product API response in the browser.
4. Briefly show `schema.prisma`, the seed script and the PostgreSQL tables in the database dashboard.
5. Finish on the deployed product page and mention the React, Express, Prisma and PostgreSQL stack.
