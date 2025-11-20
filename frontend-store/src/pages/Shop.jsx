import React from "react";
import { motion } from "framer-motion";

const Shop = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration:  0.2 }}
    >
      <div className="min-h-screen items-center justify-center bg-gray-100">
        
        <h2 className="text-3xl font-semibold">Shop!!</h2>
  
      </div>
    </motion.div>
  );
};

export default Shop;
