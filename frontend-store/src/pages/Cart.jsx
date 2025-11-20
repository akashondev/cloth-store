import React, { useEffect, useState } from "react";


// LocalStorage Cart Helpers
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  // Increase quantity
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    setCart(updated);
    saveCart(updated);
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
      .filter((i) => i.qty > 0);
    setCart(updated);
    saveCart(updated);
  };

  // Remove item
  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    saveCart(updated);
  };

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

          {cart.length === 0 ? (
            <p className="text-gray-600">Cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-gray-700">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
}

export default CartPage;
