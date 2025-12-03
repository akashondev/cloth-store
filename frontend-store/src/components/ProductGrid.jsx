import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

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
  const visibleProducts = safeProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-6 mt-5 py-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {visibleProducts.map((p) => (
          <div
            key={p._id || p.id}
            className="group relative overflow-hidden bg-white rounded-lg shadow-sm 
             hover:shadow-xl transition-all duration-300 
             hover:-translate-y-1 hover:scale-[1]"
          >
            {/* Product Image */}
            <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={p.images?.[0] || "https://via.placeholder.com/300"}
                alt={p.title || "Product"}
                className="w-full h-full object-cover"
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
                  <span className="text-gray-400 line-through text-sm ">
                    ₹{p.originalPrice}
                  </span>
                )}

                <button
                  onClick={() => {
                    addToCart({
                      id: p._id || p.id,
                      title: p.title,
                      price: p.price,
                      image: p.images?.[0] || "https://via.placeholder.com/300",
                    });
                    handleAdd?.(p._id || p.id);
                  }}
                  className="absolute bottom-4 right-4 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center
                    transition-all duration-300 hover:bg-[#0D9488] hover:text-white transform hover:scale-110"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
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
