import React from "react";
import { Plus } from "lucide-react";

export default function SectionHeader({
  title,
  subtitle,
  showAdd,
  onAddClick,
}) {
  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>

          {showAdd && (
            <button
              onClick={onAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Plus size={18} />
              Add Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
