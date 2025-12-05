import React from "react";

export default function NavItemButton({ item, active, onClick }) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon size={20} />
      <span>{item.label}</span>
    </button>
  );
}
