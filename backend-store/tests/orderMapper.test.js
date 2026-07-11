import test from "node:test";
import assert from "node:assert/strict";

import { buildCheckoutOrder, toStripeLineItems } from "../utils/orderMapper.js";

const products = [
  { id: "1", title: "Shirt", price: 1000, image: "shirt.jpg" },
  { id: "2", title: "Trousers", price: 500, image: "trousers.jpg" },
];
const cart = [{ id: "1", qty: 2 }, { id: "2", qty: 1 }];

test("buildCheckoutOrder calculates a server-authoritative quote", () => {
  const quote = buildCheckoutOrder({ cart, products, platformFee: 10 });
  assert.deepEqual(quote, {
    items: [
      { productId: "1", title: "Shirt", image: "shirt.jpg", quantity: 2, priceAtPurchase: 1000 },
      { productId: "2", title: "Trousers", image: "trousers.jpg", quantity: 1, priceAtPurchase: 500 },
    ],
    subtotal: 2500,
    discount: 0,
    platformFee: 10,
    couponCode: null,
    total: 2510,
  });
});

test("SAVE10 and FLAT50 are normalized and applied", () => {
  assert.equal(buildCheckoutOrder({ cart, products, couponCode: " save10 " }).discount, 250);
  assert.equal(buildCheckoutOrder({ cart, products, couponCode: "flat50" }).discount, 50);
});

test("invalid coupons and missing products are rejected", () => {
  assert.throws(() => buildCheckoutOrder({ cart, products, couponCode: "FAKE" }), /Invalid coupon/);
  assert.throws(() => buildCheckoutOrder({ cart: [{ id: "9" }], products }), /Product not found/);
});

test("Stripe line items equal the final quote in paise", () => {
  const quote = buildCheckoutOrder({ cart, products, couponCode: "SAVE10" });
  const lineItems = toStripeLineItems(quote);
  const paise = lineItems.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity, 0);
  assert.equal(paise, quote.total * 100);
  assert.equal(lineItems.some((item) => item.price_data.product_data.name === "Platform Fee"), true);
});
