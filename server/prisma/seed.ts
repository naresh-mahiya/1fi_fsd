import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type VariantSeed = {
  color: string;
  colorHex: string;
  storage: string;
  ram?: string;
  mrp: number;
  price: number;
  imageUrl: string;
};

const products: Array<{
  slug: string;
  brand: string;
  name: string;
  description: string;
  variants: VariantSeed[];
}> = [
  {
    slug: "iphone-17-pro",
    brand: "Apple",
    name: "iPhone 17 Pro",
    description: "A compact Pro iPhone with an A19 Pro chip, ProMotion display and versatile camera system.",
    variants: [
      {
        color: "Silver",
        colorHex: "#d8d9d4",
        storage: "256 GB",
        mrp: 134900,
        price: 129900,
        imageUrl: "/products/iphone-17-pro-silver.jpg",
      },
      {
        color: "Deep Blue",
        colorHex: "#1d2938",
        storage: "512 GB",
        mrp: 154900,
        price: 149900,
        imageUrl: "/products/iphone-17-pro-blue.jpg",
      },
    ],
  },
  {
    slug: "samsung-s24-ultra",
    brand: "Samsung",
    name: "Galaxy S24 Ultra",
    description: "A large-screen Galaxy flagship with Galaxy AI, an integrated S Pen and a 200 MP camera.",
    variants: [
      {
        color: "Titanium Black",
        colorHex: "#4a4a4d",
        storage: "256 GB",
        ram: "12 GB",
        mrp: 129999,
        price: 99999,
        imageUrl: "/products/galaxy-s24-ultra-black.jpg",
      },
      {
        color: "Titanium Yellow",
        colorHex: "#ddd6ba",
        storage: "512 GB",
        ram: "12 GB",
        mrp: 139999,
        price: 109999,
        imageUrl: "/products/galaxy-s24-ultra-yellow.png",
      },
    ],
  },
  {
    slug: "oneplus-13",
    brand: "OnePlus",
    name: "OnePlus 13",
    description: "A fast Android flagship with a 120 Hz ProXDR display, Snapdragon 8 Elite and a 6,000 mAh battery.",
    variants: [
      {
        color: "Arctic Dawn",
        colorHex: "#e8e7df",
        storage: "256 GB",
        ram: "12 GB",
        mrp: 69999,
        price: 64999,
        imageUrl: "/products/oneplus-13-white.webp",
      },
      {
        color: "Midnight Ocean",
        colorHex: "#24354f",
        storage: "512 GB",
        ram: "16 GB",
        mrp: 76999,
        price: 71999,
        imageUrl: "/products/oneplus-13-blue.jpg",
      },
    ],
  },
];

function calculateMonthlyPayment(price: number, months: number, annualRate: number) {
  if (annualRate === 0) return Math.ceil(price / months);

  const monthlyRate = annualRate / 12 / 100;
  const factor = (1 + monthlyRate) ** months;
  return Math.ceil((price * monthlyRate * factor) / (factor - 1));
}

async function main() {
  await prisma.emiPlan.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.fundPartner.deleteMany();

  const partners = await Promise.all(
    ["Demo Growth Fund", "Demo Balanced Fund", "Demo Income Fund"].map((name) =>
      prisma.fundPartner.create({ data: { name } }),
    ),
  );

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        slug: product.slug,
        brand: product.brand,
        name: product.name,
        description: product.description,
      },
    });

    for (const [position, variant] of product.variants.entries()) {
      const createdVariant = await prisma.productVariant.create({
        data: { ...variant, position, productId: createdProduct.id },
      });

      const planOptions = [
        { tenureMonths: 3, interestRate: 0, cashbackAmount: null },
        { tenureMonths: 6, interestRate: 0, cashbackAmount: 1500 },
        { tenureMonths: 9, interestRate: 10.5, cashbackAmount: 3000 },
      ];

      await prisma.emiPlan.createMany({
        data: planOptions.map((plan, planPosition) => ({
          ...plan,
          position: planPosition,
          variantId: createdVariant.id,
          fundPartnerId: partners[planPosition].id,
          monthlyPayment: calculateMonthlyPayment(variant.price, plan.tenureMonths, plan.interestRate),
        })),
      });
    }
  }
}

main()
  .then(() => console.log("Seeded products and EMI plans"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
