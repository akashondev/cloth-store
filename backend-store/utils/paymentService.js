import { deliveryDeadline } from "./orderDelivery.js";

export async function confirmPaidOrder({ session, order, updateOrder, now = new Date() }) {
  if (session.payment_status !== "paid") throw new Error("Stripe session is not paid");
  if (String(session.currency).toLowerCase() !== "inr") throw new Error("Stripe currency mismatch");
  if (Number(session.amount_total) !== Number(order.total) * 100) throw new Error("Stripe amount mismatch");
  if (["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)) return order;

  const data = { status: "PAID", paidAt: now, deliverAt: deliveryDeadline(order.placedAt) };
  return updateOrder(data);
}
