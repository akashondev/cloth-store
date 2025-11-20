import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// CREATE (add product)
router.post("/", async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const saved = await Product.insertMany(req.body, { runValidators: true });
      return res.status(201).json({
        success: true,
        message: "Products added successfully",
        data: saved,
      });
    }

    const product = new Product(req.body);
    const saved = await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const data = await Product.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
