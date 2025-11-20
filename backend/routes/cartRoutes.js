import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// Get cart
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart || { userId: req.params.userId, items: [] });
});

// Add or increase quantity
router.post("/:userId/add", async (req, res) => {
  const { productId, qty } = req.body;
  let cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) {
    cart = await Cart.create({
      userId: req.params.userId,
      items: [{ productId, qty }],
    });
  } else {
    const item = cart.items.find((i) => i.productId === productId);

    if (item) {
      item.qty += qty;
    } else {
      cart.items.push({ productId, qty });
    }

    await cart.save();
  }

  res.json(cart);
});

// Update quantity
router.put("/:userId/update", async (req, res) => {
  const { productId, qty } = req.body;
  const cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.map((i) =>
    i.productId === productId ? { ...i._doc, qty } : i
  );

  await cart.save();
  res.json(cart);
});

// Remove
router.delete("/:userId/remove/:productId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((i) => i.productId !== req.params.productId);

  await cart.save();
  res.json(cart);
});

export default router;
