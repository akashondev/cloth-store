export async function createCheckoutSession({ userId, cart, couponCode = null, fetchImpl = fetch }) {
  const res = await fetchImpl("http://localhost:5000/payment/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      cart: cart.map((item) => ({ id: item.id, qty: item.qty })),
      couponCode,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not start secure checkout");
  if (!data.url) throw new Error("Stripe checkout URL was not returned");
  return data.url;
}

export async function createCodOrder({ userId, cart, couponCode = null, fetchImpl = fetch }) {
  const res = await fetchImpl("http://localhost:5000/payment/create-cod-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, cart: cart.map((item) => ({ id: item.id, qty: item.qty })), couponCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not place Cash on Delivery order");
  return data;
}
