export type EmiPlan = {
  id: string;
  tenureMonths: number;
  monthlyPayment: number;
  interestRate: number;
  cashbackAmount: number | null;
  fundPartner: {
    id: string;
    name: string;
  };
};

export type ProductVariant = {
  id: string;
  color: string;
  colorHex: string;
  storage: string;
  ram: string | null;
  mrp: number;
  price: number;
  imageUrl: string;
  emiPlans: EmiPlan[];
};

export type ProductSummary = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  description: string;
  defaultVariant: ProductVariant;
};

export type ProductDetail = Omit<ProductSummary, "defaultVariant"> & {
  variants: ProductVariant[];
};

export interface ProductRepository {
  list(): Promise<ProductSummary[]>;
  findBySlug(slug: string): Promise<ProductDetail | null>;
  ping(): Promise<void>;
}
