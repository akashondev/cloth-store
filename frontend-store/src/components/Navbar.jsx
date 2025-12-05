import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar({ cartCount }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));


  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link className="flex items-center gap-2" to="/">
          <img
            src={logo}
            className="w-10 h-10 object-contain"
            alt="Styllin Logo"
          />
          <span className="text-2xl font-semibold logo-font">Styllin</span>
          
        </Link>

      

        <ul className="hidden lg:flex gap-8 text-base font-medium">
          <Link to="/" className="group relative w-max text-white">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#0D9488] rounded-full transition-all group-hover:w-full"></span>
          </Link>

          <Link to="/Shop" className="group relative w-max text-white">
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#0D9488] rounded-full transition-all group-hover:w-full"></span>
          </Link>

          <Link to="/Blog" className="group relative w-max text-white">
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#0D9488] rounded-full transition-all group-hover:w-full"></span>
          </Link>

          <Link to="/About" className="group relative w-max text-white">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-[#0D9488] rounded-full transition-all group-hover:w-full"></span>
          </Link>
        </ul>

        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="p-2 rounded-md hover:bg-white/10 relative flex items-center"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0D9488] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

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
                  {user && (
                    <div className="px-3 py-2 text-gray-400 text-sm">
                      Logged in as <b>{user.name}</b>
                    </div>
                  )}

                  <Link className="block px-3 py-2 hover:bg-white/10" to="#">
                    My Account
                  </Link>
                  <Link className="block px-3 py-2 hover:bg-white/10" to="/Orders">
                    Orders
                  </Link>
                  <Link className="block px-3 py-2 hover:bg-white/10" to="#">
                    Settings
                  </Link>
                </ul>

                <div className="p-2 border-t border-white/10">
                  {!user ? (
                    <Link
                      className="block px-3 py-2 hover:bg-white/10"
                      to="/Login"
                    >
                      Login
                    </Link>
                  ) : (
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-white/10"
                      onClick={() => {
                        localStorage.removeItem("user");
                        window.location.href = "/Login";
                      }}
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-white/10"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

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
