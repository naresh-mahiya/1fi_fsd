import { ArrowLeft, Check } from "lucide-react";
import { useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { useRequest } from "../hooks/useRequest";
import { getProduct } from "../lib/api";
import { formatCurrency } from "../lib/format";

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("product") ?? "";
  const variantId = searchParams.get("variant") ?? "";
  const planId = searchParams.get("plan") ?? "";

  if (!slug || !variantId || !planId) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 md:px-8" id="main-content">
        <ErrorState title="Incomplete selection" message="Choose a phone variant and EMI plan before opening the summary." />
      </main>
    );
  }

  return <CheckoutSummary slug={slug} variantId={variantId} planId={planId} />;
}

function CheckoutSummary({ slug, variantId, planId }: { slug: string; variantId: string; planId: string }) {
  const request = useCallback((signal: AbortSignal) => getProduct(slug, signal), [slug]);
  const { data: product, error, loading, retry } = useRequest(request);

  if (loading) {
    return <main className="mx-auto max-w-5xl px-5 py-12 md:px-8"><ProductSkeleton /></main>;
  }

  if (error) {
    return <main className="mx-auto max-w-5xl px-5 py-20 md:px-8"><ErrorState message={error.message} retry={retry} /></main>;
  }

  const variant = product?.variants.find((item) => item.id === variantId);
  const plan = variant?.emiPlans.find((item) => item.id === planId);
  if (!product || !variant || !plan) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-20 md:px-8" id="main-content">
        <ErrorState title="Plan not found" message="This selection is no longer available. Please choose another plan." />
      </main>
    );
  }

  const totalPayments = plan.monthlyPayment * plan.tenureMonths;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16" id="main-content">
      <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink/70 hover:text-blue" to={`/products/${product.slug}?variant=${variant.id}`}>
        <ArrowLeft aria-hidden="true" size={17} /> Change selection
      </Link>

      <div className="mt-6 grid border border-ink/20 lg:grid-cols-[1fr_20rem]">
        <section className="p-6 md:p-10 lg:border-r lg:border-ink/15" aria-labelledby="summary-title">
          <div className="grid size-12 place-items-center bg-blue text-white">
            <Check aria-hidden="true" size={25} />
          </div>
          <p className="eyebrow mt-8">Selection ready</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.06em] sm:text-5xl" id="summary-title">Review your plan</h1>
          <p className="mt-4 max-w-xl text-ink/65">Check the phone, variant and monthly amount below. No order has been placed.</p>

          <dl className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {[
              ["Phone", `${product.name} — ${variant.color}`],
              ["Configuration", `${variant.storage}${variant.ram ? ` · ${variant.ram} RAM` : ""}`],
              ["Selling price", formatCurrency(variant.price)],
              ["Plan", `${plan.tenureMonths} monthly payments`],
              ["Interest", plan.interestRate === 0 ? "0% (no-cost EMI)" : `${plan.interestRate}% annually`],
              ["Fund partner", plan.fundPartner.name],
              ["Cashback", plan.cashbackAmount === null ? "Not applicable" : formatCurrency(plan.cashbackAmount)],
            ].map(([term, detail]) => (
              <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]" key={term}>
                <dt className="text-sm font-semibold text-ink/55">{term}</dt>
                <dd className="font-semibold sm:text-right">{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="bg-muted p-6 md:p-8" aria-label="Payment summary">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-ink/55">Monthly payment</p>
          <p className="mt-3 text-4xl font-bold tracking-[-0.06em] text-blue">{formatCurrency(plan.monthlyPayment)}</p>
          <p className="mt-1 text-sm text-ink/60">for {plan.tenureMonths} months</p>
          <div className="mt-8 border-t border-ink/15 pt-5 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-ink/60">Total of payments</span>
              <strong>{formatCurrency(totalPayments)}</strong>
            </div>
          </div>
          <div className="mt-10 border border-blue bg-white p-4 text-sm leading-6">
            This is the end of the assignment demo. A real application would continue to eligibility and payment checks.
          </div>
        </aside>
      </div>
    </main>
  );
}
