import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateVerificationToken } from "../utils/generateToken.js";
import { VerifyEmail } from "../utils/VerifyEmail.js";

const router = express.Router();

/* REGISTER + SEND EMAIL VERIFICATION */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const token = generateVerificationToken(email);

    const emailSent = await VerifyEmail(email, token);
    if (!emailSent)
      return res
        .status(500)
        .json({ error: "Failed to send verification email" });

    await User.create({
      name,
      email,
      password,
      verified: false,
    });

    res.json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* VERIFY EMAIL */
router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );

    const loginToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Verified",
      token: loginToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

/* LOGIN (blocked if email not verified) */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return res.status(400).json({ error: "Invalid credentials" });

  if (!user.verified)
    return res.status(400).json({ error: "Please verify your email first." });

  res.json({ message: "Login successful", userId: user._id });
});

/* GET USER INFO */
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

/* UPDATE NAME */
router.put("/:id/name", async (req, res) => {
  const { name } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  res.json(user);
});

/* UPDATE PASSWORD */
router.put("/:id/password", async (req, res) => {
  const { password } = req.body;
  await User.findByIdAndUpdate(req.params.id, { password });
  res.json({ message: "Password updated" });
});

/* DELETE ACCOUNT */
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Account deleted" });
});

// /* PLACE ORDER */
// router.post("/:id/place-order", async (req, res) => {
//   const { items, total, eta } = req.body;

//   const user = await User.findById(req.params.id);
//   if (!user) return res.status(404).json({ error: "User not found" });

//   user.activeOrder = { items, total, eta };

//   const order = { items, total, placedAt: new Date() };

//   if (user.orderHistory.length >= 5) {
//     user.orderHistory.shift();
//   }
//   user.orderHistory.push(order);

//   await user.save();
//   res.json(user.activeOrder);
// });

/* PLACE ORDER */
router.post("/:id/place-order", async (req, res) => {
  try {
    const { items, total, eta } = req.body;

    // Validate payload
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items required" });
    }

    for (const item of items) {
      if (!item.productId || !item.qty || item.priceAtPurchase == null) {
        return res.status(400).json({ error: "Invalid order item structure" });
      }
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.activeOrder = { items, total, eta };

    const order = { items, total, placedAt: new Date() };

    if (user.orderHistory.length >= 5) user.orderHistory.shift();
    user.orderHistory.push(order);

    await user.save();

    res.json(user.activeOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ORDER DELIVERED */
router.post("/:id/order-delivered", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user.activeOrder)
    return res.status(400).json({ error: "No active order" });

  user.orderHistory.unshift(user.activeOrder);
  user.orderHistory = user.orderHistory.slice(0, 5);
  user.activeOrder = null;

  await user.save();

  res.json({ message: "Order moved to history" });
});

export default router;
