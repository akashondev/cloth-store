import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {product.title}
        </h3>
        <p className="text-xl font-bold text-blue-600 mb-1">
          ₹{parseFloat(product.price).toLocaleString()}
        </p>

        <p className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 inline-block mb-3">
          {product.category}
        </p>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium"
          >
            <Edit2 size={14} />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
