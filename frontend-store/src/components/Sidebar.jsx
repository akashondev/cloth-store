import React from "react";
import NavItemButton from "./NavItemButton";
import { ArrowLeft, Package } from "lucide-react";

export default function Sidebar({
  navItems,
  activeNav,
  onNavChange,
  onHome,
}) {
  return (
    <aside className="fixed inset-x-0 top-0 z-40 flex border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur lg:inset-y-0 lg:right-auto lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
      <button
        type="button"
        onClick={onHome}
        className="flex min-w-64 items-center gap-3 border-r border-zinc-200 px-5 py-4 text-left transition hover:bg-zinc-50 lg:min-w-0 lg:border-b lg:border-r-0 lg:px-6 lg:py-6"
        aria-label="Styllin home"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-black text-white shadow-lg shadow-zinc-900/15">
          <Package size={23} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-950">Styllin</h1>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0D9488]">
            Admin studio
          </p>
        </div>
      </button>

      <nav className="flex-1 overflow-x-auto p-3 lg:overflow-visible lg:p-4">
        <div className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col lg:space-y-1">
          {navItems.map((item) => (
            <NavItemButton
              key={item.id}
              item={item}
              active={activeNav === item.id}
              onClick={() => onNavChange(item.id)}
            />
          ))}
        </div>
      </nav>

      <div className="hidden border-t border-zinc-200 p-4 lg:block">
        <button
          type="button"
          onClick={onHome}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
        >
          <ArrowLeft size={18} />
          <span>Go Back to Home</span>
        </button>
      </div>
    </aside>
  );
}
