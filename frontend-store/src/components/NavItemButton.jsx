import React from "react";

export default function NavItemButton({ item, active, onClick }) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all ${
        active
          ? "bg-[#0D9488] text-white shadow-lg shadow-teal-900/20"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold">{item.label}</span>
    </button>
  );
}
