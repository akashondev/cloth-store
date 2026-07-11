const COUPONS = Object.freeze({
  SAVE10: (subtotal) => Math.round(subtotal * 0.1),
  FLAT50: () => 50,
});

export function buildCheckoutOrder({ cart, products, couponCode, platformFee = 10 }) {
  if (!Array.isArray(cart) || cart.length === 0) throw new Error("Cart is empty");

  const productsById = new Map(products.map((product) => [String(product.id), product]));
  const items = cart.map((cartItem) => {
    const productId = String(cartItem.id || cartItem.productId);
    const product = productsById.get(productId);
    if (!product) throw new Error(`Product not found: ${productId}`);

    return {
      productId,
      title: product.title,
      image: product.images?.[0] || product.image || "",
      quantity: Math.max(1, Math.floor(Number(cartItem.qty || cartItem.quantity || 1))),
      priceAtPurchase: Math.round(Number(product.price)),
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.priceAtPurchase, 0);
  const normalizedCoupon = String(couponCode || "").trim().toUpperCase() || null;
  if (normalizedCoupon && !COUPONS[normalizedCoupon]) throw new Error("Invalid coupon code");
  const discount = normalizedCoupon
    ? Math.min(subtotal, COUPONS[normalizedCoupon](subtotal))
    : 0;
  const normalizedFee = Math.max(0, Math.round(Number(platformFee)));

  return {
    items,
    subtotal,
    discount,
    platformFee: normalizedFee,
    couponCode: normalizedCoupon,
    total: subtotal - discount + normalizedFee,
  };
}

export function toStripeLineItems(snapshot) {
  const merchandiseTotal = snapshot.subtotal - snapshot.discount;
  const items = [];
  if (merchandiseTotal > 0) {
    items.push({
      price_data: {
        currency: "inr",
        product_data: { name: `Styllin merchandise (${snapshot.items.length} items)` },
        unit_amount: merchandiseTotal * 100,
      },
      quantity: 1,
    });
  }
  if (snapshot.platformFee > 0) {
    items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Platform Fee" },
        unit_amount: snapshot.platformFee * 100,
      },
      quantity: 1,
    });
  }
  return items;
}
