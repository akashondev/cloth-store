import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    images: [""],
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products/product");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update form when editing product
  useEffect(() => {
    if (editingProduct) {
      setForm({
        title: editingProduct.title || "",
        price: editingProduct.price || "",
        category: editingProduct.category || "",
        description: editingProduct.description || "",
        images:
          editingProduct.images && editingProduct.images.length > 0
            ? editingProduct.images
            : [""],
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProduct) {
      // Update product
      try {
        const res = await fetch(
          `http://localhost:5000/products/product/${editingProduct._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              price: Number(form.price),
            }),
          }
        );
        if (!res.ok) throw new Error("Failed to update product");
        await fetchProducts();
        setEditingProduct(null);
      } catch (err) {
        console.error("Error updating product:", err);
        alert("Failed to update product");
      }
    } else {
      // Add product
      try {
        const res = await fetch("http://localhost:5000/products/addproduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
          }),
        });
        if (!res.ok) throw new Error("Failed to add product");
        await fetchProducts();
      } catch (err) {
        console.error("Error adding product:", err);
        alert("Failed to add product");
      }
    }

    // Reset form
    setForm({
      title: "",
      price: "",
      category: "",
      description: "",
      images: [""],
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setForm({
      title: "",
      price: "",
      category: "",
      description: "",
      images: [""],
    });
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/products/product/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 mb-6 space-y-4"
      >
        <h2 className="text-2xl font-semibold">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full rounded"
          required
        />

        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 w-full rounded"
          required
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2 w-full rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full rounded"
          rows="4"
          required
        />

        <div className="space-y-2">
          <label className="font-medium">Product Images</label>
          {form.images.map((img, i) => (
            <input
              key={i}
              value={img}
              onChange={(e) => handleImageChange(i, e.target.value)}
              placeholder={`Image URL ${i + 1}`}
              className="border p-2 w-full rounded"
              required
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addImageField}
          className="text-blue-500 underline hover:text-blue-700"
        >
          + Add Another Image
        </button>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ProductList
        products={products}
        onEdit={setEditingProduct}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default AdminPanel;
