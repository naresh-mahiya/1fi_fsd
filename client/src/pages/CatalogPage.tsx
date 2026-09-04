import { ArrowDown } from "lucide-react";
import { useCallback } from "react";
import { ErrorState } from "../components/ErrorState";
import { ProductCard } from "../components/ProductCard";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { useRequest } from "../hooks/useRequest";
import { getProducts } from "../lib/api";

export function CatalogPage() {
  const request = useCallback((signal: AbortSignal) => getProducts(signal), []);
  const { data: products, error, loading, retry } = useRequest(request);

  return (
    <main id="main-content">
      <section className="border-b border-ink/15">
        <div className="mx-auto grid max-w-7xl md:grid-cols-[1fr_14rem]">
          <div className="px-5 py-16 md:border-r md:border-ink/15 md:px-8 md:py-24">
            <p className="eyebrow">Smartphones on flexible EMI</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[0.94] tracking-[-0.07em] sm:text-7xl lg:text-[6.6rem]">
              Pick the phone.<br />Plan the month.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-ink/65">
              Compare variants and transparent monthly plans for three popular flagship phones.
            </p>
          </div>
          <div className="hidden flex-col justify-between p-8 md:flex">
            <span className="text-8xl font-bold leading-none tracking-[-0.08em] text-blue">03</span>
            <a className="flex items-center gap-2 text-sm font-bold" href="#phones">
              Browse phones <ArrowDown aria-hidden="true" size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20" id="phones" aria-labelledby="phones-title">
        <div className="mb-8 flex items-end justify-between border-b border-ink/15 pb-4">
          <h2 className="text-3xl font-bold tracking-[-0.05em]" id="phones-title">Choose a phone</h2>
          {products && <span className="text-sm text-ink/55">{products.length} {products.length === 1 ? "product" : "products"}</span>}
        </div>
        {loading && <ProductSkeleton cards />}
        {error && <ErrorState message={error.message} retry={retry} />}
        {products && products.length > 0 && (
          <div className="grid gap-px bg-ink/15 md:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard product={product} index={index} key={product.id} />
            ))}
          </div>
        )}
        {products?.length === 0 && <ErrorState title="No phones available" message="The catalog is empty right now." />}
      </section>

      <section className="border-t border-ink/15 bg-muted" id="how-it-works" aria-labelledby="steps-title">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em]" id="steps-title">Three straightforward steps</h2>
          <ol className="mt-10 grid gap-px bg-ink/15 md:grid-cols-3">
            {[
              ["01", "Choose a variant", "Pick the storage and finish that suits you."],
              ["02", "Compare plans", "Review monthly cost, interest and cashback together."],
              ["03", "Check the summary", "Confirm the exact phone and plan before continuing."],
            ].map(([number, title, copy]) => (
              <li className="bg-white p-6 md:p-8" key={number}>
                <span className="text-4xl font-bold tracking-[-0.05em] text-blue">{number}</span>
                <h3 className="mt-10 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-ink/65">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
