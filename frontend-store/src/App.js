import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import CartPage from "./pages/Cart";
import ScrollTopBtn from "./components/ScrollTopBtn";
import AdminDashboard from "./pages/AdminDashboard";

function AnimatedRoutes({ setCartCount }) {
  const location = useLocation();

  return (
    <>
      <ScrollTopBtn />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home setCartCount={setCartCount} />} />
          <Route path="/shop" element={<Shop setCartCount={setCartCount} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Admin page needs no Navbar/Footer */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  
  const handleAdd = () => {
    const saved = JSON.parse(localStorage.getItem("cart"));
    // Check if saved is actually an array
    if (!Array.isArray(saved)) {
      setCartCount(0);
      return;
    }
    const totalQty = saved.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(totalQty);
  };

  // Load cart count when app starts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart"));
    // Check if saved is actually an array
    if (!Array.isArray(saved)) {
      setCartCount(0);
      return;
    }
    const totalQty = saved.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(totalQty);
  }, []);

  // Pages where Navbar + Footer should NOT show
  const hideLayoutFor = ["/admin"];

  const hideLayout = hideLayoutFor.includes(location.pathname);

  return (
    <>
      {/* Hide Navbar only for admin */}
      {!hideLayout && <Navbar cartCount={cartCount} />}

      <AnimatedRoutes setCartCount={setCartCount} />

      {/* Hide Footer only for admin */}
      {!hideLayout && <Footer />}
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
