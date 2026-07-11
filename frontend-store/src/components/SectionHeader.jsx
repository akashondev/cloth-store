import React from "react";
import { Plus } from "lucide-react";

export default function SectionHeader({
  title,
  subtitle,
  showAdd,
  onAddClick,
}) {
  return (
    <div className="sticky top-20 z-30 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur lg:top-0">
      <div className="px-5 py-4 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950">{title}</h1>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          </div>

          {showAdd && (
            <button
              onClick={onAddClick}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-4 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-[#0a7a6f]"
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
