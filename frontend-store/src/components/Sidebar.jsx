import React from "react";
import NavItemButton from "./NavItemButton";
import { Package, LogOut } from "lucide-react";

export default function Sidebar({
  navItems,
  activeNav,
  onNavChange,
  onLogout,
}) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
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

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
