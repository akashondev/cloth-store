import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Package, ShieldCheck, ShoppingBag, User } from "lucide-react";

import LoginPopup from "../components/LoginPopup";
import { getStoredUser } from "../lib/storage";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { formatCurrency } from "../lib/utils";

export default function Account() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [address, setAddress] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      setShowPopup(true);
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => { setAccount(data); setAddress(data.address || ""); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-gray-600">Loading account...</div>;
  }

  if (!account) {
    return (
      <>
        <LoginPopup isOpen={showPopup} onClose={() => setShowPopup(false)} message="Please login to view your account" />
        <div className="min-h-screen grid place-items-center bg-gray-50">
          <Card className="max-w-md p-8 text-center">
            <User className="mx-auto mb-4 text-gray-400" size={44} />
            <CardTitle>Login required</CardTitle>
            <p className="mt-2 text-sm text-gray-600">Your profile and order history appear here after login.</p>
          </Card>
        </div>
      </>
    );
  }

  const orderCount = account.orders?.length || 0;
  const totalSpend = (account.orders || [])
    .filter((order) => ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status))
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const saveAddress = async () => {
    setSavingAddress(true);
    try {
      const res = await fetch(`http://localhost:5000/users/${account.id}/address`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save address");
      setAccount((current) => ({ ...current, address: data.address }));
      setAddress(data.address);
      window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Address saved", message: "Your delivery address is ready.", tone: "success" } }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Address not saved", message: error.message, tone: "error" } }));
    } finally { setSavingAddress(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0D9488]">Styllin account</p>
          <h1 className="mt-3 text-4xl font-bold">Hi, {account.name}</h1>
          <p className="mt-2 text-white/70">Your profile, order history, and delivery updates in one place.</p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        <Card>
          <CardHeader><CardTitle>Delivery Address</CardTitle><p className="text-sm text-gray-500">Used for future orders. Existing orders keep their original address.</p></CardHeader>
          <CardContent>
            <textarea value={address} onChange={(event) => setAddress(event.target.value)} rows={4} placeholder="Enter your complete delivery address" className="w-full rounded-lg border border-zinc-300 p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100" />
            <button type="button" onClick={saveAddress} disabled={savingAddress} className="mt-3 rounded-lg bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60">{savingAddress ? "Saving…" : "Save Address"}</button>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Mail, label: "Email", value: account.email },
            { icon: Package, label: "Orders", value: orderCount },
            { icon: ShoppingBag, label: "Total Spend", value: formatCurrency(totalSpend) },
          ].map((item) => (
            <motion.div key={item.label} whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
              <Card>
                <CardContent className="p-5">
                  <item.icon className="mb-4 text-[#0D9488]" />
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="mt-1 font-semibold text-gray-950 break-words">{item.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Card>
            <CardHeader>
              <CardTitle>Login Details</CardTitle>
              <p className="text-sm text-gray-500">Project-demo identity stored after email verification.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{account.name}</p>
                </div>
                <User className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm text-gray-500">Email status</p>
                  <Badge tone={account.verified ? "green" : "amber"}>{account.verified ? "Verified" : "Pending"}</Badge>
                </div>
                <ShieldCheck className="text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order Snapshot</CardTitle>
                <p className="text-sm text-gray-500">Latest active delivery and recent history.</p>
              </div>
              <Link
                to="/orders"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                All Orders
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {account.activeOrder ? (
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Active order</p>
                    <Badge tone="teal">{account.activeOrder.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{account.activeOrder.items.length} pieces arriving soon</p>
                  <p className="mt-3 text-xl font-bold">{formatCurrency(account.activeOrder.total)}</p>
                </div>
              ) : (
                <div className="rounded-lg border p-4 text-sm text-gray-600">No active delivery right now.</div>
              )}

              {(account.orderHistory || []).slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{order.items?.[0]?.title || "Styllin order"}</p>
                    <p className="text-xs text-gray-500">{order.items?.length || 0} pieces</p>
                  </div>
                  <div className="text-right">
                    <Badge tone="green">{order.status}</Badge>
                    <p className="mt-1 text-sm font-semibold">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
