import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product._id || product.id,
          title: product.title,
          image: product.images?.[0],
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      {" "}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {" "}
        {/* BRAND */}{" "}
        <Link className="flex items-center gap-2" to="/">
          {" "}
          <img
            src={logo}
            className="w-10 h-10 object-contain"
            alt="Styllin Logo"
          />{" "}
          <span className="text-2xl font-semibold logo-font">Styllin</span>{" "}
        </Link>{" "}
        <ul className="hidden lg:flex gap-8 text-base font-medium">
          {" "}
          <Link to="/" className="group relative w-max text-white">
            {" "}
            Home{" "}
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#0D9488] transition-all rounded-full group-hover:w-full"></span>{" "}
          </Link>{" "}
          <Link to="/Shop" className="group relative w-max text-white">
            {" "}
            Shop{" "}
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#0D9488] transition-all rounded-full group-hover:w-full"></span>{" "}
          </Link>{" "}
          <Link to="/Blog" className="group relative w-max text-white">
            {" "}
            Blog{" "}
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#0D9488] transition-all rounded-full group-hover:w-full"></span>{" "}
          </Link>{" "}
          <Link to="/About" className="group relative w-max text-white">
            {" "}
            About Us{" "}
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#0D9488] transition-all rounded-full group-hover:w-full"></span>{" "}
          </Link>{" "}
        </ul>
        
        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* CART DROPDOWN */}
          <div className="relative">
            <button
              onMouseEnter={() => setCartOpen(true)}
              onMouseLeave={() => setCartOpen(false)}
              onClick={() => setCurrentPage("cart")}
              className="p-2 rounded-md hover:bg-white/10 relative"
            >
              <ShoppingCart size={20} />

              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#0D9488] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Cart Preview Dropdown */}
            {cartOpen && cart.length > 0 && (
              <div
                onMouseEnter={() => setCartOpen(true)}
                onMouseLeave={() => setCartOpen(false)}
                className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 text-gray-800"
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-lg">Shopping Cart</h3>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {cart.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border-b border-gray-100 flex gap-3 hover:bg-gray-50"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-[#0D9488] mt-1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="font-bold text-[#0D9488]">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPage("cart");
                      setCartOpen(false);
                    }}
                    className="w-full bg-[#0D9488] text-white py-2 rounded-lg font-semibold hover:bg-[#0a7a70] transition-colors"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACCOUNT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setUserOpen(!userOpen);
                setCartOpen(false);
              }}
              className="p-2 rounded-md hover:bg-white/10"
            >
              <User size={20} />
            </button>

            {userOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-white/10 rounded-lg shadow-lg z-50">
                <ul className="p-2 text-sm text-gray-300">
                  <button className="block w-full text-left px-3 py-2 hover:bg-white/10">
                    My Account
                  </button>
                  <button className="block w-full text-left px-3 py-2 hover:bg-white/10">
                    Orders
                  </button>
                  <button className="block w-full text-left px-3 py-2 hover:bg-white/10">
                    Settings
                  </button>
                </ul>

                <div className="p-2 border-t border-white/10">
                  <button className="block w-full text-left px-3 py-2 hover:bg-white/10">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-white/10"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-white/10 py-3 px-4 space-y-3 text-sm text-gray-300">
          <button
            onClick={() => setCurrentPage("home")}
            className="block w-full text-left hover:text-white"
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage("shop")}
            className="block w-full text-left hover:text-white"
          >
            Shop
          </button>
          <button
            onClick={() => setCurrentPage("blog")}
            className="block w-full text-left hover:text-white"
          >
            Blog
          </button>
          <button
            onClick={() => setCurrentPage("about")}
            className="block w-full text-left hover:text-white"
          >
            About Us
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
