import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import LoginPopup from "../components/LoginPopup";
import { Badge } from "../components/ui/badge";
import { getStoredUser } from "../lib/storage";
import CancelOrderDialog from "../components/CancelOrderDialog";
import { formatCurrency } from "../lib/utils";

const API = process.env.REACT_APP_API_URL;
const date = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";
const tones = {
  PENDING: "amber",
  PAID: "teal",
  PROCESSING: "teal",
  SHIPPED: "teal",
  DELIVERED: "green",
  CANCELLED: "red",
};

function OrderCard({ order, onCancel }) {
  const canCancel = ["PAID", "PROCESSING"].includes(order.status);
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
    >
      <header className="flex flex-col gap-3 border-b border-zinc-100 bg-zinc-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs text-zinc-500">
            ORDER {order.id.slice(0, 10).toUpperCase()}
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-950">
            Placed {date(order.placedAt)}
          </p>
        </div>
        <Badge tone={tones[order.status] || "gray"}>{order.status}</Badge>
      </header>

      <div className="p-5">
        <div className="mb-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex gap-3 rounded-lg bg-teal-50 p-3 text-teal-900">
            <Truck size={18} />
            <div>
              <p className="font-semibold">Delivery</p>
              <p className="text-teal-700">
                {order.status === "DELIVERED"
                  ? `Delivered ${date(order.deliveredAt)}`
                  : order.status === "CANCELLED"
                    ? "Order cancelled"
                    : `Due ${date(order.deliverAt)}`}
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg bg-zinc-100 p-3 text-zinc-800">
            <MapPin size={18} />
            <div>
              <p className="font-semibold">Ship to</p>
              <p className="text-zinc-600">
                {order.delivery?.line1 || "Delivery address unavailable"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {(order.items || [])
            .filter((item) => item.title !== "Platform Fee")
            .map((item, index) => (
              <div
                key={`${item.productId}-${index}`}
                className="flex items-center gap-4 rounded-lg border border-zinc-100 p-3"
              >
                <div className="h-16 w-16 overflow-hidden rounded-lg bg-zinc-100">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-zinc-950">
                    {item.title}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Qty {item.quantity || item.qty} ×{" "}
                    {formatCurrency(item.priceAtPurchase)}
                  </p>
                </div>
                <p className="font-semibold text-zinc-950">
                  {formatCurrency(
                    (item.quantity || item.qty) * item.priceAtPurchase,
                  )}
                </p>
              </div>
            ))}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-zinc-200 pt-4">
          <div className="text-xs text-zinc-500">
            <p className="font-semibold text-zinc-700">
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
            {order.couponCode && (
              <p className="text-emerald-700">
                Coupon {order.couponCode}: −{formatCurrency(order.discount)}
              </p>
            )}
            <p>Includes {formatCurrency(order.platformFee)} platform fee</p>
            {canCancel && (
              <button
                type="button"
                onClick={() => onCancel(order)}
                className="mt-3 rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
              >
                Cancel Order
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Charged total
            </p>
            <p className="text-2xl font-bold text-zinc-950">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Orders() {
  const user = getStoredUser();
  const userId = user?.id;
  const location = useLocation();
  const navigate = useNavigate();
  const confirmationStarted = useRef(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(user));
  const [toast, setToast] = useState(null);
  const [showPopup, setShowPopup] = useState(!user);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const cancelUserOrder = async (order) => {
    setCancelling(true);
    try {
      const res = await fetch(`${API}/users/orders/${order.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not cancel order");
      setOrders((current) => current.filter((item) => item.id !== order.id));
      setSelectedOrder(null);
      window.dispatchEvent(
        new CustomEvent("appToast", {
          detail: {
            title: "Order cancelled",
            message: data.message,
            tone: "success",
            duration: 5000,
          },
        }),
      );
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("appToast", {
          detail: {
            title: "Cancellation failed",
            message: error.message,
            tone: "error",
          },
        }),
      );
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      try {
        const sessionId = new URLSearchParams(location.search).get(
          "session_id",
        );
        if (sessionId && !confirmationStarted.current) {
          confirmationStarted.current = true;
          const confirm = await fetch(`${API}/payment/confirm-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const result = await confirm.json();
          if (!confirm.ok)
            throw new Error(result.error || "Payment confirmation failed");
          localStorage.removeItem("cart");
          localStorage.removeItem("cartSummary");
          window.dispatchEvent(new Event("cartUpdated"));
          setToast({
            type: "success",
            message: "Payment successful. Your order is now in your history.",
          });
          navigate("/orders", { replace: true });
        }
        const res = await fetch(`${API}/users/${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load orders");
        setOrders(data.orders || []);
      } catch (error) {
        setToast({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, location.search, navigate]);

  if (!user)
    return (
      <>
        <LoginPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          message="Please login to view your orders"
        />
        <div className="grid min-h-[65vh] place-items-center bg-zinc-50 text-center">
          <div>
            <ShoppingBag className="mx-auto text-zinc-300" size={56} />
            <h1 className="mt-4 text-2xl font-bold">Sign in to view orders</h1>
            <Link
              to="/Login"
              className="mt-5 inline-flex rounded-lg bg-[#0D9488] px-5 py-3 font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </>
    );

  return (
    <div className="min-h-screen bg-zinc-50">
      <CancelOrderDialog
        order={selectedOrder}
        loading={cancelling}
        onClose={() => setSelectedOrder(null)}
        onConfirm={() => cancelUserOrder(selectedOrder)}
      />
      {toast && (
        <div
          role="status"
          className={`fixed right-5 top-20 z-[60] flex max-w-sm items-start gap-3 rounded-lg border p-4 shadow-xl ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}
        >
          <CheckCircle2 size={20} />
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0D9488]">
            Styllin account
          </p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Orders & delivery
          </h1>
          <p className="mt-3 max-w-xl text-white/65">
            Track every selected piece from secure checkout to your door.
          </p>
        </div>
      </section>
      <main className="mx-auto max-w-6xl px-5 py-10">
        {loading ? (
          <div aria-label="Loading orders" className="space-y-5">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-72 animate-pulse rounded-lg border bg-white"
              />
            ))}
          </div>
        ) : orders.length ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={setSelectedOrder}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-white p-12 text-center">
            <Package className="mx-auto text-zinc-300" size={52} />
            <h2 className="mt-4 text-2xl font-bold">No orders yet</h2>
            <p className="mt-2 text-zinc-500">
              Your next Styllin order will appear here.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex rounded-lg bg-zinc-950 px-5 py-3 font-semibold text-white"
            >
              Explore the shop
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
