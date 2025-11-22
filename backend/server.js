import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Stripe from "stripe";

dotenv.config();

const app = express();


// Middleware
app.use(express.json());


// Routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to E-commerce API");
});

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
