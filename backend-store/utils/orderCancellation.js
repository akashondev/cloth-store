export async function cancelOrder({ order, userId, refundStripe, now = new Date() }) {
  if (!order || Number(order.userId) !== Number(userId)) throw new Error("Order not found");
  if (order.status === "CANCELLED") {
    return { alreadyCancelled: true, refundId: order.stripeRefundId || null, data: {}, message: order.paymentMethod === "STRIPE" ? "Your refund has already been initiated." : "Order is already cancelled." };
  }
  if (!["PAID", "PROCESSING"].includes(order.status)) throw new Error("This order cannot be cancelled now");

  let refundId = null;
  if (order.paymentMethod === "STRIPE") {
    if (!refundStripe) throw new Error("Stripe refund service is unavailable");
    const refund = await refundStripe(order);
    refundId = refund.id;
  }

  return {
    alreadyCancelled: false,
    refundId,
    data: { status: "CANCELLED", cancelledAt: now, ...(refundId ? { stripeRefundId: refundId } : {}) },
    message: order.paymentMethod === "STRIPE"
      ? "Order cancelled. Your refund has been initiated and will be transferred to your original payment method."
      : "Order cancelled successfully.",
  };
}
