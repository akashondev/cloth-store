import test from "node:test";
import assert from "node:assert/strict";
import { cancelOrder } from "../utils/orderCancellation.js";

const base = { id: "o1", userId: 7, status: "PROCESSING", paymentMethod: "COD" };

test("COD cancellation requires ownership and cancels without refund", async () => {
  await assert.rejects(() => cancelOrder({ order: base, userId: 8 }), /not found/i);
  const result = await cancelOrder({ order: base, userId: 7, now: new Date("2026-07-11T00:00:00Z") });
  assert.equal(result.data.status, "CANCELLED");
  assert.equal(result.refundId, null);
});

test("Stripe cancellation creates one refund and stores its id", async () => {
  let calls = 0;
  const result = await cancelOrder({
    order: { ...base, paymentMethod: "STRIPE", status: "PAID" }, userId: 7,
    refundStripe: async () => { calls += 1; return { id: "re_123" }; },
  });
  assert.equal(calls, 1);
  assert.equal(result.data.stripeRefundId, "re_123");
  assert.match(result.message, /refund has been initiated/i);
});

test("cancelled orders are idempotent and shipped orders are rejected", async () => {
  let calls = 0;
  const repeated = await cancelOrder({ order: { ...base, status: "CANCELLED", stripeRefundId: "re_old" }, userId: 7, refundStripe: async () => calls++ });
  assert.equal(calls, 0);
  assert.equal(repeated.alreadyCancelled, true);
  await assert.rejects(() => cancelOrder({ order: { ...base, status: "SHIPPED" }, userId: 7 }), /cannot be cancelled/i);
});
