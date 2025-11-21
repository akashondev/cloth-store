import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  CreditCard,
} from "lucide-react";

// LocalStorage Cart Helpers
const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    // If cart is empty, add sample data for demo
    if (saved.length === 0) {
      return [
        { id: 1, title: "Classic Denim Jacket", price: 2499, qty: 1 },
        { id: 2, title: "Cotton T-Shirt", price: 799, qty: 2 },
        { id: 3, title: "Slim Fit Jeans", price: 1999, qty: 1 },
      ];
    }
    return saved;
  } catch {
    // Fallback sample data if localStorage fails
    return [
      { id: 1, title: "Classic Denim Jacket", price: 2499, qty: 1 },
      { id: 2, title: "Cotton T-Shirt", price: 799, qty: 2 },
      { id: 3, title: "Slim Fit Jeans", price: 1999, qty: 1 },
    ];
  }
};

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

function CartPage() {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    setCart(updated);
    saveCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
      .filter((i) => i.qty > 0);
    setCart(updated);
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    saveCart(updated);
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon({ code: "SAVE10", discount: 0.1 });
    } else if (couponCode.toUpperCase() === "FLAT50") {
      setAppliedCoupon({ code: "FLAT50", discount: 50, type: "flat" });
    } else {
      alert("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const platformFee = 10;
  const discount = appliedCoupon
    ? appliedCoupon.type === "flat"
      ? appliedCoupon.discount
      : subtotal * appliedCoupon.discount
    : 0;
  const total = subtotal + platformFee - discount;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Stylinn</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-lg">Shopping Cart</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h2 className="font-semibold text-lg text-gray-800">
                          {item.title}
                        </h2>
                        <p className="text-gray-900 font-medium mt-1">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="p-2 hover:bg-white rounded-md transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="p-2 hover:bg-white rounded-md transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Coupon Code
                </label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <span className="text-green-700 font-medium">
                      {appliedCoupon.code} Applied!
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Try: SAVE10 or FLAT50
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                disabled={cart.length === 0}
                className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure and encrypted checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
