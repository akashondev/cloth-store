import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2  }}>
    <div className="min-h-screen items-center justify-center bg-gray-100">
    <Navbar/>
      <h2 className="text-3xl font-semibold">About Us!!</h2>
    <Footer/>
      </div>
      </motion.div>
  );
}

export default About;
