import test from "node:test";
import assert from "node:assert/strict";
import { deliveryDeadline, isDeliveryDue } from "../utils/orderDelivery.js";

test("delivery deadline is exactly 48 hours after payment", () => {
  const paidAt = new Date("2026-07-10T00:00:00Z");
  assert.equal(deliveryDeadline(paidAt).toISOString(), "2026-07-12T00:00:00.000Z");
  assert.equal(isDeliveryDue(deliveryDeadline(paidAt), new Date("2026-07-11T23:59:59Z")), false);
  assert.equal(isDeliveryDue(deliveryDeadline(paidAt), new Date("2026-07-12T00:00:00Z")), true);
});
