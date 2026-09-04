import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { prismaProductRepository } from "./repositories/productRepository.js";
import type { ProductRepository } from "./types.js";

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export function createApp(repository: ProductRepository = prismaProductRepository) {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    cors({
      origin: process.env.NODE_ENV === "production" ? false : (process.env.CLIENT_ORIGIN ?? "http://localhost:5173"),
    }),
  );
  app.use(express.json({ limit: "20kb" }));

  app.get("/api/health", async (_request, response) => {
    try {
      await repository.ping();
      response.json({ data: { status: "ok" } });
    } catch {
      response.status(503).json({
        error: { code: "DATABASE_UNAVAILABLE", message: "The database is not available." },
      });
    }
  });

  app.get("/api/products", async (_request, response, next) => {
    try {
      const products = await repository.list();
      response.json({ data: products, meta: { count: products.length } });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:slug", async (request, response, next) => {
    const parsedSlug = slugSchema.safeParse(request.params.slug);
    if (!parsedSlug.success) {
      response.status(400).json({
        error: { code: "INVALID_SLUG", message: "The product slug is not valid." },
      });
      return;
    }

    try {
      const product = await repository.findBySlug(parsedSlug.data);
      if (!product) {
        response.status(404).json({
          error: { code: "PRODUCT_NOT_FOUND", message: "The requested product was not found." },
        });
        return;
      }

      response.json({ data: product });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api", (_request, response) => {
    response.status(404).json({
      error: { code: "ENDPOINT_NOT_FOUND", message: "The requested API endpoint was not found." },
    });
  });

  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    console.error("API request failed", error);
    response.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Something went wrong while loading the data." },
    });
  });

  return app;
}
