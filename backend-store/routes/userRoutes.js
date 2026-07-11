import express from "express";
import jwt from "jsonwebtoken";
import { generateVerificationToken } from "../utils/generateToken.js";
import { VerifyEmail } from "../utils/VerifyEmail.js";
import { prisma } from "../utils/prisma.js";
import { reconcileDueOrders } from "../utils/orderDelivery.js";
import { validateEmailDomain } from "../utils/emailValidation.js";
import Stripe from "stripe";
import { cancelOrder } from "../utils/orderCancellation.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env["STRIPE_SECRET_KEY "]);

const ACTIVE_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED"];

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address || "",
    verified: Boolean(user.verified),
  };
}

function formatOrder(order) {
  if (!order) return null;

  return {
    id: order.id,
    status: order.status,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    discount: order.discount,
    platformFee: order.platformFee,
    couponCode: order.couponCode,
    total: order.total,
    eta: order.eta,
    deliverAt: order.deliverAt,
    placedAt: order.placedAt,
    paidAt: order.paidAt,
    deliveredAt: order.deliveredAt,
    cancelledAt: order.cancelledAt,
    stripeRefundId: order.stripeRefundId,
    delivery: {
      name: order.deliveryName,
      email: order.deliveryEmail,
      line1: order.deliveryLine1,
      line2: order.deliveryLine2,
      city: order.deliveryCity,
      state: order.deliveryState,
      postal: order.deliveryPostal,
      country: order.deliveryCountry,
    },
    items: (order.items || []).filter((item) => item.title !== "Platform Fee").map((item) => ({
      productId: item.productId,
      qty: item.quantity,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      title: item.title,
      image: item.image,
    })),
  };
}

/* REGISTER + SEND EMAIL VERIFICATION */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedName = String(name || "").trim();
    const normalizedPassword = String(password || "");

    if (!normalizedName) return res.status(400).json({ error: "Name is required" });
    if (!String(email || "").trim()) return res.status(400).json({ error: "Email is required" });
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(normalizedPassword)) {
      return res.status(400).json({
        error: "Password must be at least 6 characters and include letters and numbers only.",
      });
    }
    const { normalizedEmail } = await validateEmailDomain(email);

    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const token = generateVerificationToken(normalizedEmail);

    const emailSent = await VerifyEmail(normalizedEmail, token);
    if (!emailSent) {
      return res.status(502).json({ error: "We could not send a verification email. Check the address and try again." });
    }

    await prisma.user.create({
      data: {
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      verified: false,
      },
    });

    res.json({
      message: "Verification email sent. Check your inbox.",
      emailSent,
    });
  } catch (err) {
    if (/valid email|cannot receive email/.test(err.message)) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Could not create your account. Please try again." });
  }
});

/* VERIFY EMAIL */
router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    if (decoded.purpose !== "verify-email") {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const email = decoded.email;

    const user = await prisma.user.update({
      where: { email },
      data: { verified: true },
    });

    const loginToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Verified",
      token: loginToken,
      user: publicUser(user),
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

/* LOGIN (blocked if email not verified) */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: String(email || "").trim().toLowerCase() },
    });
    if (!user || user.password !== password)
      return res.status(400).json({ error: "Invalid credentials" });

    if (!user.verified)
      return res.status(400).json({ error: "Please verify your email first." });

    res.json({
      message: "Login successful",
      userId: user.id,
      user: publicUser(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/customers/list", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
      include: { orders: { include: { items: true } } },
    });

    res.json(
      users.map((user) => {
        const orderCount = user.orders.length;
        const totalSpend = user.orders
          .filter((order) => order.status === "PAID" || order.status === "DELIVERED")
          .reduce((sum, order) => sum + order.total, 0);
        const latestOrder = user.orders.sort((a, b) => b.placedAt - a.placedAt)[0];

        return {
          ...publicUser(user),
          orderCount,
          totalSpend,
          latestOrder: formatOrder(latestOrder),
        };
      }),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET ALL ACTIVE ORDERS (ADMIN) */
router.get("/orders/active", async (_req, res) => {
  try {
    await reconcileDueOrders(prisma);
    const orders = await prisma.order.findMany({
      where: { status: { in: ACTIVE_STATUSES } },
      orderBy: { placedAt: "desc" },
      include: { items: true, user: true },
    });

    res.json(
      orders.map((order) => ({
        ...formatOrder(order),
        user: publicUser(order.user),
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders/all", async (_req, res) => {
  try {
    await reconcileDueOrders(prisma);
    const orders = await prisma.order.findMany({
      orderBy: { placedAt: "desc" },
      include: { items: true, user: true },
    });

    res.json(
      orders.map((order) => ({
        ...formatOrder(order),
        user: publicUser(order.user),
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET USER INFO */
router.get("/:id", async (req, res) => {
  try {
    await reconcileDueOrders(prisma);
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        orders: {
          orderBy: { placedAt: "desc" },
          include: { items: true },
        },
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const activeOrder = user.orders.find((order) =>
      ACTIVE_STATUSES.includes(order.status),
    );
    const orderHistory = user.orders.filter(
      (order) => !ACTIVE_STATUSES.includes(order.status),
    );

    res.json({
      ...publicUser(user),
      activeOrder: formatOrder(activeOrder),
      orderHistory: orderHistory.map(formatOrder),
      orders: user.orders.map(formatOrder),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE NAME */
router.put("/:id/name", async (req, res) => {
  try {
    const { name } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { name: String(name || "").trim() },
    });

    res.json(publicUser(user));
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/address", async (req, res) => {
  try {
    const address = String(req.body.address || "").trim();
    if (address.length < 8) return res.status(400).json({ error: "Enter a complete delivery address" });
    const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { address } });
    res.json(publicUser(user));
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "User not found" });
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE PASSWORD */
router.put("/:id/password", async (req, res) => {
  try {
    const { password } = req.body;
    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { password },
    });
    res.json({ message: "Password updated" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

/* DELETE ACCOUNT */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Account deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

/* ORDER DELIVERED */
router.post("/orders/:orderId/delivered", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.orderId } });
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status === "CANCELLED" || (order.paymentMethod === "STRIPE" && order.status === "PENDING")) {
      return res.status(400).json({ error: "Only paid orders can be delivered" });
    }
    if (order.status === "DELIVERED") return res.json({ success: true, order: formatOrder(order) });

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date(),
      },
      include: { items: true },
    });

    res.json({
      message: "Order marked delivered",
      success: true,
      order: formatOrder(updated),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/orders/:orderId/cancel", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.orderId } });
    const result = await cancelOrder({
      order,
      userId: req.body.userId,
      refundStripe: async (currentOrder) => {
        if (!currentOrder.stripeSessionId) throw new Error("Stripe session is missing");
        const session = await stripe.checkout.sessions.retrieve(currentOrder.stripeSessionId);
        const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
        if (!paymentIntent) throw new Error("Stripe payment could not be refunded");
        return stripe.refunds.create({ payment_intent: paymentIntent }, { idempotencyKey: `cancel-${currentOrder.id}` });
      },
    });
    await prisma.order.delete({ where: { id: order.id } });
    res.json({ success: true, deleted: true, orderId: order.id, message: result.message });
  } catch (error) {
    const status = /not found/i.test(error.message) ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
});

export default router;
