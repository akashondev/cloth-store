// src/pages/SuccessPage.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";

function SuccessPage() {
  useEffect(() => {
    localStorage.removeItem("cart");
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
