// src/pages/PaymentPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const loadCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  };

  const cart = loadCart();

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/");
      return;
    }

    const startPayment = async () => {
      try {
        const summary = JSON.parse(localStorage.getItem("cartSummary"));

        if (!summary || !summary.cart) {
          navigate("/");
          return;
        }

        const { cart, subtotal, discount } = summary;

        let products;

        if (discount > 0 && subtotal > 0) {
          // Apply proportional discount
          const discountRatio = (subtotal - discount) / subtotal;

          products = cart.map((item) => ({
            _id: item.id,
            title: item.title,
            price: Math.round(item.price * discountRatio),
            images: [item.image],
            qty: item.qty,
          }));
        } else {
          // No coupon → use original prices
          products = cart.map((item) => ({
            _id: item.id,
            title: item.title,
            price: item.price,
            images: [item.image],
            qty: item.qty,
          }));
        }

        const res = await axios.post(
          "http://localhost:5000/payment/create-chekout-session",
          { products }
        );

        window.location.href = res.data.url;
      } catch (error) {
        console.error(error);
        navigate("/cancel");
      }
    };

    startPayment();
  }, [cart, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
      Redirecting to secure Stripe checkout…
    </div>
  );
}

export default PaymentPage;
