import express from "express";
import { prisma } from "../utils/prisma.js";

const router = express.Router();

function normalizeProductPayload(body) {
  const images = Array.isArray(body.images)
    ? body.images.filter(Boolean)
    : [body.image].filter(Boolean);

  return {
    title: String(body.title || "").trim(),
    price: Number(body.price),
    category: String(body.category || "").trim() || null,
    description: String(body.description || "").trim() || null,
    image: images[0] || "",
  };
}

function validateProduct(payload) {
  if (!payload.title) return "Product title is required";
  if (!Number.isFinite(payload.price) || payload.price <= 0) {
    return "Product price must be a positive number";
  }
  if (!payload.category) return "Product category is required";
  if (!payload.description) return "Product description is required";
  if (!payload.image) return "At least one product image is required";
  return null;
}

function formatProduct(product) {
  return {
    id: product.id,
    title: product.title,
    price: Number(product.price),
    category: product.category || "",
    description: product.description || "",
    image: product.image || "",
    images: product.image ? [product.image] : [],
  };
}

router.post("/", async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const payload = req.body.map(normalizeProductPayload);
      const invalid = payload.map(validateProduct).find(Boolean);
      if (invalid) return res.status(400).json({ error: invalid });

      const created = await prisma.product.createMany({ data: payload });
      return res.status(201).json({ success: true, count: created.count });
    }

    const payload = normalizeProductPayload(req.body);
    const invalid = validateProduct(payload);
    if (invalid) return res.status(400).json({ error: invalid });

    const product = await prisma.product.create({ data: payload });
    res.status(201).json(formatProduct(product));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });
    res.json(products.map(formatProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(formatProduct(product));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const payload = normalizeProductPayload(req.body);
    const invalid = validateProduct(payload);
    if (invalid) return res.status(400).json({ error: invalid });

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: payload,
    });

    res.json(formatProduct(product));
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
