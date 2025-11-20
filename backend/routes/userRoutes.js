import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* CREATE USER */
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/* LOGIN (dummy version – add JWT later) */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return res.status(400).json({ error: "Invalid credentials" });

  res.json({ message: "Login successful", userId: user._id });
});

/* GET USER DETAILS */
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

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { password },
    { new: true }
  );

  res.json({ message: "Password updated" });
});

/* DELETE ACCOUNT */
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Account deleted" });
});

/* ADD / UPDATE CART (max 20 items enforced by schema) */
router.put("/:id/cart", async (req, res) => {
  const { cart } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { cart },
      { new: true, runValidators: true }
    );
    res.json(user.cart);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/* PLACE ORDER (moves activeOrder → history, keeps last 5) */
router.post("/:id/place-order", async (req, res) => {
  const { items, total, eta } = req.body;

  const user = await User.findById(req.params.id);

  user.activeOrder = { items, total, eta };
  await user.save();

  res.json(user.activeOrder);
});

/* MARK ORDER DELIVERED – move to history */
router.post("/:id/order-delivered", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user.activeOrder)
    return res.status(400).json({ error: "No active order" });

  user.orderHistory.unshift(user.activeOrder);
  user.orderHistory = user.orderHistory.slice(0, 5); // keep last 5
  user.activeOrder = null;

  await user.save();

  res.json({ message: "Order moved to history" });
});

export default router;
