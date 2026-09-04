-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "ram" TEXT,
    "mrp" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FundPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmiPlan" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "fundPartnerId" TEXT NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "monthlyPayment" INTEGER NOT NULL,
    "interestRate" DECIMAL(5,2) NOT NULL,
    "cashbackAmount" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EmiPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_position_idx" ON "ProductVariant"("productId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_color_storage_key" ON "ProductVariant"("productId", "color", "storage");

-- CreateIndex
CREATE UNIQUE INDEX "FundPartner_name_key" ON "FundPartner"("name");

-- CreateIndex
CREATE INDEX "EmiPlan_variantId_position_idx" ON "EmiPlan"("variantId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "EmiPlan_variantId_tenureMonths_fundPartnerId_key" ON "EmiPlan"("variantId", "tenureMonths", "fundPartnerId");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmiPlan" ADD CONSTRAINT "EmiPlan_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmiPlan" ADD CONSTRAINT "EmiPlan_fundPartnerId_fkey" FOREIGN KEY ("fundPartnerId") REFERENCES "FundPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

