import React from "react";
import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  X,
  TrendingUp,
  ShoppingCart,
  Layers,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeNav, setActiveNav] = useState("products");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    categories: 0,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products/product");
      const data = await res.json();
      setProducts(data);

      const totalRevenue = data.reduce(
        (sum, p) => sum + (parseFloat(p.price) || 0),
        0
      );
      const categories = [...new Set(data.map((p) => p.category))].length;
      setStats({
        totalProducts: data.length,
        totalRevenue: totalRevenue,
        categories: categories,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/products/product/${editingId}`
      : "http://localhost:5000/products/addproduct";

    const payload = editingId
      ? { ...form, images: [form.image] }
      : [{ ...form, images: [form.image] }];

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          fetchProducts();
          setForm({
            title: "",
            price: "",
            category: "",
            description: "",
            image: "",
          });
          setEditingId(null);
          setShowForm(false);
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`http://localhost:5000/products/product/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      price: p.price,
      category: p.category,
      description: p.description,
      image: p.images?.[0] || "",
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({
      title: "",
      price: "",
      category: "",
      description: "",
      image: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Add your logout logic here
      window.location.href = "/";
    }
  };

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Products" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "orders", icon: FileText, label: "Orders" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeNav === item.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeNav === "products"
                    ? "Product Dashboard"
                    : navItems.find((n) => n.id === activeNav)?.label}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {activeNav === "products"
                    ? "Manage your inventory"
                    : `Manage your ${activeNav}`}
                </p>
              </div>
              {activeNav === "products" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
                >
                  <Plus size={18} />
                  Add Product
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeNav === "products" ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Total Products
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalProducts}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Package className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{stats.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Categories</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.categories}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <Layers className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Products
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {products.length} total items
                  </p>
                </div>

                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <ShoppingCart size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-center">
                      No products yet. Add your first product to get started!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                    {products.map((p) => (
                      <div
                        key={p._id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={p.images?.[0]}
                            alt={p.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">
                            {p.title}
                          </h3>
                          <p className="text-xl font-bold text-blue-600 mb-1">
                            ₹{parseFloat(p.price).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 inline-block mb-3">
                            {p.category}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                            {p.description}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition-colors"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.createElement(
                    navItems.find((n) => n.id === activeNav)?.icon || Package,
                    {
                      size: 40,
                      className: "text-gray-400",
                    }
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {navItems.find((n) => n.id === activeNav)?.label}
                </h3>
                <p className="text-gray-500">
                  This section is coming soon. Switch to Products to manage your
                  inventory.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Electronics"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter product description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-24 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  {editingId ? "Update Product" : "Add Product"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
