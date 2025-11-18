import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* BRAND */}
        <Link className="flex items-center gap-2" to="/">
          <img
            src={logo}
            className="w-10 h-10 object-contain"
            alt="Styllin Logo"
          />
          <span className="text-2xl font-semibold logo-font">Styllin</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-8 text-base font-medium text-gray-300">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <Link to="/Shop" className=" hover:text-white">
            Shop
          </Link>
          <Link to="/Blog" className=" hover:text-white">
            Blog
          </Link>
          <Link to="/About" className=" hover:text-white">
            About Us
          </Link>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* CART DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setCartOpen(!cartOpen);
                setUserOpen(false);
              }}
              className="p-2 rounded-md hover:bg-white/10"
            >
              <ShoppingCart size={20} />
            </button>

            {cartOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-black border border-white/10 rounded-lg shadow-lg p-4 z-50">
                <p className="text-sm text-gray-300">Your cart is empty.</p>
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
                  <Link className="block px-3 py-2 hover:bg-white/10" to="#">
                    My Account
                  </Link>
                  <Link className="block px-3 py-2 hover:bg-white/10" to="#">
                    Orders
                  </Link>
                  <Link className="block px-3 py-2 hover:bg-white/10" to="#">
                    Settings
                  </Link>
                </ul>

                <div className="p-2 border-t border-white/10">
                  <Link className="block px-3 py-2 hover:bg-white/10" to="#">
                    Sign Out
                  </Link>
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
          <Link to="/" className="block hover:text-white">
            Home
          </Link>
          <Link to="/Shop" className="block hover:text-white">
            Shop
          </Link>
          <Link to="/Blog" className="block hover:text-white">
            Blog
          </Link>
          <Link to="/About" className="block hover:text-white">
            About Us
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
