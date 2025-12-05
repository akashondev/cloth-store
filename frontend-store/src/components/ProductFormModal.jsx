import React from "react";
import { X } from "lucide-react";
import FormField from "./FormField";

export default function ProductFormModal({
  visible,
  form,
  editingId,
  onChange,
  onSubmit,
  onCancel,
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <FormField label="Product Title">
            <input
              type="text"
              value={form.title}
              placeholder="Enter product title"
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price (₹)">
              <input
                type="number"
                value={form.price}
                onChange={(e) => onChange({ ...form, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
            </FormField>

            <FormField label="Category">
              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  onChange({ ...form, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
            </FormField>
          </div>

          <FormField label="Image URL">
            <input
              type="text"
              value={form.image}
              onChange={(e) => onChange({ ...form, image: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) =>
                onChange({ ...form, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-24 resize-none"
            />
          </FormField>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onSubmit}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>

            <button
              onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
