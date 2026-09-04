import type { ProductDetail, ProductSummary } from "../types";

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  const body = (await response.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!response.ok) {
    throw new ApiError(body.error?.message ?? "Unable to load data right now.", response.status);
  }

  return body;
}

export async function getProducts(signal?: AbortSignal) {
  const response = await getJson<{ data: ProductSummary[] }>("/api/products", signal);
  return response.data;
}

export async function getProduct(slug: string, signal?: AbortSignal) {
  const response = await getJson<{ data: ProductDetail }>(`/api/products/${slug}`, signal);
  return response.data;
}
