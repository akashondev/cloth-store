import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import SectionHeader from "../components/SectionHeader";
import ProductCard from "../components/ProductCard";
import ProductFormModal from "../components/ProductFormModal";

import {
  Package,
  TrendingUp,
  Layers,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ShoppingCart,
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
  const [orders, setOrders] = useState([]);
  const [activeNav, setActiveNav] = useState("dashboard");


  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    categories: 0,
  });

  const [user, setUser] = useState(null);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/users/orders/active");
    const data = await res.json();
    setOrders(data);
  };
   useEffect(() => {
     if (activeNav === "orders") fetchOrders();
   }, [activeNav]);
  
  const markDelivered = async (userId) => {
    await fetch(`http://localhost:5000/users/${userId}/order-delivered`, {
      method: "POST",
    });
    fetchOrders(); // refresh list
  };



  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Products" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "orders", icon: FileText, label: "Orders" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);

      const totalRevenue = data.reduce(
        (sum, p) => sum + (parseFloat(p.price) || 0),
        0
      );

      const categories = [...new Set(data.map((p) => p.category))].length;

      setStats({
        totalProducts: data.length,
        totalRevenue,
        categories,
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset form fields
  const resetForm = () =>
    setForm({
      title: "",
      price: "",
      category: "",
      description: "",
      image: "",
    });

  // Submit add/edit product
  const handleSubmit = () => {
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
    }).then((res) => {
      if (res.ok) {
        fetchProducts();
        resetForm();
        setEditingId(null);
        setShowForm(false);
      }
    });
  };

  // Edit product
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

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await fetch(`http://localhost:5000/products/product/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onLogout={() => (window.location.href = "/")}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <SectionHeader
          title={
            activeNav === "products"
              ? "Product Dashboard"
              : navItems.find((n) => n.id === activeNav)?.label
          }
          subtitle={
            activeNav === "products"
              ? "Manage your inventory"
              : `Manage your ${activeNav}`
          }
          showAdd={activeNav === "products"}
          onAddClick={() => setShowForm(true)}
        />

        <div className="p-8">
          {/* --------------- NON-PRODUCT TABS --------------- */}
          {/* {activeNav !== "products" && (
            <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
              <h2 className="text-2xl font-bold mb-3">
                {navItems.find((n) => n.id === activeNav)?.label}
              </h2>

              {user && (
                <div className="max-w-md mx-auto bg-[#393D7E] p-6 rounded-xl text-left shadow-lg mb-6">
                  <p className="text-white text-xl font-bold">{user.name}</p>
                  <p className="text-white text-opacity-80">
                    User ID: {user.id}
                  </p>
                </div>
              )}

              <p className="text-gray-500">
                This section is coming soon. Switch to Products to manage your
                inventory.
              </p>
            </div>
          )} */}
          {activeNav === "orders" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-4">Active Orders</h2>

              {orders.length === 0 ? (
                <p className="text-gray-500">No active orders.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((user) => (
                    <div key={user._id} className="border rounded-lg p-4">
                      <p className="font-semibold">
                        {user.name} ({user.email})
                      </p>
                      <p>Total: ₹{user.activeOrder.total}</p>

                      <div className="mt-3 space-y-2">
                        {user.activeOrder.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 border p-3 rounded"
                          >
                            <img
                              src={item.image}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.qty} • ₹{item.priceAtPurchase}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => markDelivered(user._id)}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --------------- PRODUCT PAGE ONLY --------------- */}
          {activeNav === "products" && (
            <>
              {/* Stats (no StatCard component) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 shadow-sm rounded-lg border">
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>

                <div className="bg-white p-5 shadow-sm rounded-lg border">
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-2xl font-bold">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white p-5 shadow-sm rounded-lg border">
                  <p className="text-sm text-gray-500">Categories</p>
                  <p className="text-2xl font-bold">{stats.categories}</p>
                </div>
              </div>

              {/* Product Grid */}
              <div className="bg-white shadow-sm rounded-xl border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">All Products</h2>
                  <p className="text-sm text-gray-500">
                    {products.length} total items
                  </p>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart
                      size={48}
                      className="text-gray-300 mx-auto mb-3"
                    />
                    <p className="text-gray-500">No products yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                    {products.map((p) => (
                      <ProductCard
                        key={p._id}
                        product={p}
                        onEdit={() => handleEdit(p)}
                        onDelete={() => handleDelete(p._id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <ProductFormModal
        visible={showForm}
        form={form}
        editingId={editingId}
        onChange={setForm}
        onSubmit={handleSubmit}
        onCancel={() => {
          resetForm();
          setEditingId(null);
          setShowForm(false);
        }}
      />
    </div>
  );
}
