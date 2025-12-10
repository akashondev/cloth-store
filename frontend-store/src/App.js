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
import Login from "./pages/Login";
import ScrollTopBtn from "./components/ScrollTopBtn";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentPage from "./pages/Payment";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import SmoothScroll from "./components/SmoothScroll";
import VerifyEmailPage from "./components/VerifyEmailPage";
import Orders  from "./pages/Orders";

function ScrollToTop() {
  const { pathname } = useLocation();


  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}


function AnimatedRoutes({ setCartCount }) {
  const location = useLocation();

  return (
    <>
      <ScrollTopBtn />

      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home setCartCount={setCartCount} />} />
          <Route path="/shop" element={<Shop setCartCount={setCartCount} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/cart" element={<CartPage setCartCount={setCartCount} />}/>
         <Route path="/success" element={<SuccessPage />} />
         <Route path="/cancel" element={<CancelPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="adminpanel" element={<adminpanel/>}/>


          <Route path="/verify/:token" element={<VerifyEmailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const updateCartCount = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart"));
      if (!Array.isArray(saved)) {
        setCartCount(0);
        return;
      }
      const totalQty = saved.reduce((sum, item) => sum + (item.qty || 0), 0);
      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  };

  // Load cart count when app starts
  useEffect(() => {
    updateCartCount();

    // Listen for cart updates from any component
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Pages where Navbar + Footer should NOT show
  const hideLayoutFor = ["/admin", "/Login"];

  const hideLayout = hideLayoutFor
    .map((p) => p.toLowerCase())
    .includes(location.pathname.toLowerCase());


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
      <SmoothScroll />
    </Router>
  );
}
