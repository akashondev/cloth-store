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
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(400).json({ error: "Invalid credentials" });

    if (!user.verified)
      return res.status(400).json({ error: "Please verify your email first." });

    res.json({
      message: "Login successful",
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET USER INFO */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE NAME */
router.put("/:id/name", async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE PASSWORD */
router.put("/:id/password", async (req, res) => {
  try {
    const { password } = req.body;
    await User.findByIdAndUpdate(req.params.id, { password });
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE ACCOUNT */
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PLACE ORDER */
router.post("/:id/place-order", async (req, res) => {
  try {
    const { id } = req.params;
    const { items, total, eta } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array is required" });
    }

    if (!total) {
      return res.status(400).json({ error: "Total is required" });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (
        !item.productId ||
        !item.qty ||
        !item.priceAtPurchase ||
        !item.title ||
        !item.image
      ) {
        return res.status(400).json({
          error:
            "Each item must have productId, qty, priceAtPurchase, title, and image",
        });
      }
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set active order
    user.activeOrder = {
      items: items.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        priceAtPurchase: item.priceAtPurchase,
        title: item.title,
        image: item.image,
      })),
      total,
      eta: eta || new Date(Date.now() + 45 * 60 * 1000), // Default 45 min
    };

    await user.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      activeOrder: user.activeOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({
      error: "Failed to place order",
      details: error.message,
    });
  }
});

/* GET ALL ACTIVE ORDERS (ADMIN) */
router.get("/orders/active", async (req, res) => {
  try {
    const users = await User.find({ activeOrder: { $ne: null } }).select(
      "name email activeOrder"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ORDER DELIVERED */
router.post("/:id/order-delivered", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.activeOrder) {
      return res.status(400).json({ error: "No active order" });
    }

    // Move active order to history
    if (!user.orderHistory) {
      user.orderHistory = [];
    }

    user.orderHistory.unshift(user.activeOrder);
    user.orderHistory = user.orderHistory.slice(0, 5); // Keep only last 5
    user.activeOrder = null;

    await user.save();

    res.json({
      message: "Order moved to history",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
