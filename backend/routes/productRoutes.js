import express from "express";
import NewProduct from "../models/Product.js";

const router = express.Router();

// ➕ Add one or multiple products
router.post("/addproduct", async (req, res) => {
  try {
    // If the body is an array => bulk insert
    if (Array.isArray(req.body)) {
      const products = req.body;

      // Basic validation for each product
      for (const p of products) {
        if (!p.title || !p.price || !p.category || !p.description || !p.images?.length) {
          return res.status(400).json({
            success: false,
            message: "Each product must include title, price, category, description, and images[]",
          });
        }
      }

      const savedProducts = await NewProduct.insertMany(products);
      return res.status(201).json({
        success: true,
        message: "Products added successfully",
        data: savedProducts,
      });
    }

    // Single product insert
    const { title, price, category, description, images } = req.body;

    if (!title || !price || !category || !description || !images?.length) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (title, price, category, description, images[]) are required",
      });
    }

    const newProduct = new NewProduct({ title, price, category, description, images });
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// 📋 Get all products
router.get("/product", async (req, res) => {
  try {
    const products = await NewProduct.find();
    // console.log(products);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🔍 Get product by ID
router.get("/product/:id", async (req, res) => {
  try {
    const product = await NewProduct.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ✏️ Update product
router.put("/product/:id", async (req, res) => {
  try {
    const { title, price, category, description, images } = req.body;

    const updatedProduct = await NewProduct.findByIdAndUpdate(
      req.params.id,
      { title, price, category, description, images },
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ❌ Delete product
router.delete("/product/:id", async (req, res) => {
  try {
    const deletedProduct = await NewProduct.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
