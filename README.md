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

API documentation and deployment steps will be added as the remaining phases are completed.
