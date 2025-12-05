import { useEffect } from "react";
import { Link } from "react-router-dom";

function SuccessPage() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;
    // console.log("Placing order for user:", user.id);

    const cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart || cart.length === 0) return;
    console.log("Cart contents:", cart);
 
    const payload = {
      items: cart.map((item) => ({
        productId: item?.id,
        qty: item.qty,
        priceAtPurchase: item.price, // must exist in cart
        title: item.title || item.name, // ✅ Sends title to backend
        image: item.image || item.img,
      })),
      
      total: cart.reduce((acc, item) => acc + item.price * item.qty, 0),
      eta: new Date(Date.now() + 45 * 60 * 1000), // 45 min
    };
    // console.log("cart items :", cart);
    console.log("Order payload:", payload);

    fetch(`http://localhost:5000/users/${user.id}/place-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => localStorage.removeItem("cart"))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-green-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Payment Successful
        </h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default SuccessPage;
