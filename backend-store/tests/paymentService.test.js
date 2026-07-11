import test from "node:test";
import assert from "node:assert/strict";
import { confirmPaidOrder } from "../utils/paymentService.js";

const order = { id: "o1", status: "PENDING", total: 910, placedAt: new Date("2026-07-09T18:00:00Z") };
const session = { payment_status: "paid", amount_total: 91000, currency: "inr" };

test("confirmPaidOrder validates payment and sets a 48 hour deadline", async () => {
  let update;
  const now = new Date("2026-07-10T00:00:00Z");
  await confirmPaidOrder({ session, order, now, updateOrder: async (data) => (update = data) });
  assert.equal(update.status, "PAID");
  assert.equal(update.deliverAt.toISOString(), "2026-07-11T18:00:00.000Z");
});

test("confirmPaidOrder rejects unpaid and mismatched sessions", async () => {
  await assert.rejects(() => confirmPaidOrder({ session: { ...session, payment_status: "unpaid" }, order, updateOrder: async () => {} }), /not paid/);
  await assert.rejects(() => confirmPaidOrder({ session: { ...session, amount_total: 1 }, order, updateOrder: async () => {} }), /amount/);
});

test("confirmPaidOrder is idempotent for paid orders", async () => {
  let calls = 0;
  const result = await confirmPaidOrder({ session, order: { ...order, status: "PAID" }, updateOrder: async () => calls++ });
  assert.equal(calls, 0);
  assert.equal(result.status, "PAID");
});
