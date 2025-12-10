import React from "react";
import { ShoppingCart, X } from "lucide-react";

const LoginPopup = ({
  isOpen,
  onClose,
  message = "Please login to proceed",
}) => {
  if (!isOpen) return null;

  const handleLoginClick = () => {
    window.location.href = "/Login";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={handleLoginClick}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors mb-3"
          >
            Login Now
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
