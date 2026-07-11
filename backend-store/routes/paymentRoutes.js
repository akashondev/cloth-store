import express from "express";
import Stripe from "stripe";
import { buildCheckoutOrder, toStripeLineItems } from "../utils/orderMapper.js";
import { confirmPaidOrder } from "../utils/paymentService.js";
import { prisma } from "../utils/prisma.js";
import { deliveryDeadline } from "../utils/orderDelivery.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env["STRIPE_SECRET_KEY "]);
const clientUrl = () => process.env.CLIENT_URL || process.env["CLIENT_URL "] || "http://localhost:3001";

async function createQuote(cart, couponCode) {
  if (!Array.isArray(cart) || cart.length === 0) throw new Error("Cart is required");
  const productIds = [...new Set(cart.map((item) => Number(item.id || item.productId)))];
  if (productIds.some((id) => !Number.isInteger(id))) throw new Error("Invalid product ID");
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  return buildCheckoutOrder({ cart, products, couponCode, platformFee: 10 });
}

router.post("/quote", async (req, res) => {
  try { res.json(await createQuote(req.body.cart, req.body.couponCode)); }
  catch (error) { res.status(400).json({ error: error.message }); }
});

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, cart, couponCode } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.verified) return res.status(403).json({ error: "Verify your email before checkout" });
    if (!user.address?.trim()) return res.status(400).json({ error: "Add a delivery address before checkout" });
    const snapshot = await createQuote(cart, couponCode);
    const order = await prisma.order.create({ data: {
      userId: Number(userId), subtotal: snapshot.subtotal, discount: snapshot.discount,
      platformFee: snapshot.platformFee, couponCode: snapshot.couponCode, total: snapshot.total,
      deliveryName: user.name, deliveryEmail: user.email, deliveryLine1: user.address.trim(),
      items: { create: snapshot.items.map((item) => ({ productId: Number(item.productId), title: item.title, image: item.image, quantity: item.quantity, priceAtPurchase: item.priceAtPurchase })) },
    }});
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], customer_email: user.email,
      line_items: toStripeLineItems(snapshot), mode: "payment",
      metadata: { orderId: order.id, userId: String(userId) },
      success_url: `${clientUrl()}/orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl()}/cart?payment=cancelled`,
    });
    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
    res.json({ url: session.url, orderId: order.id, quote: snapshot });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

router.post("/create-cod-order", async (req, res) => {
  try {
    const { userId, cart, couponCode } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.verified) return res.status(403).json({ error: "Verify your email before checkout" });
    if (!user.address?.trim()) return res.status(400).json({ error: "Add a delivery address before checkout" });
    const snapshot = await createQuote(cart, couponCode);
    const placedAt = new Date();
    const order = await prisma.order.create({
      data: {
        userId: Number(userId), status: "PROCESSING", paymentMethod: "COD",
        subtotal: snapshot.subtotal, discount: snapshot.discount, platformFee: snapshot.platformFee,
        couponCode: snapshot.couponCode, total: snapshot.total, placedAt,
        deliverAt: deliveryDeadline(placedAt), deliveryName: user.name,
        deliveryEmail: user.email, deliveryLine1: user.address.trim(),
        items: { create: snapshot.items.map((item) => ({ productId: Number(item.productId), title: item.title, image: item.image, quantity: item.quantity, priceAtPurchase: item.priceAtPurchase })) },
      },
      include: { items: true },
    });
    res.status(201).json({ order, message: "Cash on Delivery order placed successfully." });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

async function confirmSession(session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) throw new Error("Missing order metadata");
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new Error("Order not found");
  return confirmPaidOrder({ session, order, updateOrder: (data) => prisma.order.update({ where: { id: order.id }, data, include: { items: true } }) });
}

router.post("/confirm-session", async (req, res) => {
  try {
    if (!req.body.sessionId) return res.status(400).json({ error: "sessionId is required" });
    res.json(await confirmSession(await stripe.checkout.sessions.retrieve(req.body.sessionId)));
  } catch (error) { res.status(400).json({ error: error.message }); }
});

export async function webhookHandler(req, res) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return res.status(503).json({ error: "Stripe webhook is not configured" });
    const event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], secret);
    if (event.type === "checkout.session.completed") await confirmSession(event.data.object);
    res.json({ received: true });
  } catch (error) { res.status(400).json({ error: error.message }); }
}

export default router;
