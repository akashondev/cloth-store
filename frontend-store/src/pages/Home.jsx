import React, { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import hero4 from "../assets/hero4.png";
import { motion } from "framer-motion";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const handleAdd = (id) => {
    setCartCount((prev) => {
      return prev + 1;
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg animate-pulse">
              <div className="w-full h-80 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <section
          className="relative bg-no-repeat bg-cover bg-[top_25%_right_0] overflow-hidden min-h-[90vh] w-full px-20 flex items-center"
          style={{ backgroundImage: `url(${hero4})` }}
        >
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
            <div className="max-w-xl">
              {/* Left Content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Super value deals
                  <br />
                  <span className="text-teal-600">On all products</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700">
                  Save more with coupons & up to 70% off!
                </p>
                <button className="bg-amber-200 hover:bg-amber-300 text-teal-700 font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </section>

        <ProductGrid products={products} handleAdd={handleAdd} />
      </div>
    </motion.div>
  );
}

export default Home;
