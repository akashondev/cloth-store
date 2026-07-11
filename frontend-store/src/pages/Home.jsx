import React, { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import hero1 from "../assets/hero-1.png";
import hero2 from "../assets/hero-2.png";
import { AnimatePresence, motion } from "framer-motion";

export const heroContentVariants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.12, staggerChildren: 0.12 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

export const heroItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18 },
  },
};

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHero, setCurrentHero] = useState(0);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const currentSlide = heroImages[currentHero];

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <section
        data-testid="home-hero"
        className="relative min-h-[68svh] w-full overflow-hidden md:min-h-[91vh]"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentHero}
            src={currentSlide.image}
            alt=""
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover object-[68%_center] md:object-[75%_25%]"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </AnimatePresence>
        <div
          data-testid="hero-overlay"
          className="absolute inset-0 z-[1] bg-gradient-to-r from-white/95 via-white/80 to-white/15 md:from-white/70 md:via-white/30 md:to-transparent"
        />
        <div className="relative z-10 mx-auto flex min-h-[64svh] w-full max-w-7xl items-center px-5 py-10 sm:px-6 md:min-h-[88vh] md:py-24">
          <div className="max-w-[19rem] text-left sm:max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero}
                variants={heroContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4 md:space-y-6"
              >
                <motion.p
                  variants={heroItemVariants}
                  className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0D9488] sm:text-sm sm:tracking-[0.2em]"
                >
                  Styllin selected edit
                </motion.p>
                <motion.h1
                  variants={heroItemVariants}
                  className="text-[2.35rem] font-bold leading-[1.02] text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl"
                >
                  {currentSlide.title.join(" ")}
                  <br />
                  <span className="text-teal-600">
                    {currentSlide.subtitle.join(" ")}
                  </span>
                </motion.h1>
                <motion.p
                  variants={heroItemVariants}
                  className="max-w-xs text-sm leading-6 text-gray-700 sm:max-w-md sm:text-lg md:text-xl"
                >
                  {currentSlide.description}
                </motion.p>
                <motion.a
                  href="#products"
                  variants={heroItemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex rounded-full bg-amber-200 px-6 py-3 text-sm font-semibold text-teal-700 shadow-lg transition-colors duration-300 hover:bg-amber-300 sm:px-8 sm:py-4 sm:text-base"
                >
                  Shop Now
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-8">
          {heroImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentHero(index)}
              whileTap={{ scale: 0.9 }}
              animate={{ width: index === currentHero ? 32 : 8 }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentHero ? "bg-teal-600" : "bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section id="products" className="bg-white pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto max-w-7xl px-6"
        >
          <div className="flex flex-col gap-3 border-b border-zinc-200 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0D9488]">
                Fresh from Styllin
              </p>
              <h2 className="mt-3 text-3xl font-bold text-zinc-950 md:text-4xl">
                Curated pieces for your next fit
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-600">
              Browse the latest shirts, layers, and essentials selected for a
              clean everyday wardrobe.
            </p>
          </div>
        </motion.div>
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div
              key="product-skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <ProductGridSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="product-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <ProductGrid products={products} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

export default Home;
