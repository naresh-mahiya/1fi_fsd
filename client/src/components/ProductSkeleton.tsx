export function ProductSkeleton({ cards = false }: { cards?: boolean }) {
  if (cards) {
    return (
      <div className="grid gap-px bg-ink/10 md:grid-cols-3" aria-label="Loading products" role="status">
        {[0, 1, 2].map((item) => (
          <div className="h-[29rem] animate-pulse bg-muted motion-reduce:animate-none" key={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid animate-pulse gap-10 motion-reduce:animate-none lg:grid-cols-2" aria-label="Loading product" role="status">
      <div className="aspect-square bg-muted" />
      <div className="space-y-5 pt-8">
        <div className="h-4 w-24 bg-ink/10" />
        <div className="h-14 w-4/5 bg-ink/10" />
        <div className="h-5 w-full bg-ink/10" />
        <div className="h-24 w-full bg-ink/10" />
        <div className="h-44 w-full bg-ink/10" />
      </div>
    </div>
  );
}
