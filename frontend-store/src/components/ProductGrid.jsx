import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "../lib/utils";

const fallbackImage =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80";

function ProductGrid({ products, handleAdd }) {
  const [visibleCount, setVisibleCount] = useState(16);
  const [safeProducts, setSafeProducts] = useState([]);

  // 1. loadCart
  const loadCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  };

  // 2. saveCart
  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // 3. addToCart
  const addToCart = (product) => {
    let cart = loadCart();
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      exists.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);

    // Notify App.jsx and Navbar that cart was updated
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new CustomEvent("appToast", {
      detail: { title: "Added to cart", message: product.title, tone: "success" },
    }));

    // console.log("Added to cart:", product.id);
  };

  // Validate and sanitize products prop
  useEffect(() => {
    if (Array.isArray(products)) {
      setSafeProducts(products);
    } else if (products && Array.isArray(products.data)) {
      // handle nested API response like { data: [...] }
      setSafeProducts(products.data);
    } else {
      console.warn("Invalid products prop:", products);
      setSafeProducts([]);
    }
  }, [products]);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 16);
  const handleLoadLess = () => {
    setVisibleCount((prev) => Math.max(16, prev - 16));

    window.requestAnimationFrame?.(() => {
      const productsSection = document.getElementById("products");
      if (!productsSection) return;

      const reduceMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      productsSection.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  };
  const visibleProducts = safeProducts.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12">
      {/* Product Grid */}
      <div
        data-testid="product-grid"
        className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8"
      >
        {visibleProducts.map((p) => (
          <motion.div
            key={p._id || p.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.18 }}
            className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
          >
            {/* Product Image */}
            <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-zinc-100 sm:h-64 lg:h-80">
              <img
                src={p.images?.[0] || p.image || fallbackImage}
                alt={p.title || "Product"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.src = fallbackImage;
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-2.5 pb-3 sm:p-4 sm:pb-5">
              <h3 className="mb-2 min-h-10 line-clamp-2 text-xs font-semibold leading-5 text-zinc-900 sm:mb-3 sm:min-h-11 sm:text-[15px] sm:leading-relaxed">
                {p.title || "Untitled Product"}
              </h3>

              <div className="flex items-center justify-between gap-1.5 sm:gap-3">
                <span className="text-sm font-bold text-gray-900 sm:text-lg">
                  {formatCurrency(p.price)}
                </span>
                {p.originalPrice && (
                  <span className="text-[10px] text-gray-400 line-through sm:text-sm">
                    {formatCurrency(p.originalPrice)}
                  </span>
                )}

                <button
                  onClick={() => {
                    addToCart({
                      id: p._id || p.id,
                      title: p.title,
                      price: p.price,
                      image:
                        p.images?.[0] || p.image || fallbackImage,
                    });
                    handleAdd?.(p._id || p.id);
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-lg sm:h-11 sm:w-11
                    transition-all duration-300 hover:bg-[#0D9488] transform hover:scale-110"
                  aria-label={`Add ${p.title} to cart`}
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {(safeProducts.length > visibleCount || visibleCount > 16) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {visibleCount > 16 && (
            <button
              type="button"
              onClick={handleLoadLess}
              className="rounded-md border-2 border-gray-700 px-6 py-2 font-semibold text-gray-800 transition-all duration-300 hover:bg-gray-100"
            >
              Load Less
            </button>
          )}

          {safeProducts.length > visibleCount && (
          <button
            type="button"
            onClick={handleLoadMore}
            className="rounded-md border-2 border-gray-800 bg-gray-800 px-6 py-2 font-semibold text-white transition-all duration-300 hover:bg-black"
          >
            Load More
          </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
