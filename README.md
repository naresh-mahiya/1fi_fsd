# FlexiBuy EMI Store

A small full-stack assignment project for comparing smartphone variants and EMI plans. Product, pricing, image and plan information is served from PostgreSQL rather than being embedded in the React app.

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

Requirements: Node.js 22, npm and PostgreSQL 16 (or Docker).

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

- Mobile-first layouts with a sticky mobile action button
- Keyboard-operable variant and plan controls with visible focus states
- Loading, empty, not-found and API error states
- Reduced-motion support and descriptive product image text

Deployment steps will be added in the final phase.
