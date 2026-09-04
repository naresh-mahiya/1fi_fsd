import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/format";
import type { ProductSummary } from "../types";

export function ProductCard({ product, index }: { product: ProductSummary; index: number }) {
  const variant = product.defaultVariant;
  const startingPlan = variant.emiPlans.reduce((lowest, plan) =>
    plan.monthlyPayment < lowest.monthlyPayment ? plan : lowest,
  );

  return (
    <article className="group grid border border-ink/15 bg-white transition-colors duration-200 hover:border-blue">
      <Link className="flex h-full flex-col focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue" to={`/products/${product.slug}`}>
        <div className="flex items-center justify-between border-b border-ink/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
          <span>{product.brand}</span>
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-muted p-6">
          <img
            className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
            src={variant.imageUrl}
            alt={`${product.name} in ${variant.color}`}
            width="560"
            height="420"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-2xl font-bold tracking-[-0.04em]">{product.name}</h2>
          <p className="mt-2 text-sm text-ink/65">
            {variant.storage} · {variant.color}
          </p>
          <div className="mt-7 flex items-end justify-between gap-4 border-t border-ink/15 pt-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/55">From</p>
              <p className="mt-1 text-xl font-bold">
                {formatCurrency(startingPlan.monthlyPayment)}<span className="text-sm font-normal text-ink/60">/mo</span>
              </p>
            </div>
            <ArrowUpRight className="text-blue transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
}
