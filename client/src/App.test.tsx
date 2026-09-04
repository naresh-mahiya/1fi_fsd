import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import type { ProductDetail, ProductSummary } from "./types";

const plans = [
  {
    id: "plan-3",
    tenureMonths: 3,
    monthlyPayment: 43300,
    interestRate: 0,
    cashbackAmount: null,
    fundPartner: { id: "fund-1", name: "Demo Growth Fund" },
  },
  {
    id: "plan-9",
    tenureMonths: 9,
    monthlyPayment: 17399,
    interestRate: 10.5,
    cashbackAmount: 3000,
    fundPartner: { id: "fund-2", name: "Demo Income Fund" },
  },
];

const product: ProductDetail = {
  id: "product-1",
  slug: "iphone-17-pro",
  brand: "Apple",
  name: "iPhone 17 Pro",
  description: "A compact Pro iPhone.",
  variants: [
    {
      id: "variant-silver",
      color: "Silver",
      colorHex: "#d8d9d4",
      storage: "256 GB",
      ram: null,
      mrp: 134900,
      price: 129900,
      imageUrl: "/products/iphone-silver.jpg",
      emiPlans: plans,
    },
    {
      id: "variant-blue",
      color: "Deep Blue",
      colorHex: "#1d2938",
      storage: "512 GB",
      ram: null,
      mrp: 154900,
      price: 149900,
      imageUrl: "/products/iphone-blue.jpg",
      emiPlans: [{ ...plans[0], id: "blue-plan", monthlyPayment: 49967 }],
    },
  ],
};

const summary: ProductSummary = {
  id: product.id,
  slug: product.slug,
  brand: product.brand,
  name: product.name,
  description: product.description,
  defaultVariant: product.variants[0],
};

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      if (url === "/api/products") return jsonResponse({ data: [summary], meta: { count: 1 } });
      if (url === "/api/products/iphone-17-pro") return jsonResponse({ data: product });
      return jsonResponse({ error: { message: "The requested product was not found." } }, 404);
    }),
  );
});

describe("shopping flow", () => {
  it("loads products from the API on the catalog page", async () => {
    renderAt("/");

    expect(await screen.findByRole("heading", { name: "iPhone 17 Pro" })).toBeInTheDocument();
    expect(screen.getByText("1 product")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/products", expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it("changes the price and image when another variant is selected", async () => {
    const user = userEvent.setup();
    renderAt("/products/iphone-17-pro?variant=variant-silver");

    await screen.findByRole("heading", { name: "iPhone 17 Pro" });
    await user.click(screen.getByRole("button", { name: /Deep Blue/ }));

    expect(screen.getByText("₹1,49,900")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "iPhone 17 Pro in Deep Blue" })).toHaveAttribute("src", "/products/iphone-blue.jpg");
  });

  it("carries the selected plan to the confirmation page", async () => {
    const user = userEvent.setup();
    renderAt("/products/iphone-17-pro?variant=variant-silver");

    await screen.findByRole("heading", { name: "iPhone 17 Pro" });
    await user.click(screen.getByRole("radio", { name: /9 month plan/ }));
    await user.click(screen.getByRole("button", { name: /Proceed with selected plan/ }));

    expect(await screen.findByRole("heading", { name: "Review your plan" })).toBeInTheDocument();
    expect(screen.getByText("9 monthly payments")).toBeInTheDocument();
    expect(screen.getByText("Demo Income Fund")).toBeInTheDocument();
  });

  it("shows a useful message for a missing product", async () => {
    renderAt("/products/missing-phone");

    expect(await screen.findByRole("heading", { name: "Phone not found" })).toBeInTheDocument();
  });

  it("shows a retry action after an API failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { message: "Unable to reach the catalog." } }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );
    renderAt("/");

    expect(await screen.findByText("Unable to reach the catalog.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
  });

  it("rejects incomplete checkout links", async () => {
    renderAt("/checkout");

    expect(screen.getByRole("heading", { name: "Incomplete selection" })).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
