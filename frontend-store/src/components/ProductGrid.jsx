import React, { useState, useEffect } from "react";

function ProductGrid({ products, onAddToCart }) {
  const [visibleCount, setVisibleCount] = useState(16);
  const [safeProducts, setSafeProducts] = useState([]);

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
  const visibleProducts = safeProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-6 mt-5 py-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {visibleProducts.map((p) => (
          <div
            key={p._id || p.id}
            className="group relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-lg transition"
          >
            {/* Product Image */}
            <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={p.images?.[0] || "https://via.placeholder.com/300"}
                alt={p.title || "Product"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Product Info */}
            <div className="pt-4 pb-3 px-4">
              <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 leading-relaxed">
                {p.title || "Untitled Product"}
              </h3>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg font-semibold text-gray-900">
                  ₹{p.price ?? "--"}
                </span>
                {p.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    ₹{p.originalPrice}
                  </span>
                )}
              </div>

              <button
                onClick={() => onAddToCart?.(p._id || p.id)}
                className="block text-center w-full py-2 px-4 rounded-md border-2 border-gray-600 text-gray-800 text-xs font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>            
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {safeProducts.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 border-2 border-gray-700 text-gray-800 font-semibold rounded-md hover:bg-gray-800 hover:text-white transition-all duration-300"
          >
            Load More
          </button>
          
        </div>        
      )}
    </div>
  );
}

export default ProductGrid;
