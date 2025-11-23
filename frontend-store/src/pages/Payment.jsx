// src/pages/PaymentPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || {};

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/");
      return;
    }

    const startPayment = async () => {
      try {
        const products = cart.map((item) => ({
          _id: item.id,
          title: item.title,
          price: item.price,
          images: [item.image],
          qty: item.qty,
        }));

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
