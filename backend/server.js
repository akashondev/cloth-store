import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

// CORS MUST BE HERE
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

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

// Database
mongoose.connect(process.env.MONGO_URI);

// Port
app.listen(5000, () => console.log("Server running"));
