import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

function ProductGrid({ products, onAddToCart }) {
  const [visibleCount, setVisibleCount] = useState(16);
  const [safeProducts, setSafeProducts] = useState([]);

  useEffect(() => {
    if (Array.isArray(products)) {
      setSafeProducts(products);
    } else if (products && Array.isArray(products.data)) {
      setSafeProducts(products.data);
    } else {
      console.warn("Invalid products prop:", products);
      setSafeProducts([]);
    }
  }, [products]);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 16);
  const visibleProducts = safeProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProducts.map((p) => (
          <div
            key={p._id || p.id}
            className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            {/* Product Image */}
            <div className="relative w-full h-72 bg-gray-50 overflow-hidden">
              <img
                src={p.images?.[0] || "https://via.placeholder.com/300"}
                alt={p.title || "Product"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-5">
              <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-2 leading-snug min-h-[3rem]">
                {p.title || "Untitled Product"}
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{p.price ?? "--"}
                </span>
              </div>

              {/* Add to Cart Icon - Appears on Hover */}
              <button
                onClick={() => onAddToCart?.(p)}
                className="absolute bottom-4 right-4 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center
             transition-all duration-300 hover:bg-[#0D9488] hover:text-white transform hover:scale-110"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {safeProducts.length > visibleCount && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg 
            hover:bg-gray-800 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
