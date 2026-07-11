import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Send } from "lucide-react";

const links = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Blog", "/blog"],
  ["About", "/about"],
  ["Cart", "/cart"],
  ["Orders", "/orders"],
  ["My Account", "/account"],
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const subscribe = (event) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    window.dispatchEvent(
      new CustomEvent("appToast", {
        detail: valid
          ? {
              title: "You’re on the list",
              message: "Style notes and new arrivals are coming your way.",
              tone: "success",
            }
          : {
              title: "Enter a valid email",
              message: "Check the address and try again.",
              tone: "error",
            },
      }),
    );
    if (valid) setEmail("");
  };

  return (
    <footer className="bg-zinc-950 text-white">
      <section className="border-b border-white/10 bg-[#F0FDFA]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-9 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/70">
              The Styllin edit
            </p>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl text-black/80">
              Fresh arrivals, considered style.
            </h2>
            <p className="mt-2 text-sm text-black/75">
              Occasional updates with new pieces and practical wardrobe notes.
            </p>
          </div>
          <form
            onSubmit={subscribe}
            className="flex min-w-0 w-full max-w-md flex-col gap-2 sm:flex-row md:w-[28rem]"
          >
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="min-w-0 flex-1 rounded-lg border border-white/25 bg-white px-4 py-3 text-sm text-zinc-950 outline-none focus:ring-2 focus:ring-white/60"
            />
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-3 text-sm font-semibold hover:bg-black sm:w-auto">
              <Send size={16} />
              Subscribe
            </button>
          </form>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="min-w-0">
            <Link to="/" className="logo-font text-4xl font-bold">
              Styllin
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
              Modern wardrobe essentials selected for confident, uncomplicated
              everyday dressing.
            </p>
            <a
              href="mailto:hello@styllin.com"
              className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-teal-400"
            >
              <Mail size={16} />
              hello@styllin.com
            </a>
          </div>
          <nav className="min-w-0">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-teal-400">
              Explore
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {links.slice(0, 4).map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-zinc-400 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="min-w-0">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-teal-400">
              Your Styllin
            </h3>
            <ul className="mt-4 space-y-3">
              {links.slice(4).map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                  >
                    {label}
                    <ArrowRight
                      className="opacity-0 transition group-hover:opacity-100"
                      size={14}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Styllin. All rights reserved.</p>
          <p>Designed for modern wardrobes.</p>
        </div>
      </div>
    </footer>
  );
}
