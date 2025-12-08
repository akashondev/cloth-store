import React, { useEffect, useState } from "react";
import {
  Package,
  CheckCircle,
  Truck,
  ShoppingCart,
  MapPin,
} from "lucide-react";

export default function Order() {
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      fetchUserOrders(userData.id);
    }
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/users/${userId}`);
      const data = await res.json();

      setActiveOrder(data.activeOrder);
      setOrderHistory(data.orderHistory || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track your deliveries and view order history
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* ACTIVE ORDER - Only display if exists */}
        {activeOrder && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Truck size={28} />
                <h2 className="text-2xl font-bold">Active Order</h2>
              </div>
              <p className="text-blue-100">Order is on its way to you</p>
            </div>

            <div className="p-8">
              {/* Delivery Info (No Date) */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Delivery Address
                    </p>
                    <p className="text-sm text-gray-600">
                      Your package will be delivered soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Order Items
                </h3>

                <div className="space-y-3">
                  {activeOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.qty} × ₹
                          {item.priceAtPurchase.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₹{(item.qty * item.priceAtPurchase).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
                <span className="text-xl font-semibold text-gray-700">
                  Order Total
                </span>
                <span className="text-3xl font-bold text-gray-900">
                  ₹{activeOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ORDER HISTORY - Only display if exists */}
        {orderHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order History
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {orderHistory.length} completed orders
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  All Delivered
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {orderHistory.map((order, orderIndex) => (
                  <div
                    key={orderIndex}
                    className="border-2 border-gray-100 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={20} />
                      </div>
                      <span className="font-semibold text-green-600">
                        Delivered
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.qty} × ₹
                              {item.priceAtPurchase.toLocaleString()}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ₹
                            {(item.qty * item.priceAtPurchase).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-semibold text-gray-700">
                        Order Total
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        ₹{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
