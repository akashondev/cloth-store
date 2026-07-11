import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoginPopup from "../components/LoginPopup";
import { getStoredUser } from "../lib/storage";
import { createCheckoutSession, createCodOrder } from "../lib/checkout";
import { formatCurrency } from "../lib/utils";
import {
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setCart(loadCart());
    const user = getStoredUser();
    if (user?.id) {
      fetch(`http://localhost:5000/users/${user.id}`).then((res) => res.json()).then((data) => {
        setAddress(data.address || "");
        setAddressSaved(Boolean(data.address?.trim()));
      }).catch(() => setAddressSaved(false));
    }
  }, []);

  useEffect(() => {
    const payment = new URLSearchParams(location.search).get("payment");
    if (!payment) return;
    window.dispatchEvent(new CustomEvent("appToast", {
      detail: payment === "cancelled"
        ? { title: "Payment cancelled", message: "Your cart is still saved.", tone: "info" }
        : { title: "Checkout could not start", message: "Please try again.", tone: "error" },
    }));
    navigate("/cart", { replace: true });
  }, [location.search, navigate]);

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item,
    );
    setCart(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const decreaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item,
    );
    setCart(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const requestQuote = async (items, code = null) => {
    if (!items.length) {
      setQuote(null);
      return null;
    }
    setQuoteLoading(true);
    setCouponError("");
    try {
      const res = await fetch("http://localhost:5000/payment/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: items.map((item) => ({ id: item.id, qty: item.qty })),
          couponCode: code,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not calculate total");
      setQuote(data);
      return data;
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    requestQuote(cart, appliedCoupon?.code).catch((error) => setCouponError(error.message));
  }, [cart, appliedCoupon?.code]);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    try {
      await requestQuote(cart, code);
      setAppliedCoupon({ code });
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(error.message);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const subtotal = quote?.subtotal || 0;
  const platformFee = quote?.platformFee || 10;
  const discount = quote?.discount || 0;
  const total = quote?.total || 0;

  useEffect(() => {
    localStorage.setItem(
      "cartSummary",
      JSON.stringify({ cart, couponCode: appliedCoupon?.code || null, quote }),
    );
  }, [cart, quote, appliedCoupon]);

  const handleProceedToPayment = async () => {
    if (checkoutLoading) return;
    const user = getStoredUser();

    if (!user) {
      setShowPopup(true);
      return;
    }
    if (!addressSaved) {
      window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Delivery address required", message: "Save your address before payment.", tone: "error" } }));
      return;
    }

    setCheckoutLoading(true);
    try {
      if (paymentMethod === "COD") {
        window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Placing your order…", message: "Cash on Delivery selected.", tone: "info", duration: 10000 } }));
        const result = await createCodOrder({ userId: user.id, cart, couponCode: appliedCoupon?.code || null });
        localStorage.removeItem("cart"); localStorage.removeItem("cartSummary");
        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Order placed", message: result.message, tone: "success" } }));
        navigate("/orders");
      } else {
        window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Opening secure checkout…", message: "Please wait while Stripe gets ready.", tone: "info", duration: 10000 } }));
        const url = await createCheckoutSession({ userId: user.id, cart, couponCode: appliedCoupon?.code || null });
        window.location.assign(url);
      }
    } catch (error) {
      setCheckoutLoading(false);
      window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Checkout could not start", message: error.message, tone: "error" } }));
    }
  };

  const saveAddress = async () => {
    const user = getStoredUser();
    if (!user) { setShowPopup(true); return; }
    setSavingAddress(true);
    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}/address`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save address");
      setAddress(data.address); setAddressSaved(true);
      window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Address confirmed", message: data.address, tone: "success" } }));
    } catch (error) {
      setAddressSaved(false);
      window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Address not saved", message: error.message, tone: "error" } }));
    } finally { setSavingAddress(false); }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0D9488]">
            Styllin checkout
          </p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Shopping Cart</h1>
              <p className="mt-2 text-sm text-white/65">
                Review your selected pieces before secure Stripe checkout.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-white/75">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2">
                <ShieldCheck size={15} /> Secure payment
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2">
                <Truck size={15} /> Fast delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <LoginPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          message="Please login to proceed with your purchase"
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-zinc-950">
                  Your cart is empty
                </h2>
                <p className="mt-2 text-gray-500">
                  Add a few Styllin pieces and they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.16 }}
                    className="grid gap-4 rounded-lg border border-zinc-200 p-4 transition-shadow hover:shadow-md sm:grid-cols-[92px_1fr_auto_auto]"
                  >
                    <div className="h-24 w-24 overflow-hidden rounded-lg bg-zinc-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-semibold text-lg text-zinc-900 line-clamp-2">
                        {item.title}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Styllin selected piece
                      </p>
                      <p className="text-gray-900 font-bold mt-2">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex h-11 items-center gap-2 rounded-lg bg-zinc-100 p-1 self-center">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="p-2 hover:bg-white rounded-md transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="p-2 hover:bg-white rounded-md transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="h-11 w-11 self-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5 mx-auto" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 sticky top-8 h-fit">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Delivery Address</label>
              <textarea value={address} onChange={(event) => { setAddress(event.target.value); setAddressSaved(false); }} rows={3} placeholder="Enter your complete delivery address" className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100" />
              <button type="button" onClick={saveAddress} disabled={savingAddress} className="mt-2 rounded-lg border border-[#0D9488] px-4 py-2 text-sm font-semibold text-[#0D9488] hover:bg-teal-50 disabled:opacity-60">{addressSaved ? "Address Confirmed" : savingAddress ? "Saving…" : "Save Address"}</button>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0D9488]">
                Summary
              </p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Order Summary
              </h2>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Coupon Code
              </label>
              <div className="text-xs text-gray-500 mb-2">
                Try: <span className="font-semibold text-gray-700">SAVE10</span>{" "}
                or <span className="font-semibold text-gray-700">FLAT50</span>
              </div>

              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="min-w-0 flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-[#0D9488]"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-[#0D9488] text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <span className="text-green-700 font-medium">
                    {appliedCoupon.code} Applied
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>−{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Platform Fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-zinc-900">Payment Method</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className={`cursor-pointer rounded-lg border p-3 text-sm ${paymentMethod === "STRIPE" ? "border-[#0D9488] bg-teal-50 text-teal-900" : "border-zinc-200"}`}>
                  <input type="radio" name="paymentMethod" value="STRIPE" checked={paymentMethod === "STRIPE"} onChange={() => setPaymentMethod("STRIPE")} className="mr-2" />Online Payment
                </label>
                <label className={`cursor-pointer rounded-lg border p-3 text-sm ${paymentMethod === "COD" ? "border-[#0D9488] bg-teal-50 text-teal-900" : "border-zinc-200"}`}>
                  <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="mr-2" />Cash on Delivery
                </label>
              </div>
            </fieldset>

            <button
              onClick={handleProceedToPayment}
              disabled={cart.length === 0 || quoteLoading || !quote || checkoutLoading || (Boolean(getStoredUser()) && !addressSaved)}
              className={`w-full mt-6 bg-[#0D9488] text-white py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                cart.length === 0 || quoteLoading || !quote || checkoutLoading || (Boolean(getStoredUser()) && !addressSaved) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <CreditCard className="w-5 h-5" /> {checkoutLoading ? "Preparing order…" : paymentMethod === "COD" ? "Place COD Order" : "Proceed to Payment"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
