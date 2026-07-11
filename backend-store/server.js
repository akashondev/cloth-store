import "dotenv/config";
import express from "express";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes, { webhookHandler } from "./routes/paymentRoutes.js";
import { prisma } from "./utils/prisma.js";
import { reconcileDueOrders } from "./utils/orderDelivery.js";

const app = express();

// CORS MUST BE HERE
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.post("/payment/webhook", express.raw({ type: "application/json" }), webhookHandler);

// Body parser
app.use(express.json());

// Routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/payment", paymentRoutes);

// Root test
app.get("/", (req, res) => {
  res.send("Welcome to E-commerce API");
});

// Port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));

reconcileDueOrders(prisma).catch((error) => console.error("Delivery reconciliation failed:", error.message));
const deliveryTimer = setInterval(() => {
  reconcileDueOrders(prisma).catch((error) => console.error("Delivery reconciliation failed:", error.message));
}, 60_000);
deliveryTimer.unref();
