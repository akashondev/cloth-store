import React from "react";

function ProductGridSkeleton({ count = 8 }) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      aria-busy="true"
      className="mx-auto max-w-7xl px-6 py-12"
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }, (_, index) => (
          <article
            key={index}
            data-testid="product-skeleton"
            aria-hidden="true"
            className="product-skeleton-shimmer relative overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
            style={{ "--skeleton-index": index }}
          >
            <div className="relative h-80 w-full bg-zinc-200/80">
              <div className="absolute left-4 top-4 h-6 w-20 rounded-full bg-zinc-100" />
            </div>

            <div className="p-4 pb-5">
              <div className="h-4 w-11/12 rounded-full bg-zinc-200" />
              <div className="mt-3 h-4 w-7/12 rounded-full bg-zinc-200/80" />

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="h-6 w-20 rounded-full bg-zinc-200" />
                <div className="h-11 w-11 rounded-full bg-zinc-200" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProductGridSkeleton;
