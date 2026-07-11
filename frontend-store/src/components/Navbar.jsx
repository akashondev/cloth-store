import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  Menu,
  PackageCheck,
  ShoppingCart,
  User,
} from "lucide-react";
import logo from "../assets/logo.png";
import { getStoredUser } from "../lib/storage";

function Navbar({ cartCount }) {
  const [userOpen, setUserOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const accountTriggerRef = useRef(null);
  const user = getStoredUser();
  const userName = user?.name?.trim() || "";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!userOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setUserOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setUserOpen(false);
        accountTriggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userOpen]);

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link className="flex items-center gap-2" to="/">
          <img
            src={logo}
            className="w-10 h-10 object-contain"
            alt="Styllin Logo"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
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

          <div ref={accountMenuRef} className="relative">
            <button
              ref={accountTriggerRef}
              type="button"
              aria-expanded={userOpen}
              aria-haspopup="menu"
              aria-label={userName ? `Open account menu for ${userName}` : "Open account menu"}
              data-account-state={user ? "logged-in" : "logged-out"}
              onClick={() => setUserOpen((open) => !open)}
              className="p-2 rounded-md hover:bg-white/10"
            >
              {user ? (
                <span
                  data-testid={userInitial ? "account-avatar" : "account-avatar-fallback"}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D9488] text-sm font-bold text-white ring-2 ring-teal-300/40 transition-colors hover:bg-teal-700"
                  aria-hidden="true"
                >
                  {userInitial || <User size={17} strokeWidth={2.25} />}
                </span>
              ) : (
                <User size={20} />
              )}
            </button>

            {userOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-2xl z-50"
              >
                <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
                  {user ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0D9488]">
                        Styllin account
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-zinc-950">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-zinc-500">{user.email}</p>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-zinc-950">
                      Sign in to view orders
                    </p>
                  )}
                </div>

                <ul className="p-2 text-sm">
                  <Link
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-zinc-700 transition hover:bg-teal-50 hover:text-[#0D9488]"
                    to="/account"
                    onClick={() => setUserOpen(false)}
                  >
                    <User size={17} />
                    My Account
                  </Link>

                  <Link
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-zinc-700 transition hover:bg-teal-50 hover:text-[#0D9488]"
                    to="/Orders"
                    onClick={() => setUserOpen(false)}
                  >
                    <PackageCheck size={17} />
                    Orders
                  </Link>
                </ul>

                <div className="border-t border-zinc-100 p-2">
                  {!user ? (
                    <Link
                      className="block rounded-md bg-[#0D9488] px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-teal-700"
                      to="/Login"
                      onClick={() => setUserOpen(false)}
                    >
                      Login
                    </Link>
                  ) : (
                    <button
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                      onClick={() => {
                        localStorage.removeItem("user");
                        window.location.href = "/Login";
                      }}
                    >
                      <LogOut size={17} />
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
