import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp } from "./app.js";
import type { ProductDetail, ProductRepository, ProductSummary } from "./types.js";

const variant = {
  id: "variant-1",
  color: "Silver",
  colorHex: "#d8d9d4",
  storage: "256 GB",
  ram: null,
  mrp: 134900,
  price: 129900,
  imageUrl: "/products/iphone.jpg",
  emiPlans: [
    {
      id: "plan-1",
      tenureMonths: 6,
      monthlyPayment: 21650,
      interestRate: 0,
      cashbackAmount: 1500,
      fundPartner: { id: "fund-1", name: "Demo Balanced Fund" },
    },
  ],
};

const product: ProductDetail = {
  id: "product-1",
  slug: "iphone-17-pro",
  brand: "Apple",
  name: "iPhone 17 Pro",
  description: "Test product",
  variants: [variant],
};

function makeRepository(overrides: Partial<ProductRepository> = {}): ProductRepository {
  const summary: ProductSummary = {
    ...product,
    defaultVariant: variant,
  };

  return {
    list: vi.fn().mockResolvedValue([summary]),
    findBySlug: vi.fn().mockResolvedValue(product),
    ping: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

afterEach(() => vi.restoreAllMocks());

describe("product API", () => {
  it("returns the product catalog with a count", async () => {
    const response = await request(createApp(makeRepository())).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body.meta.count).toBe(1);
    expect(response.body.data[0].defaultVariant.emiPlans[0]).toMatchObject({
      tenureMonths: 6,
      monthlyPayment: 21650,
      interestRate: 0,
      cashbackAmount: 1500,
    });
  });

  it("returns a product by slug", async () => {
    const repository = makeRepository();
    const response = await request(createApp(repository)).get("/api/products/iphone-17-pro");

    expect(response.status).toBe(200);
    expect(response.body.data.variants).toHaveLength(1);
    expect(repository.findBySlug).toHaveBeenCalledWith("iphone-17-pro");
  });

  it("returns 404 when the product does not exist", async () => {
    const repository = makeRepository({ findBySlug: vi.fn().mockResolvedValue(null) });
    const response = await request(createApp(repository)).get("/api/products/missing-phone");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("PRODUCT_NOT_FOUND");
  });

  it("rejects an invalid slug", async () => {
    const response = await request(createApp(makeRepository())).get("/api/products/not_valid!");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_SLUG");
  });

  it("does not expose internal errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const repository = makeRepository({ list: vi.fn().mockRejectedValue(new Error("database password")) });
    const response = await request(createApp(repository)).get("/api/products");

    expect(response.status).toBe(500);
    expect(response.text).not.toContain("database password");
    expect(response.body.error.code).toBe("INTERNAL_ERROR");
  });

  it("reports an unavailable database through the health endpoint", async () => {
    const repository = makeRepository({ ping: vi.fn().mockRejectedValue(new Error("offline")) });
    const response = await request(createApp(repository)).get("/api/health");

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("DATABASE_UNAVAILABLE");
  });
});
