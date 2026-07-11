import React from "react";
import { X } from "lucide-react";
import FormField from "./FormField";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input, Textarea } from "./ui/input";

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
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#0D9488] font-bold">
              Styllin inventory
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
          </div>

          <button
            onClick={onCancel}
            className="h-10 w-10 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 grid place-items-center"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <FormField label="Product Title">
            <Input
              type="text"
              value={form.title}
              placeholder="Enter product title"
              onChange={(e) => onChange({ ...form, title: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price (₹)">
              <Input
                type="number"
                value={form.price}
                onChange={(e) => onChange({ ...form, price: e.target.value })}
              />
            </FormField>

            <FormField label="Category">
              <Input
                type="text"
                value={form.category}
                onChange={(e) =>
                  onChange({ ...form, category: e.target.value })
                }
              />
            </FormField>
          </div>

          <FormField label="Image URL">
            <Input
              type="text"
              value={form.image}
              onChange={(e) => onChange({ ...form, image: e.target.value })}
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={form.description}
              onChange={(e) =>
                onChange({ ...form, description: e.target.value })
              }
            />
          </FormField>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={onSubmit}
              className="flex-1"
            >
              {editingId ? "Update Product" : "Add Product"}
            </Button>

            <Button
              onClick={onCancel}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
