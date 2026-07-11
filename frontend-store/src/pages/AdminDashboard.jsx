import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Package,
  Search,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import SectionHeader from "../components/SectionHeader";
import ProductFormModal from "../components/ProductFormModal";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { formatCurrency } from "../lib/utils";
import { Table, Td, Th } from "../components/ui/table";

const API = "http://localhost:5000";

const statusTone = {
  PENDING: "amber",
  PAID: "teal",
  PROCESSING: "teal",
  SHIPPED: "amber",
  DELIVERED: "green",
  CANCELLED: "red",
};


function StatCard({ icon: Icon, label, value, caption }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
      <Card className="overflow-hidden border-zinc-200/80 bg-white/95 shadow-lg shadow-zinc-900/5">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p>
              {caption && <p className="mt-1 text-xs text-zinc-500">{caption}</p>}
            </div>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-teal-50 text-[#0D9488] ring-1 ring-teal-100">
              <Icon size={22} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Products" },
    { id: "orders", icon: FileText, label: "Orders" },
    { id: "customers", icon: Users, label: "Customers" },
  ];

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API}/users/orders/all`);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  const fetchCustomers = async () => {
    const res = await fetch(`${API}/users/customers/list`);
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, []);

  const stats = useMemo(() => {
    const paidOrders = orders.filter((order) => ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status));
    return {
      products: products.length,
      orders: orders.length,
      customers: customers.length,
      revenue: paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    };
  }, [products, orders, customers]);

  const filteredProducts = products.filter((product) => {
    const text = `${product.title} ${product.category}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const resetForm = () => {
    setForm({ title: "", price: "", category: "", description: "", image: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const payload = { ...form, price: Number(form.price), images: [form.image].filter(Boolean) };
    const url = editingId ? `${API}/products/${editingId}` : `${API}/products`;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchProducts();
      resetForm();
      setShowForm(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title || "",
      price: product.price || "",
      category: product.category || "",
      description: product.description || "",
      image: product.images?.[0] || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Styllin product?")) return;
    await fetch(`${API}/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const markDelivered = async (orderId) => {
    try {
      const res = await fetch(`${API}/users/orders/${orderId}/delivered`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not mark order delivered");
      window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Order delivered", message: `Order ${orderId.slice(0, 8)} was updated.`, tone: "success" } }));
      fetchOrders();
      fetchCustomers();
    } catch (error) {
      window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Delivery update failed", message: error.message, tone: "error" } }));
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f4f4f5_42%,#ffffff_100%)]">
      <Sidebar navItems={navItems} activeNav={activeNav} onNavChange={setActiveNav} onHome={() => (window.location.href = "/")} />

      <main className="pt-24 lg:ml-72 lg:pt-0">
        <SectionHeader
          title={activeNav === "dashboard" ? "Styllin Studio" : navItems.find((item) => item.id === activeNav)?.label}
          subtitle={activeNav === "dashboard" ? "Orders, product drops, and customer activity" : `Manage Styllin ${activeNav}`}
          showAdd={activeNav === "products"}
          onAddClick={() => setShowForm(true)}
        />

        <div className="space-y-6 px-5 py-6 lg:px-8 lg:py-8">
          {activeNav === "dashboard" && (
            <>
              <div className="overflow-hidden rounded-lg bg-black px-6 py-7 text-white shadow-2xl shadow-zinc-900/15">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">Store command center</p>
                    <h2 className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl">Premium operations for catalog, orders, and customers.</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">Keep the Styllin storefront current while tracking checkout and delivery activity from one focused workspace.</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/50">Total revenue</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={TrendingUp} label="Revenue" value={formatCurrency(stats.revenue)} caption="Paid and delivered orders" />
                <StatCard icon={Package} label="Products" value={stats.products} caption="Live catalog pieces" />
                <StatCard icon={Truck} label="Orders" value={stats.orders} caption="All checkout records" />
                <StatCard icon={Users} label="Customers" value={stats.customers} caption="Registered shoppers" />
              </div>

              <Card className="shadow-lg shadow-zinc-900/5">
                <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <p className="text-sm text-zinc-500">Latest Styllin checkouts and delivery state</p>
                  </div>
                  <Button variant="outline" onClick={() => setActiveNav("orders")}>View orders</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <thead><tr><Th>Customer</Th><Th>Status</Th><Th>Items</Th><Th>Total</Th></tr></thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <Td>{order.user?.name || order.delivery?.name || "Guest"}</Td>
                            <Td><Badge tone={statusTone[order.status] || "gray"}>{order.status}</Badge></Td>
                            <Td>{order.items?.length || 0} pieces</Td>
                            <Td className="font-semibold">{formatCurrency(order.total)}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeNav === "products" && (
            <Card className="shadow-lg shadow-zinc-900/5">
              <CardHeader className="gap-4 md:flex md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Product Catalog</CardTitle>
                  <p className="text-sm text-zinc-500">Fashion pieces shown across the shop and checkout.</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input className="pl-9" placeholder="Search title or category" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} whileHover={{ y: -3 }} transition={{ duration: 0.18 }} className="rounded-lg border bg-white overflow-hidden">
                      <div className="aspect-[4/5] bg-zinc-100 overflow-hidden">
                        <img src={product.images?.[0]} alt={product.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-zinc-950 line-clamp-1">{product.title}</h3>
                            <p className="text-sm text-zinc-500 line-clamp-1">{product.category}</p>
                          </div>
                          <Badge tone="teal">{formatCurrency(product.price)}</Badge>
                        </div>
                        <p className="text-sm text-zinc-600 line-clamp-2 min-h-10">{product.description}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" onClick={() => handleEdit(product)}>Edit</Button>
                          <Button variant="danger" className="flex-1" onClick={() => handleDelete(product.id)}>Delete</Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeNav === "orders" && (
            <Card className="shadow-lg shadow-zinc-900/5">
              <CardHeader>
                <CardTitle>Order Desk</CardTitle>
                <p className="text-sm text-zinc-500">Track paid pieces from checkout to delivery.</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <thead><tr><Th>Order</Th><Th>Customer</Th><Th>Status</Th><Th>Items</Th><Th>Total</Th><Th></Th></tr></thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <Td className="font-mono text-xs">{order.id.slice(0, 8)}</Td>
                          <Td>{order.user?.name || order.delivery?.name || "Customer"}<div className="text-xs text-zinc-500">{order.user?.email || order.delivery?.email}</div></Td>
                          <Td><Badge tone={statusTone[order.status] || "gray"}>{order.status}</Badge></Td>
                          <Td>{order.items?.map((item) => `${item.title} x${item.qty || item.quantity}`).join(", ")}</Td>
                          <Td className="font-semibold">{formatCurrency(order.total)}</Td>
                          <Td className="text-right">
                            {!["DELIVERED", "CANCELLED"].includes(order.status) && (
                              <Button size="sm" onClick={() => markDelivered(order.id)}><CheckCircle2 size={16} />Delivered</Button>
                            )}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeNav === "customers" && (
            <Card className="shadow-lg shadow-zinc-900/5">
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <p className="text-sm text-zinc-500">Registered Styllin shoppers and their order activity.</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <thead><tr><Th>Name</Th><Th>Email</Th><Th>Verified</Th><Th>Orders</Th><Th>Total Spend</Th></tr></thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id}>
                          <Td className="font-medium">{customer.name}</Td>
                          <Td>{customer.email}</Td>
                          <Td><Badge tone={customer.verified ? "green" : "amber"}>{customer.verified ? "Verified" : "Pending"}</Badge></Td>
                          <Td>{customer.orderCount}</Td>
                          <Td className="font-semibold">{formatCurrency(customer.totalSpend)}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      <ProductFormModal
        visible={showForm}
        form={form}
        editingId={editingId}
        onChange={setForm}
        onSubmit={handleSubmit}
        onCancel={() => {
          resetForm();
          setShowForm(false);
        }}
      />
    </div>
  );
}
