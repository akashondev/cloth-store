// src/pages/CancelPage.jsx
import { Link } from "react-router-dom";

function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-red-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. You can try again anytime.
        </p>

        <Link
          to="/cart"
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Return to Cart
        </Link>
      </div>
    </div>
  );
}

export default CancelPage;
