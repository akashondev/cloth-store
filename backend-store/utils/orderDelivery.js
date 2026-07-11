const DELIVERY_MS = 48 * 60 * 60 * 1000;

export const deliveryDeadline = (paidAt) => new Date(new Date(paidAt).getTime() + DELIVERY_MS);
export const isDeliveryDue = (deliverAt, now = new Date()) => new Date(deliverAt).getTime() <= now.getTime();

export async function reconcileDueOrders(prisma, now = new Date()) {
  const result = await prisma.order.updateMany({
    where: {
      status: { in: ["PAID", "PROCESSING", "SHIPPED"] },
      deliverAt: { lte: now },
    },
    data: { status: "DELIVERED", deliveredAt: now },
  });
  return result.count;
}
