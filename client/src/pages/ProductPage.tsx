import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EmiPlanCard } from "../components/EmiPlanCard";
import { ErrorState } from "../components/ErrorState";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { useRequest } from "../hooks/useRequest";
import { ApiError, getProduct } from "../lib/api";
import { discountPercent, formatCurrency } from "../lib/format";

export function ProductPage() {
  const { slug = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const request = useCallback((signal: AbortSignal) => getProduct(slug, signal), [slug]);
  const { data: product, error, loading, retry } = useRequest(request);
  const requestedVariantId = searchParams.get("variant");
  const selectedVariant = product?.variants.find((variant) => variant.id === requestedVariantId) ?? product?.variants[0];
  const [selectedPlanId, setSelectedPlanId] = useState("");

  useEffect(() => {
    if (!selectedVariant) return;
    if (requestedVariantId !== selectedVariant.id) {
      setSearchParams({ variant: selectedVariant.id }, { replace: true });
    }
  }, [requestedVariantId, selectedVariant, setSearchParams]);

  useEffect(() => {
    if (!selectedVariant) return;
    const stillAvailable = selectedVariant.emiPlans.some((plan) => plan.id === selectedPlanId);
    if (!stillAvailable) setSelectedPlanId(selectedVariant.emiPlans[0]?.id ?? "");
  }, [selectedPlanId, selectedVariant]);

  const selectedPlan = useMemo(
    () => selectedVariant?.emiPlans.find((plan) => plan.id === selectedPlanId),
    [selectedPlanId, selectedVariant],
  );

  function selectVariant(variantId: string) {
    setSearchParams({ variant: variantId });
    setSelectedPlanId("");
  }

  function proceed() {
    if (!product || !selectedVariant || !selectedPlan) return;
    const query = new URLSearchParams({
      product: product.slug,
      variant: selectedVariant.id,
      plan: selectedPlan.id,
    });
    navigate(`/checkout?${query.toString()}`);
  }

  if (loading) {
    return <main className="mx-auto max-w-7xl px-5 py-12 md:px-8"><ProductSkeleton /></main>;
  }

  if (error) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <ErrorState
          title={notFound ? "Phone not found" : undefined}
          message={notFound ? "The phone link may be incorrect or no longer available." : error.message}
          retry={notFound ? undefined : retry}
        />
      </main>
    );
  }

  if (!product || !selectedVariant) return null;

  return (
    <main className="pb-28 md:pb-0" id="main-content">
      <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
        <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink/70 hover:text-blue" to="/">
          <ArrowLeft aria-hidden="true" size={17} /> Back to phones
        </Link>
      </div>

      <div className="border-y border-ink/15">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <section className="grid min-h-[24rem] place-items-center bg-muted p-6 sm:p-10 lg:min-h-[45rem] lg:border-r lg:border-ink/15" aria-label="Product image">
            <img
              className="max-h-[36rem] h-full w-full object-contain"
              src={selectedVariant.imageUrl}
              alt={`${product.name} in ${selectedVariant.color}`}
              width="700"
              height="700"
            />
          </section>

          <section className="px-5 py-10 md:px-10 lg:px-12 lg:py-14" aria-labelledby="product-name">
            <p className="eyebrow">{product.brand}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.06em] sm:text-5xl" id="product-name">{product.name}</h1>
            <p className="mt-4 max-w-xl leading-7 text-ink/65">{product.description}</p>

            <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-2 border-y border-ink/15 py-6">
              <span className="text-3xl font-bold tracking-[-0.04em]">{formatCurrency(selectedVariant.price)}</span>
              <span className="pb-1 text-ink/50 line-through">{formatCurrency(selectedVariant.mrp)}</span>
              <span className="bg-blue px-2 py-1 text-xs font-bold text-white">
                {discountPercent(selectedVariant.mrp, selectedVariant.price)}% off
              </span>
            </div>

            <fieldset className="mt-8">
              <legend className="text-sm font-bold">Choose a variant</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {product.variants.map((variant) => {
                  const selected = variant.id === selectedVariant.id;
                  return (
                    <button
                      className={`flex min-h-16 items-center gap-3 border px-4 text-left transition-colors ${selected ? "border-blue bg-blue/[0.04]" : "border-ink/20 hover:border-ink/50"}`}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectVariant(variant.id)}
                      key={variant.id}
                    >
                      <span className="size-5 shrink-0 border border-ink/30" style={{ backgroundColor: variant.colorHex }} aria-hidden="true" />
                      <span>
                        <strong className="block text-sm">{variant.color}</strong>
                        <span className="text-xs text-ink/60">{variant.storage}{variant.ram ? ` · ${variant.ram} RAM` : ""}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-10">
              <legend className="text-xl font-bold tracking-tight">Select an EMI plan</legend>
              <p className="mt-1 text-sm text-ink/60">All plans below are assignment demo data.</p>
              <div className="mt-4 grid gap-3" aria-live="polite">
                {selectedVariant.emiPlans.map((plan) => (
                  <EmiPlanCard plan={plan} selected={plan.id === selectedPlanId} onSelect={() => setSelectedPlanId(plan.id)} key={plan.id} />
                ))}
              </div>
            </fieldset>

            <div className="mt-8 hidden md:block">
              <button className="button-primary w-full" type="button" disabled={!selectedPlan} onClick={proceed}>
                Proceed with selected plan <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>

            <div className="mt-6 flex items-start gap-3 border-t border-ink/15 pt-5 text-sm text-ink/60">
              <ShieldCheck className="mt-0.5 shrink-0 text-blue" aria-hidden="true" size={19} />
              <p>This demo stops at the confirmation screen. It does not collect payment or identity details.</p>
            </div>
          </section>
        </div>
      </div>

      <div className="sticky inset-x-0 bottom-0 z-20 border-t border-ink/20 bg-white p-3 md:hidden">
        <button className="button-primary w-full" type="button" disabled={!selectedPlan} onClick={proceed}>
          {selectedPlan ? `Continue · ${formatCurrency(selectedPlan.monthlyPayment)}/mo` : "Select a plan"}
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>
    </main>
  );
}
