import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { ProductDetail, ProductRepository, ProductVariant } from "../types.js";

const variantInclude = {
  emiPlans: {
    orderBy: { position: "asc" },
    include: { fundPartner: true },
  },
} satisfies Prisma.ProductVariantInclude;

type VariantWithPlans = Prisma.ProductVariantGetPayload<{ include: typeof variantInclude }>;

function mapVariant(variant: VariantWithPlans): ProductVariant {
  return {
    id: variant.id,
    color: variant.color,
    colorHex: variant.colorHex,
    storage: variant.storage,
    ram: variant.ram,
    mrp: variant.mrp,
    price: variant.price,
    imageUrl: variant.imageUrl,
    emiPlans: variant.emiPlans.map((plan) => ({
      id: plan.id,
      tenureMonths: plan.tenureMonths,
      monthlyPayment: plan.monthlyPayment,
      interestRate: Number(plan.interestRate),
      cashbackAmount: plan.cashbackAmount,
      fundPartner: {
        id: plan.fundPartner.id,
        name: plan.fundPartner.name,
      },
    })),
  };
}

export const prismaProductRepository: ProductRepository = {
  async list() {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        variants: {
          orderBy: { position: "asc" },
          take: 1,
          include: variantInclude,
        },
      },
    });

    return products.flatMap((product) => {
      const defaultVariant = product.variants[0];
      if (!defaultVariant) return [];

      return [
        {
          id: product.id,
          slug: product.slug,
          brand: product.brand,
          name: product.name,
          description: product.description,
          defaultVariant: mapVariant(defaultVariant),
        },
      ];
    });
  },

  async findBySlug(slug): Promise<ProductDetail | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          orderBy: { position: "asc" },
          include: variantInclude,
        },
      },
    });

    if (!product) return null;

    return {
      id: product.id,
      slug: product.slug,
      brand: product.brand,
      name: product.name,
      description: product.description,
      variants: product.variants.map(mapVariant),
    };
  },

  async ping() {
    await prisma.$queryRaw`SELECT 1`;
  },
};
