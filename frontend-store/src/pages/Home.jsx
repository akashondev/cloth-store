import React, { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import hero1 from "../assets/hero-1.png";
import hero2 from "../assets/hero-2.png";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [currentHero, setCurrentHero] = useState(0);

  // Hero images array - add your hero images here
  const heroImages = [
    {
      image: hero1,
      title: ["Super", "value", "deals"],
      subtitle: ["On", "all", "products"],
      description: "Save more with coupons & up to 70% off!",
    },
    {
      image: hero2,
      title: ["New", "arrivals"],
      subtitle: ["For", "this", "season"],
      description: "Discover the latest trends in fashion!",
    },
  ];

  const handleAdd = () => {
    setCartCount((prev) => prev + 1);
  };

  // REMOVED: Auto-change hero image functionality

  // Page Load Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Fetch Products
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

  // Navigation functions
  const goToNextSlide = () => {
    setCurrentHero((prev) => (prev + 1) % heroImages.length);
  };

  const goToPrevSlide = () => {
    setCurrentHero(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };

  // Motion Variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const word = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const currentSlide = heroImages[currentHero];

  return (
    <>
      <motion.div
        animate={{ opacity: pageLoading ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        style={{ display: pageLoading ? "flex" : "none" }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 border-b-2 border-blue-600 rounded-full mx-auto mb-2"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: pageLoading ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="min-h-screen bg-gray-100 overflow-x-hidden">
          {/* HERO */}
          <section className="relative overflow-hidden min-h-[90vh] w-full">
            {/* Animated Background Images */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 bg-no-repeat bg-cover bg-[top_25%_right_0]"
                style={{ backgroundImage: `url(${currentSlide.image})` }}
              />
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 w-full flex items-center min-h-[90vh]">
              <div className="max-w-xl space-y-6 text-left">
                {/* Animated Heading */}
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={`title-${currentHero}`}
                    variants={container}
                    initial="hidden"
                    animate={pageLoading ? "hidden" : "show"}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
                  >
                    {currentSlide.title.map((w, i) => (
                      <motion.span
                        key={i}
                        variants={word}
                        className="inline-block mr-3"
                      >
                        {w}
                      </motion.span>
                    ))}
                    <br />
                    {currentSlide.subtitle.map((w, i) => (
                      <motion.span
                        key={i}
                        variants={word}
                        className="inline-block mr-3 text-teal-600"
                      >
                        {w}
                      </motion.span>
                    ))}
                  </motion.h1>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${currentHero}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: pageLoading ? 0 : 1,
                      x: pageLoading ? -20 : 0,
                    }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                    className="text-lg md:text-xl text-gray-700 max-w-md"
                  >
                    {currentSlide.description}
                  </motion.p>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`btn-${currentHero}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: pageLoading ? 0 : 1,
                      scale: pageLoading ? 0.9 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 1, duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-amber-200 hover:bg-amber-300 text-teal-700 font-semibold px-8 py-4 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                      Shop Now
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Slide Indicators */}
            {heroImages.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHero(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentHero
                        ? "w-8 bg-teal-600"
                        : "w-2 bg-gray-400 hover:bg-gray-600"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </section>

          {/* PRODUCT GRID */}
          <ProductGrid products={products} handleAdd={handleAdd} />
        </div>
      </motion.div>
    </>
  );
}

export default Home;
